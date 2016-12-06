(function (angular) {
    angular
        .module('app')
        .service('routeSrvc', routeSrvc);

    routeSrvc.$inject = ['$ionicHistory', '$state'];
    function routeSrvc($ionicHistory, $state) {
        /**
         * Go to home view, disabling the back-button
         */
        this.gotoHome = function () {
            $ionicHistory.nextViewOptions({ disableBack: true });
            $state.go('home');
        };

        /**
         * Go to login view, disabling the back-button
         */
        this.gotoLogin = function () {
            $ionicHistory.nextViewOptions({ disableBack: true });
            $state.go('login');
        };

    }
})(angular);