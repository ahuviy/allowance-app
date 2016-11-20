(function (angular) {
	angular
		.module('app')
		.controller('ChildCtrl', ChildCtrl);

	ChildCtrl.$inject = ['$stateParams', 'dataSrvc', 'ionOverlaySrvc', '$state', 'authSrvc'];

	function ChildCtrl($stateParams, dataSrvc, ionOverlaySrvc, $state, authSrvc) {
		var childPassword;
		var childAccountNo;
		var $scope = this;
		
		init();

		function init() {
			// skip to login if parent is not authenticated
			authSrvc.redirectToLoginIfNotAuth();
			
			// get child data (account, user, transactions)
			var apiCfg = {
				type: 'getChildById',
				urlObj: { childId: $stateParams.childId }
			};
			dataSrvc.api(apiCfg).then(function (res) {
				console.log(res.data, 'res');
				$scope.child = res.data.account || {};
				$scope.transactions = res.data.transactions || [];

				// add password and accountNo (child-username)
				childPassword = res.data.user.password;
				childAccountNo = parseInt(res.data.user.username);
			});
		}

		$scope.openDepositModal = function () {
			var overlayCfg = {
				type: 'deposit',
				inject: { childId: $stateParams.childId }
			};
			ionOverlaySrvc.setOverlay(overlayCfg).then(apiDeposit);
		};

		$scope.openWithdrawModal = function () {
			var overlayCfg = {
					type: 'withdraw',
					inject: { childId: $stateParams.childId }
				};
			ionOverlaySrvc.setOverlay(overlayCfg).then(apiWithdraw);
		};

		$scope.openAddChildModal = function () {
			var overlayCfg = {
				type: 'addChild',
				inject: {
					child: $scope.child,
					childPassword: childPassword,
					childAccountNo: childAccountNo,
					title: 'Update ' + $scope.child.name
				}
			};
			ionOverlaySrvc.setOverlay(overlayCfg).then(
				apiUpdateChild,
				// optional redirect if canceling the modal
				function (redirect) {
					if (redirect) { $state.go(redirect); }
				});
		};

		function apiUpdateChild(child) {
			// BE: to update the child
			console.log(child, "updateChild-req");
			var apiCfg = {
				type: 'updateChild',
				args: child,
				urlObj: { childId: $stateParams.childId }
			};
			dataSrvc.api(apiCfg).then(function (res) {
				// response should contain a success message
				console.log(res, "updateChild-res");
				$scope.child = child;
				childPassword = child.password; // in case the password was updated
			});
		}

		function apiDeposit(depositObj) {
			// BE: deposit to the child account
			var apiCfg = {
				type: 'deposit',
				args: depositObj,
				urlObj: { accountId: $stateParams.childId }
			};
			dataSrvc.api(apiCfg).then(function (res) {
				console.log(res, "deposit-res");

				// response data should be:
				// {account: modifiedChildAccountObj, transaction: lastTransactionData}
				$scope.child = res.data.account;
				if (res.data.transaction) { $scope.transactions.push(res.data.transaction); }
			});
		}
		
		function apiWithdraw(withdrawObj) {
			// BE: withdraw from the child account
			var apiCfg = {
				type: 'withdraw',
				args: withdrawObj,
				urlObj: { accountId: $stateParams.childId }
			};
			dataSrvc.api(apiCfg).then(function (res) {
				console.log(res, "withdraw-res");

				// response data should be:
				// {account: modifiedChildAccountObj, transaction: lastTransactionData}
				$scope.child = res.data.account;
				if (res.data.transaction) { $scope.transactions.push(res.data.transaction); }
			});
		}
	}
}(angular));