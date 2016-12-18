(function (angular) {
	angular
		.module('app')
		.service('dataSrvc', dataSrvc);

	dataSrvc.$inject = ['$rootScope', 'apiMap', 'mockupMap', '_', '$http', '$q', 'ionErrorHandlerSrvc', 'cacheSrvc', 'cacheMap'];

	function dataSrvc($rootScope, apiMap, mockupMap, _, $http, $q, ionErrorHandlerSrvc, cacheSrvc, cacheMap) {
		// functions to export
		this.api = api;						// performs an API request
		this.getApiUrl = getApiUrl;			// gets the URL for a specified API request
		this.enableMockup = enableMockup;	// sets whether api() will check for mocked responses.

		/////////////////////

		var _mockupEnabled = true;

		/**
		 * 1) Attempts to mock a server response.
		 * 2) Attempts to use a previously-cached-response.
		 * 3) Sends a real HTTP request to the server.
		 * Note: only supports GET/POST requests.
		 * @param {Object} cfg Contains the options for the API request:
		 *   type {String} Specifies the api action to be taken (see apiMap.js).
		 *   data {Object} The data to pass in POST requests.
		 *   urlParams {Object} Parameters to compile the urlTemplate into a url.
		 *   useCachedRes {Boolean} Attempt to retrieve a previously-cached-response. Defaults to false.
		 *   saveResToCache {Boolean} Indicate whether to cache the response. Defaults to false.
		 *   reqConfig {Object} Config options to pass to the HTTP request. See angular docs: $http.
		 *   disableBI {Boolean} Disable the busy-indicator (see busyIndicatorDrtv.js).
		 *   disableAutoErrorHandler {Boolean} Disables the error-handler.
		 *   specialErrorHandlerData {String} Special text that replaces the default error text.
		 * @returns {Promise}
		 */
		function api(cfg) {
			applyCfgDefaults(cfg);
			signalToStartBusyIndicator(cfg);
			
			var url = getUrlFromCfg(cfg);
			var method = getMethodFromCfg(cfg);
			var data = getDataFromCfg(cfg);
			var responsePromise;

			if (_mockupEnabled) {
				responsePromise = attemptMockResponse(url, method, data);
			}
			if (!responsePromise && cfg.useCachedRes) {
				responsePromise = attemptCachedResponse(method, url);
			}
			if (!responsePromise) {
				responsePromise = makeHttpRequest(method, url, data, cfg.reqConfig);
			}
			return responsePromise.then(
				function (response) {
					return finalizeApiCall(response, cfg);
				},
				function (response) {
					return handleResponseErrors(response, cfg);
				}
			);
		}

		function applyCfgDefaults(cfg) {
			if (cfg.useCachedRes === undefined) {
				cfg.useCachedRes = false;
			}
			if (cfg.saveResToCache === undefined) {
				cfg.saveResToCache = false;
			}
		}

		/**
		 * Compile a URL-template into a URL using specified params.
		 * @param {String} template the URL template.
		 * @param {Object} params the parameters to use for compilation.
		 * @returns {String}
		 */
		function compileUrl(template, params) {
			return _.template(template)(params);
		}

		/**
		 * Retrieves the URL that is used in a specified API request.
		 * @param {String} type the type of API request.
		 * @param {Object} params parameters used to compile a urlTemplate.
		 * @returns {String}
		 */
		function getApiUrl(type, params) {
			return apiMap[type].url || compileUrl(apiMap[type].urlTemplate, params);
		}

		/**
		 * Check the mockupMap if there is a mocked response
		 * available for the specified request.
		 * @param {String} url the request-URL.
		 * @param {String} method 'GET' | 'POST'.
		 * @param {Object} data the data to pass in POST requests.
		 * @returns {Promise|null} a mocked-response-promise, or null if not found. 
		 */
		function attemptMockResponse(url, method, data) {
			if (mockupMap[url] &&
				mockupMap[url].method === method &&
				angular.equals(mockupMap[url].data, data)) {

				$q.resolve(mockupMap[url].mockup);
			} else {
				return undefined;
			}
		}

		function attemptCachedResponse(method, url) {
			var cacheId = method === 'POST' ? cacheMap.apiPost.id : cacheMap.apiGet.id;
			var cachedResponse = cacheSrvc.get(cacheId, url);
			return cachedResponse ? $q.resolve(cachedResponse) : undefined;
		}

		function makeHttpRequest(method, url, data, config) {
			if (method === 'POST') {
				return $http.post(url, data, config);
			} else if (method === 'GET') {
				return $http.get(url, config);
			} else {
				throw new Error('API requests can only be GET or POST.');
			}
		}

		function finalizeApiCall(response, cfg) {
			var apiSuccessEvent = apiMap[cfg.type].event;
			if (apiSuccessEvent) {
				$rootScope.$broadcast(apiSuccessEvent);
			}
			if (cfg.saveResToCache) {
				saveResponseToCache(response, cfg);
			}
			signalToStopBusyIndicator(cfg);
			return $q.resolve(response);
		}

		function handleResponseErrors(response, cfg) {
			signalToStopBusyIndicator(cfg);
			showErrorMessage(response, cfg);
			return $q.reject(response);
		}

		function saveResponseToCache(response, cfg) {
			var url = getUrlFromCfg(cfg);
			var method = getMethodFromCfg(cfg);
			var cacheId = method === 'POST' ? cacheMap.apiPost.id : cacheMap.apiGet.id;
			cacheSrvc.store(cacheId, url, response);
		}

		function getUrlFromCfg(cfg) {
			var requestSettings = apiMap[cfg.type];
			return requestSettings.url ||
				compileUrl(requestSettings.urlTemplate, cfg.urlParams);
		}

		function getMethodFromCfg(cfg) {
			return apiMap[cfg.type].method;
		}

		function getDataFromCfg(cfg) {
			var requestSettings = apiMap[cfg.type];
			return requestSettings.noPayload ? null : cfg.data;
		}

		function signalToStartBusyIndicator(cfg) {
			if (!cfg.disableBI) {
				$rootScope.$broadcast('startBI');
			}
		}
		function signalToStopBusyIndicator(cfg) {
			if (!cfg.disableBI) {
				$rootScope.$broadcast('stopBI');
			}
		}

		function showErrorMessage(response, cfg) {
			if (!cfg.disableAutoErrorHandler) {
				ionErrorHandlerSrvc.show(cfg.specialErrorHandlerData || response.data);
			}
		}

		/**
		 * Set the default API behavior whether to check for mocked responses.
		 * @param {Function|Boolean} condition a boolean or a function that returns a boolean.
		 */
		function enableMockup(condition) {
			var retval;
			if (angular.isFunction(condition)) {
				retval = condition();
				if (typeof retval !== 'boolean') {
					throw new Error('Error in enableMockup: condition evaluates to a non-boolean.');
				}
			} else if (typeof condition === 'boolean') {
				retval = condition;
			} else {
				throw new Error('Error in enableMockup: condition is of wrong type.');
			}
			_mockupEnabled = retval;
		}
	}
})(angular);