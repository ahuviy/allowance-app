(function (angular) {
	angular
		.module('app')
		.controller('withdrawOverlayCtrl', withdrawOverlayCtrl);

	withdrawOverlayCtrl.$inject = ['$scope', 'locStoreSrvc', 'locStoreMap', 'authSrvc'];

	function withdrawOverlayCtrl(withdrawOverlayCtrl, locStoreSrvc, locStoreMap, authSrvc) {
		var credentials;
		var $scope = this;
		
		init();

		function init() {
			// skip to login if parent is not authenticated
			authSrvc.redirectToLoginIfNotAuth();
			
			credentials = locStoreSrvc.getObject(locStoreMap.credentials, {});
			
			// reset the data-to-submit
			$scope.dataToSubmit = {
				userId: withdrawOverlayCtrl.childId, // was injected to the overlay
				type: 'withdraw',
				description: '',
				sum: undefined,
				performedBy: credentials.username,
				timestamp: undefined
			};
		}

		$scope.submitWithdraw = function () {
			// set timestamp
			$scope.dataToSubmit.timestamp = Date.parse(new Date()); 

			console.log($scope.dataToSubmit, 'submitting withdraw');
			withdrawOverlayCtrl.resolveModal($scope.dataToSubmit);
		};
	}
})(angular);