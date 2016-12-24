(function (angular) {
	angular
		.module('app')
		.service('dataSrvc', dataSrvc);

	dataSrvc.$inject = ['$rootScope', 'apiMap', 'mockupMap', '_', '$http', '$q', 'ionErrorHandlerSrvc', 'cacheSrvc', 'cacheMap'];

	function dataSrvc($rootScope, apiMap, mockupMap, _, $http, $q, ionErrorHandlerSrvc, cacheSrvc, cacheMap) {
		
		// FUNCTIONS TO EXPORT
		this.api = api;										   // performs an API request
		this.enableMockedResponses = enableMockedResponses;	   // sets api() to check for mocked responses.
		this.disableMockedResponses = disableMockedResponses;  // sets api() to NOT check for mocked responses.

		/////////////////////

		var MOCKUP_ENABLED = true;

		/////////////////////

		function CfgUtilities() { }
		CfgUtilities.prototype._getUrl = function () {
			var requestSettings = apiMap[this.cfg.type];
			return requestSettings.url ||
				this._compileUrlTemplate(requestSettings.urlTemplate, this.cfg.urlParams);
		};
		CfgUtilities.prototype._getMethod = function () {
			return apiMap[this.cfg.type].method;
		};
		CfgUtilities.prototype._getData = function () {
			var requestSettings = apiMap[this.cfg.type];
			return requestSettings.noPayload ? null : this.cfg.data;
		};
		CfgUtilities.prototype._applyCfgDefaults = function () {
			if (this.cfg.useCachedRes === undefined) {
				this.cfg.useCachedRes = false;
			}
			if (this.cfg.saveResToCache === undefined) {
				this.cfg.saveResToCache = false;
			}
		};
		CfgUtilities.prototype._compileUrlTemplate = function (template, params) {
			return _.template(template)(params);
		};

		function ResponseGenerator(cfg) {
			this.cfg = cfg;
			this._applyCfgDefaults();
			this.url = this._getUrl();
			this.method = this._getMethod();
			this.data = this._getData();
		}
		ResponseGenerator.prototype = Object.create(CfgUtilities.prototype);
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
			var cacheId = this.method === 'POST' ? cacheMap.apiPost.id : cacheMap.apiGet.id;
			var cachedResponse = cacheSrvc.get(cacheId, this.url);
			return cachedResponse ? $q.resolve(cachedResponse) : undefined;
		};
		ResponseGenerator.prototype._makeHttpRequest = function () {
			if (this.method === 'POST') {
				return $http.post(this.url, this.data, this.cfg.reqConfig);
			} else if (this.method === 'GET') {
				return $http.get(this.url, this.cfg.reqConfig);
			} else {
				throw new Error('API requests can only be GET or POST.');
			}
		};

		function ResponseHandler(cfg) {
			this.cfg = cfg;
			this._applyCfgDefaults();
			this.url = this._getUrl();
			this.method = this._getMethod();
		}
		ResponseHandler.prototype = Object.create(CfgUtilities.prototype);
		ResponseHandler.prototype.finalizeApiCall = function (response) {
			var apiSuccessEvent = apiMap[this.cfg.type].event;
			if (apiSuccessEvent) {
				$rootScope.$broadcast(apiSuccessEvent);
			}
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
		ResponseHandler.prototype._saveResponseToCache = function (response) {
			var cacheId = this.method === 'POST' ? cacheMap.apiPost.id : cacheMap.apiGet.id;
			cacheSrvc.store(cacheId, this.url, response);
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