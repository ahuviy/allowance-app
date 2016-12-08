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
            dataSrvc.api({
                type: 'loginWithUsername',
                data: loginData,
                disableAutoErrorHandler: true
            }).then(
                function successCb(res) {
                    console.log(res.data, 'login-res');

                    // save the user-state as logged-in
                    authSrvc.setLoggedInState({
                        username: loginData.username,
                        token: res.data.token
                    });

                    // skip to home and disable back-button
                    routeSrvc.go('home', true);

                },
                function failureCb(err) {
                    console.log(err, 'login-res');
                    $scope.error = true;
                });
        }

        function submitRegister(registerData) {
            console.log(registerData, 'register-req');
            dataSrvc.api({
                type: 'addParent',
                data: registerData,
                disableAutoErrorHandler: true
            }).then(function (res) {
                console.log(res.data, 'register-res');

                // Popup an alert dialog
                var msg = 'Thanks for registering, ' + registerData.name +
                    '! You can now log in using your username and password.';
                ionErrorHandlerSrvc.alertPopup('Registration Successful!', msg);
            });
        }
    }
})(angular);