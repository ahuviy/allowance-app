(function (angular) {
	angular
		.module('app')
		.service('dataSrvc', dataSrvc);

	dataSrvc.$inject = ['$rootScope', 'apiMap', 'mockupSrvc', '_', '$http', '$q', 'ionErrorHandlerSrvc', '$cacheFactory', 'cacheMap'];

	function dataSrvc($rootScope, apiMap, mockupSrvc, _, $http, $q, ionErrorHandlerSrvc, $cacheFactory, cacheMap) {
		this.api = api;
		this.getApiUrl = getApiUrl;

		/////////////////////

		/**
		 * First, attempts to mock a server response via 'mockupSrvc'. If unseccessful, attempts
		 * to use a previously-cached-response. If unsuccessful, sends a real HTTP request to the
		 * server. Only supports GET/POST requests.
		 * @param {Object} cfg Contains the options for the API request:
		 *   type {String} Describes the api action to be taken (see apiMap.js).
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

			// attempt to get a mock response
			var responsePromise = mockupSrvc.mockup(url, method, data);
			if (responsePromise) {
				return wrapForErrorHandler(responsePromise, cfg);
			}

			// attempt to retrieve a previously-cached-response
			if (cfg.useCachedRes) {
				var cacheId = method === 'POST' ? cacheMap.apiPost.id : cacheMap.apiGet.id;
				var cachedResponse = $cacheFactory.get(cacheId).get(url);
				if (cachedResponse) {
					responsePromise = asyncRespondFromCache(cachedResponse);
					return wrapForErrorHandler(responsePromise, cfg);
				}
			}

			// make a real HTTP request.
			if (method === 'POST') {
				responsePromise = $http.post(url, data, cfg.reqConfig);
			} else if (method === 'GET') {
				responsePromise = $http.get(url, cfg.reqConfig);
			} else {
				throw new Error('API requests can only be GET or POST.');
			}
			return wrapForErrorHandler(responsePromise, cfg);

			function asyncRespondFromCache(cacheRes) {
				var defer = $q.defer();
				defer.resolve(cacheRes);
				return defer.promise;
			}

			function wrapForErrorHandler(responsePromise, cfg) {
				var defer = $q.defer();
				responsePromise
					.then(function (response) {
						$rootScope.$broadcast(reqObj.event);

						// save response to cache
						if (cfg.saveResToCache) {
							var cacheId = method === 'POST' ? cacheMap.apiPost.id : cacheMap.apiGet.id;
							var cache = $cacheFactory.get(cacheId) || $cacheFactory(cacheId);
							cache.put(url, response);
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
		 */
		function getApiUrl(type, params) {
			return apiMap[type].url || compileUrl(apiMap[type].urlTemplate, params);
		}
	}
})(angular);