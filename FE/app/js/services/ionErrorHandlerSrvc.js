(function (angular) {
	angular
		.module('app')
		.service('ionErrorHandlerSrvc', ionErrorHandlerSrvc);

	ionErrorHandlerSrvc.$inject = ['$q', 'overlaySrvc'];

	function ionErrorHandlerSrvc($q, overlaySrvc) {

		var FUNCTIONS_TO_EXPORT = {
            show: show
        };
        Object.assign(this, FUNCTIONS_TO_EXPORT);


		function show(errorData) {
			overlaySrvc.setOverlay({
				type: 'error',
				inject: { errorData: errorData }
			});
		}
	}
})(angular);