(function (angular) {
	angular
		.module('allowance')
		.controller('ParentsChildCtrl', ParentsChildCtrl);

	ParentsChildCtrl.$inject = ['children', '$stateParams', '$ionicModal', '$scope'];

	function ParentsChildCtrl(children, $stateParams, $ionicModal, $scope) {
		var vm = this;

		vm.child = children.getChildById($stateParams.childId);
		
		//////////////////////

		/**
		 * The deposit-modal
		 */
		
		$ionicModal.fromTemplateUrl('views/parent-deposit.html', {
			scope: $scope,
			animation: 'slide-in-up'
		}).then(function (modal) {
			$scope.depositModal = modal;
		});
		$scope.openDepositModal = function () {
			$scope.depositModal.show();
		};
		$scope.closeDepositModal = function () {
			$scope.depositModal.hide();
		};
		// Cleanup the modal when we're done with it!
		$scope.$on('$destroy', function () {
			$scope.depositModal.remove();
		});
		
		//////////////////////
	}
}(angular));