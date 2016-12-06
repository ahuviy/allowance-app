(function (angular) {
	angular
		.module('app')
		.service('ionOverlaySrvc', ionOverlaySrvc);

	ionOverlaySrvc.$inject = ['$q', '$ionicModal', '$rootScope', 'ionOverlayMap'];

	function ionOverlaySrvc($q, $ionicModal, $rootScope, ionOverlayMap) {
		this.setOverlay = setOverlay;

		/**
		    @param: overlayObj
		    overlayObj: {
				type: the specific overlay name, found in 'ionOverlayMap.js'
				inject: object with contents that will be injected to
						'overlayScope' (that contains the overlay-controller).
		    }
			
			- Open the overlay by calling 'ionOverlaySrvc.setOverlay(overlayObj);'
			
			- The overlay controller needs to be inserted in the overlay template
			  as so: <ion-modal-view ng-controller="[ControllerName]">.
			
			- Define all overlays in 'ionOverlayMap.js'
			
			- Close the overlay in its controller via -
				success- $scope.dismissModal();
			  	failure- $scope.resolveModal();
		*/
		function setOverlay(options) {
			var defer = $q.defer();
			if (!options) {
				var err = 'No parameter was supplied to setOverlay.';
				console.error(err);
				defer.reject(err);
			}
			// create a new scope for the modal
			var overlayScope = $rootScope.$new();

			// inject the contents of 'options.inject' into 'overlayScope'
			angular.forEach(options.inject, function (value, key) {
				overlayScope[key] = value;
			});
			// for (var key in options.inject) {
			// 	overlayScope[key] = options.inject[key];
			// }

			// use this for successful termination of the modal
			overlayScope.resolveModal = function (data) {
				defer.resolve(data);
				overlayScope.modal.remove();
				overlayScope.$destroy();
			};

			// use this for un-successful termination of the modal
			overlayScope.dismissModal = function (data) {
				defer.reject(data);
				overlayScope.modal.remove();
				overlayScope.$destroy();
			};

			// create the modal in the 'overlayScope' and open it
			var modalTemplate = ionOverlayMap[overlayObj.type];
			$ionicModal.fromTemplateUrl(modalTemplate.templateUrl, {
				animation: 'slide-in-up',
				scope: overlayScope
			}).then(function (modal) {
				overlayScope.modal = modal;
				overlayScope.modal.show();
			});

			return defer.promise;
		}
	}
})(angular);