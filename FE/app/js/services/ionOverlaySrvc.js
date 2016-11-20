(function (angular) {
	angular
		.module('app')
		.service('ionOverlaySrvc', ionOverlaySrvc);

	ionOverlaySrvc.$inject = ['$q', '$ionicModal', '$rootScope', 'ionOverlayMap'];

	function ionOverlaySrvc($q, $ionicModal, $rootScope, ionOverlayMap) {
		this.setOverlay = setOverlay;
		
		/*
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
		function setOverlay(overlayObj) {

			var defer = $q.defer();

			if (!overlayObj) {
				console.error('message service [toast] no message obj', overlayObj);
				defer.reject();
			} else {

				// create a new scope for the modal
				var overlayScope = $rootScope.$new();

				// inject the contents of 'overlayObj.inject' into 'overlayScope'
				for (var key in overlayObj.inject) {
					overlayScope[key] = overlayObj.inject[key];
				}

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
			}

			return defer.promise;
		}
	}
})(angular);