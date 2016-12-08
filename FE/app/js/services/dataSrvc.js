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
		 * 1) Attempts to mock a server response via mockupMap.
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
			if (cfg.useCachedRes === undefined) {
				cfg.useCachedRes = false;
			}
			if (cfg.saveResToCache === undefined) {
				cfg.saveResToCache = false;
			}
			if (!cfg.disableBI) {
				$rootScope.$broadcast('startBI');
			}
			var reqObj = apiMap[cfg.type];
			var url = reqObj.url || compileUrl(reqObj.urlTemplate, cfg.urlParams);
			var method = reqObj.method;
			var data = reqObj.noPayload ? null : cfg.data;
			var responsePromise;
			
			// attempt to get a mock response
			if (_mockupEnabled) {
				responsePromise = mockup(url, method, data);
				if (responsePromise) {
					return wrapForErrorHandler(responsePromise);
				}
			}

			// attempt to retrieve a previously-cached-response
			if (cfg.useCachedRes) {
				var cacheId = method === 'POST' ? cacheMap.apiPost.id : cacheMap.apiGet.id;
				var cachedResponse = cacheSrvc.get(cacheId, url);
				if (cachedResponse) {
					responsePromise = asyncWrapper(cachedResponse);
					return wrapForErrorHandler(responsePromise);
				}
			}

			// make an HTTP request
			if (method === 'POST') {
				responsePromise = $http.post(url, data, cfg.reqConfig);
			} else if (method === 'GET') {
				responsePromise = $http.get(url, cfg.reqConfig);
			} else {
				throw new Error('API requests can only be GET or POST.');
			}
			return wrapForErrorHandler(responsePromise);

			function wrapForErrorHandler(responsePromise) {
				var defer = $q.defer();
				responsePromise
					.then(function (response) {
						$rootScope.$broadcast(reqObj.event);

						// save response to cache
						if (cfg.saveResToCache) {
							var cacheId = method === 'POST' ? cacheMap.apiPost.id : cacheMap.apiGet.id;
							cacheSrvc.store(cacheId, url, response);
						}

						if (!cfg.disableBI) {
							$rootScope.$broadcast('stopBI');
						}
						defer.resolve(response);
					})
					.catch(function (response) {
						if (!cfg.disableBI) {
							$rootScope.$broadcast('stopBI');
						}
						if (!cfg.disableAutoErrorHandler) {
							ionErrorHandlerSrvc.show(cfg.specialErrorHandlerData || response.data);
						}
						return defer.reject(response);
					});
				return defer.promise;
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
		 * A wrapper that converts data into a promise.
		 * @param {Any} data
		 * @returns {Promise}
		 */
		function asyncWrapper(data) {
			var defer = $q.defer();
			defer.resolve(data);
			return defer.promise;
		}

		/**
		 * Check the mockupMap if there is a mocked response
		 * available for the specified request.
		 * @param {String} url the request-URL.
		 * @param {String} method 'GET' | 'POST'.
		 * @param {Object} data the data to pass in POST requests.
		 * @returns {Promise|null} a mocked-response-promise, or null if not found. 
		 */
		function mockup(url, method, data) {
			var defer = $q.defer();
			if (mockupMap[url] &&
				mockupMap[url].method === method &&
				angular.equals(mockupMap[url].data, data)) {
				defer.resolve(mockupMap[url].mockup);
			} else {
				return null;
			}
			return defer.promise;
		}

		/**
		 * Set the default API behavior whether to check for mocked responses.
		 * @param {Function|Boolean} condition a function that returns a boolean or a boolean.
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