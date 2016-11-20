(function (angular) {
	angular
		.module('app')
		.controller('depositOverlayCtrl', depositOverlayCtrl);

	depositOverlayCtrl.$inject = ['$scope', 'localStorageSrvc'];

	function depositOverlayCtrl($scope, localStorageSrvc) {
		var parentId = '';
		var vm = this;
		vm.submitDeposit = submitDeposit;
		vm.dataToSubmit = {};
		vm.selectDepositType = []; // config data for the <select> DOM element

		activate();

		function activate() {
			parentId = localStorageSrvc.get('parentId', '');
			
			// vars for the <select> html element
			vm.selectDepositType = [
				{
					label: 'Normal',
					value: 'single'
				},
				{
					label: 'Weekly',
					value: 'weekly'
				},
				{
					label: 'Monthly',
					value: 'monthly'
				}];

			// reset the data-to-submit
			vm.dataToSubmit = {
				userId: $scope.childId, // was injected to the overlay
				type: 'deposit',
				description: '',
				sum: undefined,
				performedBy: parentId,
				timestamp: undefined, // will be set on submission
				depositType: 'single'
			};
		}

		function submitDeposit() {
			// set timestamp
			vm.dataToSubmit.timestamp = Date.parse(new Date()); 

			console.log(vm.dataToSubmit, 'submitting deposit');
			$scope.resolveModal(vm.dataToSubmit);
		}
	}
})(angular);