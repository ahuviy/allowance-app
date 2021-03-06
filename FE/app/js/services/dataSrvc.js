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
		ResponseBaseUtils.prototype._getCacheId = function () {
			switch (this.method) {
				case 'GET':
					return cacheMap.API_GET.id;
				case 'POST':
					return cacheMap.API_POST.id;
				case 'PUT':
					return cacheMap.API_PUT.id;
				case 'DELETE':
					return cacheMap.API_DELETE.id;
				default:
					throw new Error('Bad API method');
			}
		};
		ResponseBaseUtils.prototype._assignCfgDefaults = function () {
			var defaults = {
				useCachedRes: false,
				saveResToCache: false,
				disableErrorMsg: false,
				disableBI: false
			};
			this.cfg = Object.assign({}, defaults, this.cfg);
		};
		ResponseBaseUtils.prototype._checkInput = function () {
			if (!this.cfg) {
				throw new Error('must specify a cfg arg');
			}
			if (!this.cfg.type) {
				throw new Error('missing type parameter');
			}
			var reqSpec = apiMap[this.cfg.type];
			if (!reqSpec) {
				throw new Error('apiMap doesn\'t contain entry that corresponds to given type');
			}
			if (['POST', 'PUT'].indexOf(reqSpec.method) > -1 && !this.cfg.data && !reqSpec.noPayload) {
				throw new Error('PUT and POST methods must have data or a noPayload flag');
			}
			if (!reqSpec.url && !reqSpec.urlTemplate) {
				throw new Error('must specify a url or urlTemplate in apiMap');
			}
			if (!reqSpec.url && reqSpec.urlTemplate && !this.cfg.urlParams) {
				throw new Error('when using urlTemplate you must include urlParams');
			}
		};
		ResponseBaseUtils.prototype._compileUrlTemplate = function (urlTemplate, params) {
			return _.template(urlTemplate)(params);
		};
		ResponseBaseUtils.prototype._signalToStartBusyIndicator = function () {
			if (!this.cfg.disableBI) {
				$rootScope.$broadcast('startBI');
			}
		};
		ResponseBaseUtils.prototype._signalToStopBusyIndicator = function () {
			if (!this.cfg.disableBI) {
				$rootScope.$broadcast('stopBI');
			}
		};

		function ResponseGenerator(cfg) {
			this.cfg = cfg;
			this._assignCfgDefaults();
			this._checkInput();
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
			switch (this.method) {
				case 'POST':
					return $http.post(this.url, this.data, this.cfg.reqConfig);
				case 'PUT':
					return $http.put(this.url, this.data, this.cfg.reqConfig);
				case 'GET':
					return $http.get(this.url, this.cfg.reqConfig);
				case 'DELETE':
					return $http.delete(this.url, this.cfg.reqConfig);
				default:
					throw new Error('Bad method for API request.');
			}
		};

		function ResponseHandler(cfg) {
			this.cfg = cfg;
			this._assignCfgDefaults();
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
			if (!this.cfg.disableErrorMsg) {
				this._showErrorMessage(response);
			}
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
		ResponseHandler.prototype._showErrorMessage = function (response) {
			ionErrorHandlerSrvc.show(this.cfg.errorMsgText || response.data);
		};


		/**
		 * Attempts to mock a server response --> Attempts to use a previously-cached-response
		 * --> Sends an HTTP server-request --> Can save response in cache --> Passes response errors
		 * to the error-handler.
		 * @param {Object} cfg Contains the options for the API request:
		 *   {String}  type:            Specifies the api action to be taken (see apiMap.js).
		 *   {Object}  data:            The data to pass in POST/PUT requests.
		 *   {Object}  urlParams:       Parameters to compile the urlTemplate into a url.
		 *   {Boolean} useCachedRes:    Attempt to retrieve a previously-cached-response. Default: false.
		 *   {Boolean} saveResToCache:  Indicate whether to cache the response. Default: false.
		 *   {Object}  reqConfig:       Optional config to pass to the HTTP request. See angular docs: $http.
		 *   {Boolean} disableBI:       Disable the busy-indicator (see busyIndicatorDrtv.js). Default: false.
		 *   {Boolean} disableErrorMsg: Disables the error-message for an unsuccessful request. Default: false.
		 *   {String}  errorMsgText:    Optional text that replaces the default error-text.
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