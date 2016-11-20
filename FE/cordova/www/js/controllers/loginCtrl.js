(function (angular) {
	angular
		.module('app')
		.controller('LoginCtrl', LoginCtrl);

	LoginCtrl.$inject = ['$state', '$ionicHistory', 'dataSrvc', 'loggerSrvc', 'locStoreSrvc'];
	
	function LoginCtrl($state, $ionicHistory, dataSrvc, loggerSrvc, locStoreSrvc) {
		var vm = this;
		vm.dataToSubmit = {};
		vm.submitLogin = submitLogin;
		vm.createNewAccount = false;
		vm.error = false;

		activate();

		function activate() {}

		function submitLogin(data) {
			var requestType = vm.createNewAccount ? 'addParent' : 'loginWithUsername';
			
			// disable the back-button for the next view (the home-view)
			$ionicHistory.nextViewOptions({disableBack: true});

			// submit the login data to server
			loggerSrvc.cl('request:', data);
			dataSrvc
				.api({
					type: requestType,
					args: data,
					disableAutoErrorHandler: true
				})
				.then(function (res) {
					loggerSrvc.cl('response:', res.data);
					
					// save parentId in local storage
					locStoreSrvc.store('parentId', res.data._id);
					
					$state.go('home');
				}, function (err) {
					vm.error = true;
					loggerSrvc.cl('response:', err);
				});
		}
	}
})(angular);