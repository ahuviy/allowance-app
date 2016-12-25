(function (angular) {
	angular
		.module('app')
		.service('dataSrvc', dataSrvc);

	dataSrvc.$inject = ['$rootScope', 'apiMap', 'mockupMap', '_', '$http', '$q', 'ionErrorHandlerSrvc', 'cacheSrvc', 'cacheMap'];

	function dataSrvc($rootScope, apiMap, mockupMap, _, $http, $q, ionErrorHandlerSrvc, cacheSrvc, cacheMap) {

		var FUNCTIONS_TO_EXPORT = {
			api: api,										// performs an API request
			enableMockedResponses: enableMockedResponses,	// sets api() to check for mocked responses.
			disableMockedResponses: disableMockedResponses  // sets api() to NOT check for mocked responses.
		};
		Object.assign(this, FUNCTIONS_TO_EXPORT);

		
		var MOCKUP_ENABLED = true;


		function ResponseBaseUtils() { }
		ResponseBaseUtils.prototype._getUrl = function () {
			var requestSpec = apiMap[this.cfg.type];
			return requestSpec.url ||
				this._compileUrlTemplate(requestSpec.urlTemplate, this.cfg.urlParams);
		};
		ResponseBaseUtils.prototype._getMethod = function () {
			return apiMap[this.cfg.type].method;
		};
		ResponseBaseUtils.prototype._getData = function () {
			return apiMap[this.cfg.type].noPayload ? null : this.cfg.data;
		};
		ResponseBaseUtils.prototype._applyCfgDefaults = function () {
			if (this.cfg.useCachedRes === undefined) {
				this.cfg.useCachedRes = false;
			}
			if (this.cfg.saveResToCache === undefined) {
				this.cfg.saveResToCache = false;
			}
		};
		ResponseBaseUtils.prototype._compileUrlTemplate = function (urlTemplate, params) {
			return _.template(urlTemplate)(params);
		};
		ResponseBaseUtils.prototype._getCacheId = function () {
			switch (this.method) {
				case 'GET':
					return cacheMap.apiGet.id;
				case 'POST':
					return cacheMap.apiPost.id;
				case 'PUT':
					return cacheMap.apiPut.id;
				case 'DELETE':
					return cacheMap.apiDelete.id;
				default:
					throw new Error('Bad API method');
			}
		};

		function ResponseGenerator(cfg) {
			this.cfg = cfg;
			this._applyCfgDefaults();
			this.url = this._getUrl();
			this.method = this._getMethod();
			this.data = this._getData();
		}
		ResponseGenerator.prototype = Object.create(ResponseBaseUtils.prototype);
		ResponseGenerator.prototype.generateResponsePromise = function () {
			var responsePromise;
			this._signalToStartBusyIndicator();
			if (MOCKUP_ENABLED) {
				responsePromise = this._attemptMockResponse();
			}
			if (!responsePromise && this.cfg.useCachedRes) {
				responsePromise = this._attemptCachedResponse();
			}
			if (!responsePromise) {
				responsePromise = this._makeHttpRequest();
			}
			return responsePromise;
		};
		ResponseGenerator.prototype._signalToStartBusyIndicator = function () {
			if (!this.cfg.disableBI) {
				$rootScope.$broadcast('startBI');
			}
		};
		ResponseGenerator.prototype._attemptMockResponse = function () {
			if (mockupMap[this.url] &&
				mockupMap[this.url].method === this.method &&
				angular.equals(mockupMap[this.url].data, this.data)) {
				return $q.resolve(mockupMap[this.url].mockup);
			} else {
				return undefined;
			}
		};
		ResponseGenerator.prototype._attemptCachedResponse = function () {
			var cachedResponse = cacheSrvc.get(this._getCacheId(), this.url);
			return cachedResponse ? $q.resolve(cachedResponse) : undefined;
		};
		ResponseGenerator.prototype._makeHttpRequest = function () {
			if (this.method === 'POST') {
				return $http.post(this.url, this.data, this.cfg.reqConfig);
			} else if (this.method === 'PUT') {
				return $http.put(this.url, this.data, this.cfg.reqConfig);
			} else if (this.method === 'GET') {
				return $http.get(this.url, this.cfg.reqConfig);
			} else if (this.method === 'DELETE') {
				return $http.get(this.url, this.cfg.reqConfig);
			} else {
				throw new Error('Bad method for API request.');
			}
		};

		function ResponseHandler(cfg) {
			this.cfg = cfg;
			this._applyCfgDefaults();
			this.url = this._getUrl();
			this.method = this._getMethod();
		}
		ResponseHandler.prototype = Object.create(ResponseBaseUtils.prototype);
		ResponseHandler.prototype.finalizeApiCall = function (response) {
			this._signalSuccessfulApi();
			if (this.cfg.saveResToCache) {
				this._saveResponseToCache(response);
			}
			this._signalToStopBusyIndicator();
			return $q.resolve(response);
		};
		ResponseHandler.prototype.handleResponseErrors = function (response) {
			this._signalToStopBusyIndicator();
			this._showErrorMessage(response);
			return $q.reject(response);
		};
		ResponseHandler.prototype._signalSuccessfulApi = function () {
			var successfulApiEvent = apiMap[this.cfg.type].event;
			if (successfulApiEvent) {
				$rootScope.$broadcast(successfulApiEvent);
			}
		};
		ResponseHandler.prototype._saveResponseToCache = function (response) {
			cacheSrvc.store(this._getCacheId(), this.url, response);
		};
		ResponseHandler.prototype._signalToStopBusyIndicator = function () {
			if (!this.cfg.disableBI) {
				$rootScope.$broadcast('stopBI');
			}
		};
		ResponseHandler.prototype._showErrorMessage = function (response) {
			if (!this.cfg.disableAutoErrorHandler) {
				ionErrorHandlerSrvc.show(this.cfg.specialErrorHandlerData || response.data);
			}
		};


		/**
		 * Attempts to mock a server response --> Attempts to use a previously-cached-response
		 * --> Sends an HTTP server-request --> Can save response in cache --> Passes response errors
		 * to the error-handler.
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
			var resGen = new ResponseGenerator(cfg);
			var resHandle = new ResponseHandler(cfg);

			return resGen.generateResponsePromise()
				.then(resHandle.finalizeApiCall.bind(resHandle))
				.catch(resHandle.handleResponseErrors.bind(resHandle));
		}


		function enableMockedResponses() {
			MOCKUP_ENABLED = true;
		}


		function disableMockedResponses() {
			MOCKUP_ENABLED = false;
		}
	}
})(angular);