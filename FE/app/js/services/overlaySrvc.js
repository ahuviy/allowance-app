(function (angular) {
	angular
		.module('app')
		.service('overlaySrvc', overlaySrvc);

	overlaySrvc.$inject = ['$q', '$ionicModal', '$rootScope', 'ionOverlayMap', '$ionicPopup', 'routeSrvc'];

	function overlaySrvc($q, $ionicModal, $rootScope, ionOverlayMap, $ionicPopup, routeSrvc) {

		// FUNCTIONS TO EXPORT
		this.setOverlay = setOverlay;
		this.alertPopup = alertPopup;
		this.confirmPopup = confirmPopup;


		function ModalGenerator(options) {
			if (!options && !options.type) {
				throw new Error('Bad input parameter');
			}
			this.options = options;
			this.defer = $q.defer();
		}
		ModalGenerator.prototype.setDefaults = function () {
			this.options.animation = this.options.animation || 'slide-in-up';
			this.options.scope = this.options.scope || $rootScope;
		};
		ModalGenerator.prototype.createOverlayScope = function () {
			this.overlayScope = this.options.scope.$new();
		};
		ModalGenerator.prototype.injectVarsIntoOverlayScope = function () {
			angular.forEach(this.options.inject, injectVars, this);
			function injectVars(value, key) {
				this.overlayScope[key] = value;
			}
		};
		ModalGenerator.prototype.insertTerminationFuncsInOverlayScope = function () {
			this.overlayScope.resolveModal = resolveModal.bind(this);
			this.overlayScope.dismissModal = dismissModal.bind(this);

			function resolveModal(data) {
				this.defer.resolve(data);
				_destroyModal.bind(this)();
			}

			function dismissModal(data) {
				this.defer.reject(data);
				_destroyModal.bind(this)();
			}

			function _destroyModal() {
				this.overlayScope.modal.remove();
				this.overlayScope.$destroy();
			}
		};
		ModalGenerator.prototype.createOverlay = function () {
			var modalTemplate = ionOverlayMap[this.options.type];
			return $ionicModal.fromTemplateUrl(modalTemplate.templateUrl, {
				animation: this.options.animation,
				scope: this.overlayScope
			});
		};
		ModalGenerator.prototype.openCreatedOverlay = function (modal) {
			this.overlayScope.modal = modal;
			this.overlayScope.modal.show();
		};
		ModalGenerator.prototype.getDefer = function () {
			return this.defer;
		};


		/**
		 * Opens a new overlay. The overlay controller needs to be inserted in the template-file
		 * as so: <ion-modal-view ng-controller="ControllerName">. Define all overlays in
		 * 'ionOverlayMap.js'. Close the overlay in its controller via the supplied functions.
		 * @param {Object} options
		 *    {String} type:      the specific overlay name, found in 'ionOverlayMap.js'.
		 *    {Scope}  scope:     optional parent-scope for the new overlay. Defaults to $rootScope.
		 *	  {Object} inject:    contents will be injected to the overlay scope.
		 *	  {String} animation: animation-type for overlay-entrance. Defaults to 'slide-in-up'.
		 * @returns {Promise}
		 */
		function setOverlay(options) {
			var modalGen = new ModalGenerator(options);
			modalGen.setDefaults();
			modalGen.createOverlayScope();
			modalGen.injectVarsIntoOverlayScope();
			modalGen.insertTerminationFuncsInOverlayScope();
			modalGen.createOverlay()
				.then(modalGen.openCreatedOverlay.bind(modalGen));
			return modalGen.getDefer().promise;
		}

		// default callback is to reload page
		function alertPopup(title, template, callback) {
			var cb = angular.isFunction(callback) ? callback : routeSrvc.reload;
			$ionicPopup.alert({
				title: title,
				template: template
			}).then(cb);
		}

		function confirmPopup(title, template, successCb, failureCb) {
			$ionicPopup.confirm({
				title: title,
				template: template
			}).then(function (res) {
				var cb = res ? successCb : failureCb;
				if (angular.isFunction(cb)) {
					cb();
				}
			});
		}
	}
})(angular);