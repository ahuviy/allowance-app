(function (angular) {
	angular
		.module('app')
		.service('dataSrvc', dataSrvc);

	dataSrvc.$inject = ['$rootScope', 'apiMap', 'mockupSrvc', '_', '$http', '$q', 'ionErrorHandlerSrvc'];

	function dataSrvc($rootScope, apiMap, mockupSrvc, _, $http, $q, ionErrorHandlerSrvc) {
		this.api = api;

		/////////////////////

		/**
		 * Gets a URL from 'apiMap' (in /js/values). Then, it attempts
		 * to simulate the server response using the 'mockupSrvc'. If it can't
		 * simulate the response, it sends a real HTTP request to the server.
		 * @param {Object} cfg Contains the options for the API request:
		 * type {String} Describes the api action to be taken (see apiMap.js).
		 * args {Object} The args to pass in POST requests.
		 * urlObj {Object} Parameters to compile the urlTemplate into a url.
		 * disableBI {Boolean} Disable the busy-indicator (see busyIndicatorDrtv.js).
		 * disableAutoErrorHandler {Boolean} Disables the error-handler.
		 * specialErrorHandlerData {String} Special text that replaces the default error text.
		 * @returns {Promise}
		 */
		function api(cfg) {
			if (!cfg.disableBI) {
				$rootScope.$broadcast('startBI');
			}

			var reqObj = apiMap[cfg.type];
			var url = reqObj.url || _.template(reqObj.urlTemplate)(cfg.urlObj);
			var method = reqObj.method;
			var args = cfg.args;

			// Get the appropriate mock response from the 'mockupSrvc'
			var responsePromise = mockupSrvc.mockup(url, method, args);

			// If there is no appropriate mock response make a real HTTP request.
			if (responsePromise === null) {
				if (method === 'POST') {
					responsePromise = $http.post(url, reqObj.noPayload ? null : cfg.args);
				} else {
					responsePromise = $http.get(url);
				}
			}
			return wrapForErrorHandler(responsePromise, cfg);

			function wrapForErrorHandler(promise, cfg) {
				var defer = $q.defer();
				promise
					.then(function (response) {
						if (response.status !== 500) {
							$rootScope.$broadcast(apiMap[cfg.type].event);
							if (!cfg.disableBI) {
								$rootScope.$broadcast('stopBI');
							}
							defer.resolve(response);
						} else {
							defer.reject(response);
						}
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
	}
} (angular));