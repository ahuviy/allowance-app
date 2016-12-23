(function (angular) {
	angular
		.module('app')
		.service('ionOverlaySrvc', ionOverlaySrvc);

	ionOverlaySrvc.$inject = ['$q', '$ionicModal', '$rootScope', 'ionOverlayMap'];

	function ionOverlaySrvc($q, $ionicModal, $rootScope, ionOverlayMap) {

		// functions to export
		this.setOverlay = setOverlay;

		///////////

		/**
		 * Opens a new overlay. The overlay controller needs to be inserted in the template-file
		 * as so: <ion-modal-view ng-controller="ControllerName">. Define all overlays in
		 * 'ionOverlayMap.js'. Close the overlay in its controller via the supplied functions.
		 * @param {Object} options
		 *    {String} type:   the specific overlay name, found in 'ionOverlayMap.js'.
		 *    {Scope}  scope:  optional parent-scope for the new overlay. Defaults to $rootScope.
		 *	  {Object} inject: contents will be injected to the overlay scope.
		 * @returns {Promise}
		 */
		function setOverlay(options) {
			if (!options && !options.type) {
				throw new Error('Bad input parameter');
			}
			var defer = $q.defer();
			var overlayScope = options.scope ? options.scope.$new() : $rootScope.$new();
			injectVarsIntoOverlayScope();
			setOverlayTerminationFunctions();
			createOverlayAndOpen();
			return defer.promise;

			function injectVarsIntoOverlayScope() {
				angular.forEach(options.inject, function (value, key) {
					overlayScope[key] = value;
				});
			}

			function setOverlayTerminationFunctions() {
				overlayScope.resolveModal = function (data) {
					defer.resolve(data);
					overlayScope.modal.remove();
					overlayScope.$destroy();
				};

				overlayScope.dismissModal = function (data) {
					defer.reject(data);
					overlayScope.modal.remove();
					overlayScope.$destroy();
				};
			}

			function createOverlayAndOpen() {
				var modalTemplate = ionOverlayMap[options.type];
				$ionicModal.fromTemplateUrl(modalTemplate.templateUrl, {
					animation: 'slide-in-up',
					scope: overlayScope
				}).then(function (modal) {
					overlayScope.modal = modal;
					overlayScope.modal.show();
				});
			}
		}
	}
})(angular);