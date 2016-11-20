(function (angular) {
	angular
		.module('app')
		.controller('withdrawOverlayCtrl', withdrawOverlayCtrl);

	withdrawOverlayCtrl.$inject = ['$scope', 'localStorageSrvc'];

	function withdrawOverlayCtrl($scope, localStorageSrvc) {
		var parentId = '';
		var vm = this;
		vm.submitWithdraw = submitWithdraw;
		vm.dataToSubmit = {};
		
		activate();

		function activate() {
			parentId = localStorageSrvc.get('parentId', '');
			
			// reset the data-to-submit
			vm.dataToSubmit = {
				userId: $scope.childId, // was injected to the overlay
				type: 'withdraw',
				description: '',
				sum: undefined,
				performedBy: parentId,
				timestamp: undefined
			};
		}

		function submitWithdraw() {
			// set timestamp
			vm.dataToSubmit.timestamp = Date.parse(new Date()); 

			console.log(vm.dataToSubmit, 'submitting withdraw');
			$scope.resolveModal(vm.dataToSubmit);
		}
	}
})(angular);