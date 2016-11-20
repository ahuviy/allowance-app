(function (angular) {
	angular
		.module('app')
		.controller('ChildCtrl', ChildCtrl);

	ChildCtrl.$inject = ['$stateParams', 'dataSrvc', 'ionOverlaySrvc', 'noBEmsg', '$state'];

	function ChildCtrl($stateParams, dataSrvc, ionOverlaySrvc, noBEmsg, $state) {
		var childPassword;
		var childAccountNo;
		var vm = this;
		vm.child = {};
		vm.transactions = [];
		vm.openDepositModal = openDepositModal;
		vm.openWithdrawModal = openWithdrawModal;
		vm.openAddChildModal = openAddChildModal;
		
		activate();

		function activate() {
			// get child data. (account, user, transactions)
			dataSrvc
				.api({
					type: 'getChildById',
					urlObj: { childId: $stateParams.childId }
				})
				.then(function (res) {
					console.log(res, 'res');
					vm.child = res.data.account;
					vm.transactions = res.data.transactions;

					// add password and account no. (child username)
					childPassword = res.data.user.password;
					childAccountNo = parseInt(res.data.user.username);
				});
		}

		function openDepositModal() {
			ionOverlaySrvc
				.setOverlay({
					type: 'deposit',
					inject: {
						childId: $stateParams.childId
					}
				})
				.then(apiDeposit);
		}

		function openWithdrawModal() {
			ionOverlaySrvc
				.setOverlay({
					type: 'withdraw',
					inject: {
						childId: $stateParams.childId
					}
				})
				.then(apiWithdraw);
		}

		function openAddChildModal() {
			ionOverlaySrvc
				.setOverlay({
					type: 'addChild',
					inject: {
						child: vm.child,
						childPassword: childPassword,
						childAccountNo: childAccountNo,
						title: 'Update ' + vm.child.name
					}
				})
				.then(apiUpdateChild, function (redirect) {
					if (redirect) $state.go(redirect);
				});
		}

		function apiUpdateChild(child) {
			console.log(child, "updateChild-req");
			dataSrvc
				.api({
					type: 'updateChild',
					args: child,
					urlObj: { childId: $stateParams.childId },
					specialErrorHandlerData: noBEmsg
				})
				.then(function (res) {
					// response should contain a success message
					console.log(res, "updateChild-res");
					vm.child = child;
					childPassword = child.password; // in case the password was updated
				});
		}

		function apiDeposit(depositObj) {
			dataSrvc.api({
				type: 'deposit',
				args: depositObj,
				urlObj: {
					accountId: $stateParams.childId
				},
				specialErrorHandlerData: noBEmsg
			}).then(function (res) {
				console.log(res, "deposit res");

				// response data should be:
				// {account: modifiedChildAccountObj, transaction: lastTransactionData}
				vm.child = res.data.account;
				if (res.data.transaction) vm.transactions.push(res.data.transaction);
			});
		}
		
		function apiWithdraw(withdrawObj) {
			dataSrvc.api({
				type: 'withdraw',
				args: withdrawObj,
				urlObj: {
					accountId: $stateParams.childId
				},
				specialErrorHandlerData: noBEmsg
			}).then(function (res) {
				console.log(res, "withdraw res");

				// // response should be the new account details
				// vm.child = res.data;

				// response data should be:
				// {account: modifiedChildAccountObj, transaction: lastTransactionData}
				vm.child = res.data.account;
				if (res.data.transaction) vm.transactions.push(res.data.transaction);
			});
		}
	}
}(angular));