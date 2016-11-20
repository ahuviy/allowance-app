(function (angular) {
	angular
		.module('app')
		.service('ionErrorHandlerSrvc', ionErrorHandlerSrvc);

	ionErrorHandlerSrvc.$inject = ['$q', 'ionOverlaySrvc'];

	function ionErrorHandlerSrvc($q, ionOverlaySrvc) {
		this.show = show;

		function show(errorData) {
			// popup
			ionOverlaySrvc.setOverlay({
				type: 'error',
				inject: {
					errorData: errorData
				}
			});
		}
	}
})(angular);