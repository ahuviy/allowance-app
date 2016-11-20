/*
 * The data-service handles all HTTP requests
 */
(function (angular) {
	angular
		.module('app')
		.service('dataSrvc', dataSrvc);

	dataSrvc.$inject = ['$rootScope', 'apiMap', 'mockupSrvc', '_', '$http', '$q', 'ionErrorHandlerSrvc'];

	function dataSrvc($rootScope, apiMap, mockupSrvc, _, $http, $q, ionErrorHandlerSrvc) {
		this.api = api;

		/*
		 * api
		 * This function gets a URL from 'apiMap' (in /js/values). Then, it attempts
		 * to simulate the server response using the 'mockupSrvc'. If it can't
		 * simulate the response, it sends a real HTTP request to the server.
		 *
		 * @params:
		 * cfg {
		 * 		type (string): describes the api action to be taken (see apiMap.js)
		 *		args (obj): the args to pass in POST requests
		 *		urlObj (obj): parameters to compile the urlTemplate into a url
		 *		specialErrorHandlerData (string)
		 *		disableAutoErrorHandler (bool)
		 *		disableBI (bool): disable the busy-indicator (see busyIndicatorDrtv.js)
		 * }
		 */
		function api(cfg) {
			// Signal the 'busy-indicator' event, unless cfg.disableBI = true
			if (!cfg.disableBI) {
				$rootScope.$broadcast('startBI');
			}

			var reqObj = apiMap[cfg.type];
			var url = reqObj.url || _.template(reqObj.urlTemplate)(cfg.urlObj);
			var method = reqObj.method;
			var args = cfg.args;

			/*
			 * Get the appropriate mock response from the 'mockupSrvc'
			 */
			var responsePromise = mockupSrvc.mockup(url, method, args);

			/*
			 * If there is no appropriate mock response (mockupSrvc returns null),
			 * make a real HTTP request.
			 */
			if (responsePromise === null) {
				if (method === 'POST') {
					responsePromise = $http.post(url, reqObj.noPayload ? null : cfg.args);
				} else {
					responsePromise = $http.get(url);
				}
			}

			return wrapForErrorHandler(responsePromise, cfg);
		}

		function wrapForErrorHandler(promise, cfg) {
			var defer = $q.defer();
			promise.then(success, hasError);
			return defer.promise;

			/*
			 * If the HTTP request was successful (and response status is not 500),
			 * broadcast the event that was defined in 'apiMap' and another event
			 * to stop the busy-indicator.
			 */
			function success(response) {
				if (response.status !== 500) {
					$rootScope.$broadcast(apiMap[cfg.type].event);
					if (!cfg.disableBI) {
						$rootScope.$broadcast('stopBI');
					}
					defer.resolve(response);
				} else {
					hasError(response);
				}
			}

			/*
			 * If the HTTP request was unsuccessful, broadcast the event to stop
			 * the busy-indicator and console.log an error.
			 */
			function hasError(response) {
				if (!cfg.disableBI) {
					$rootScope.$broadcast('stopBI');
				}
				if (!cfg.disableAutoErrorHandler) {
					ionErrorHandlerSrvc.show(cfg.specialErrorHandlerData || response.data);
				}
				return defer.reject(response);
			}
		}
	}
}(angular));