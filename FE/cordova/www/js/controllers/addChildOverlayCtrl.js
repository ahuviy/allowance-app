(function (angular) {
	angular
		.module('app')
		.controller('addChildOverlayCtrl', addChildOverlayCtrl);

	addChildOverlayCtrl.$inject = ['$scope', 'dataSrvc', '$state'];

	function addChildOverlayCtrl($scope, dataSrvc, $state) {
		var vm = this;
		vm.title = '';
		vm.creatingNewChild = false;
		vm.dataToSubmit = {};
		vm.submitChild = submitChild;
		vm.cancelModal = cancelModal;
		vm.deleteChild = deleteChild;
		
		activate();

		function activate() {
			// title could have been injected in the modal to $scope.title
			vm.title = (typeof $scope.title === 'undefined') ? 'Add Child' : $scope.title;

			if (typeof $scope.child === 'undefined') {
				// CREATE A NEW CHILD (if child was not injected in the modal)
				vm.creatingNewChild = true;
				vm.dataToSubmit = {
					interestRate: 0,
					rebateRate: 0
				};

				// get a new account no. if there is no injected child
				dataSrvc
					.api({ type: 'generateNewAccountNumber' })
					.then(function (res) {
						console.log(res, 'res');
						vm.dataToSubmit.accountNo = res.data;
					});
			} else {
				// UPDATE AN EXISTING CHILD
				vm.creatingNewChild = false;
				vm.dataToSubmit = $scope.child;
				vm.dataToSubmit.password = $scope.childPassword;
				vm.dataToSubmit.accountNo = $scope.childAccountNo;
			}
		}

		function submitChild() {
			// resolve the modal with the submit data
			$scope.resolveModal(vm.dataToSubmit);
		}

		function cancelModal() {
			if (vm.creatingNewChild) {
				// cancel the generated account number for re-use
				dataSrvc
					.api({
						type: 'cancelNewAccountNumber',
						urlObj: { accountNo: vm.dataToSubmit.accountNo },
						args: { accountNo: vm.dataToSubmit.accountNo }
					})
					.then(function (res) { console.log(res, 'res'); });
			}
			
			// cancel the modal
			$scope.dismissModal();
		}

		function deleteChild() {
			// this function will only be available if updating an existing child
			// the child data will have been injected in the overlay scope
			dataSrvc
				.api({
					type: 'deleteChild',
					urlObj: { childId: $scope.child.userId }
				})
				.then(function (res) {
					console.log(res, 'deleteChild-res');
					
					// cancel the modal and go to state 'home'
					$scope.dismissModal('home');
				});
		}
	}
})(angular);