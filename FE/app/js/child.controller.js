(function (angular) {
	angular
		.module('app')
		.controller('ChildCtrl', ChildCtrl);

	ChildCtrl.$inject = ['children', '$stateParams', '$ionicModal', '$scope'];

	function ChildCtrl(children, $stateParams, $ionicModal, $scope) {
		var vm = this;

		vm.child = children.getChildById($stateParams.childId);
		
		//////////////////////

		/**
		 * The deposit-modal
		 */
		
		$ionicModal.fromTemplateUrl('views/deposit-modal.html', {
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
		
		/**
		 * The withdraw-modal
		 */
		
		$ionicModal.fromTemplateUrl('views/withdraw-modal.html', {
			scope: $scope,
			animation: 'slide-in-up'
		}).then(function (modal) {
			$scope.withdrawModal = modal;
		});
		$scope.openWithdrawModal = function () {
			$scope.withdrawModal.show();
		};
		$scope.closeWithdrawModal = function () {
			$scope.withdrawModal.hide();
		};
		// Cleanup the modal when we're done with it!
		$scope.$on('$destroy', function () {
			$scope.withdrawModal.remove();
		});
	}
}(angular));