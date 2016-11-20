(function (angular) {
    angular
        .module('app')
        .service('authSrvc', authSrvc);

    authSrvc.$inject = ['$cacheFactory', '$ionicHistory', '$state', 'locStoreSrvc', '$http'];

    function authSrvc($cacheFactory, $ionicHistory, $state, locStoreSrvc, $http) {
        /**
         * Check the login-cache if the user is already logged-in.
         * See app.js: 'reEnterLoginSession' for details
         */
        this.isAuthenticated = function () {
            var loginCache = $cacheFactory.get('login');
            if (loginCache && loginCache.get('loggedIn') === true) {
                return true;
            } else {
                return false;
            }
        };

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

        /**
         * Go to login view if parent is not logged in
         */
        this.redirectToLoginIfNotAuth = function () {
            if (!this.isAuthenticated()) { this.gotoLogin(); }
        };

        /**
         * Go to home view if parent is already logged in
         */
        this.redirectToHomeIfAuth = function () {
            if (this.isAuthenticated()) { this.gotoHome(); }
        };

        /**
         * Set the user-state as logged-in:
         * 1) save the user credentials {username, token} in local-storage
         * 2) set the loggedIn state as 'true' in the cache
         * 3) set the user token as a header for all future HTTP requests
         */
        this.setLoggedInState = function (credentials) {

            // 1)
            locStoreSrvc.storeObject('credentials', {
                username: credentials.username,
                token: credentials.token
            });

            // 2)
            var loginCache = $cacheFactory.get('login') || $cacheFactory('login');
            loginCache.put('loggedIn', true);

            // 3)
            $http.defaults.headers.common['x-access-token'] = credentials.token;
        };

        /**
         * Set the user-state as logged-out:
         * 1) delete the user credentials {username, token} from local-storage
         * 1.1) delete the user parentName from local-storage
         * 2) set the loggedIn state as 'false' in the cache
         * 3) remove the user-token-header for all future HTTP requests
         */
        this.setLoggedOutState = function () {

            // 1); 1.1)
            locStoreSrvc.remove('credentials');
            locStoreSrvc.remove('parentName');

            // 2)
            var loginCache = $cacheFactory.get('login') || $cacheFactory('login');
            loginCache.put('loggedIn', false);

            // 3)
            $http.defaults.headers.common['x-access-token'] = undefined;
        };
    }
})(angular);