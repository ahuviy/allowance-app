(function (angular) {
	angular
		.module('app')
		.service('ionErrorHandlerSrvc', ionErrorHandlerSrvc);

	ionErrorHandlerSrvc.$inject = ['$q', 'overlaySrvc'];

	function ionErrorHandlerSrvc($q, overlaySrvc) {

		// FUNCTIONS TO EXPORT
		this.show = show;


		function show(errorData) {
			overlaySrvc.setOverlay({
				type: 'error',
				inject: { errorData: errorData }
			});
		}
	}
})(angular);