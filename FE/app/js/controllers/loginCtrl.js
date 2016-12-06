(function (angular) {
    angular
        .module('app')
        .controller('LoginCtrl', LoginCtrl);

    LoginCtrl.$inject = ['dataSrvc', 'authSrvc', 'ionErrorHandlerSrvc', 'routeSrvc'];

    function LoginCtrl(dataSrvc, authSrvc, ionErrorHandlerSrvc, routeSrvc) {
        var $scope = this;

        init();

        function init() {
            $scope.error = false;
            $scope.createNewAccount = false;
            $scope.dataToSubmit = { username: '', password: '' };

            // skip to home if parent is already authenticated
            authSrvc.redirectToHomeIfAuth();
        }

        $scope.toggleSubmit = function () {
            $scope.createNewAccount = !$scope.createNewAccount;
        };

        $scope.submit = function (data) {
            $scope.createNewAccount ? submitRegister(data) : submitLogin(data);
        };

        function submitLogin(loginData) {
            // BE: submit the login data to server
            // server expects json: {username: string, password: string} 
            console.log(loginData, 'login-req');
            var apiCfg = {
                type: 'loginWithUsername',
                args: loginData,
                disableAutoErrorHandler: true
            };
            dataSrvc.api(apiCfg).then(
                function successCb(res) {
                    console.log(res.data, 'login-res');

                    // save the user-state as logged-in
                    authSrvc.setLoggedInState({
                        username: loginData.username,
                        token: res.data.token
                    });

                    // skip to home
                    routeSrvc.gotoHome();

                },
                function failureCb(err) {
                    console.log(err, 'login-res');
                    $scope.error = true;
                });
        }

        function submitRegister(registerData) {
            console.log(registerData, 'register-req');
            var apiCfg = {
                type: 'addParent',
                args: registerData,
                disableAutoErrorHandler: true
            };
            dataSrvc.api(apiCfg).then(function (res) {
                console.log(res.data, 'register-res');

                // Popup an alert dialog
                var msg = 'Thanks for registering, ' + registerData.name +
                    '! You can now log in using your username and password.';
                ionErrorHandlerSrvc.alertPopup('Registration Successful!', msg);
            });
        }
    }
})(angular);