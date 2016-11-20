(function (angular) {
	angular
		.module('app')
		.service('ionErrorHandlerSrvc', ionErrorHandlerSrvc);

	ionErrorHandlerSrvc.$inject = ['$q', 'ionOverlaySrvc', '$ionicPopup', '$state'];

	function ionErrorHandlerSrvc($q, ionOverlaySrvc, $ionicPopup, $state) {

		// An error modal
		this.show = function (errorData) {
			ionOverlaySrvc.setOverlay({
				type: 'error',
				inject: { errorData: errorData }
			});
		};

		// An alert dialog popup
		this.alertPopup = function (title, template) {
			$ionicPopup.alert({ title: title, template: template })
				.then(function () {
					// reload current page
					$state.go($state.current, {}, { reload: true });
				});
		};

		// A confirm dialog popup
		this.confirmPopup = function (title, template, successCb, failureCb) {
			$ionicPopup.confirm({ title: title, template: template })
				.then(function (res) {
					if (res) {
						if (successCb) { successCb(); }
					} else {
						if (failureCb) { failureCb(); }
					}
				});
		};
	}
})(angular);