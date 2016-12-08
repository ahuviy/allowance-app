(function (angular) {
    angular
        .module('app')
        .service('authSrvc', authSrvc);

    authSrvc.$inject = ['$cacheFactory', '$ionicHistory', '$state', 'locStoreSrvc', 'locStoreMap', '$http', 'cacheMap', 'routeSrvc'];
    function authSrvc($cacheFactory, $ionicHistory, $state, locStoreSrvc, locStoreMap, $http, cacheMap, routeSrvc) {
        
        this.setLoggedInState = setLoggedInState;
        this.isAuthenticated = isAuthenticated;
        this.redirectToLoginIfNotAuth = redirectToLoginIfNotAuth;
        this.redirectToHomeIfAuth = redirectToHomeIfAuth;
        this.setLoggedOutState = setLoggedOutState;

        var that = this;
        ///////////////////////

        /**
         * Check the login-cache if the user is already logged-in.
         * See app.js: 'reEnterLoginSession' for details
         */
        function isAuthenticated() {
            var loginCache = $cacheFactory.get(cacheMap.login.id);
            if (loginCache && loginCache.get(cacheMap.login.keys.loggedIn) === true) {
                return true;
            } else {
                return false;
            }
        }

        /**
         * Go to login view if parent is not logged in
         */
        function redirectToLoginIfNotAuth() {
            if (!that.isAuthenticated()) { routeSrvc.gotoLogin(); }
        }

        /**
         * Go to home view if parent is already logged in
         */
        function redirectToHomeIfAuth() {
            if (that.isAuthenticated()) { routeSrvc.gotoHome(); }
        }

        /**
         * Set the user-state as logged-in:
         * 1) save the user credentials {username, token} in local-storage
         * 2) set the loggedIn state as 'true' in the cache
         * 3) set the user token as a header for all future HTTP requests
         */
        function setLoggedInState(credentials) {

            // 1)
            locStoreSrvc.storeObject(locStoreMap.credentials, {
                username: credentials.username,
                token: credentials.token
            });

            // 2)
            var loginCache = $cacheFactory.get(cacheMap.login.id) || $cacheFactory(cacheMap.login.id);
            loginCache.put(cacheMap.login.keys.loggedIn, true);

            // 3)
            $http.defaults.headers.common['x-access-token'] = credentials.token;
        }

        /**
         * Set the user-state as logged-out:
         * 1) delete the user credentials {username, token} from local-storage
         * 1.1) delete the user parentName from local-storage
         * 2) set the loggedIn state as 'false' in the cache
         * 3) remove the user-token-header for all future HTTP requests
         */
        function setLoggedOutState() {

            // 1); 1.1)
            locStoreSrvc.remove(locStoreMap.credentials);
            locStoreSrvc.remove(locStoreMap.parentName);

            // 2)
            var loginCache = $cacheFactory.get(cacheMap.login.id) || $cacheFactory(cacheMap.login.id);
            loginCache.put(cacheMap.login.keys.loggedIn, false);

            // 3)
            $http.defaults.headers.common['x-access-token'] = undefined;
        }
    }
})(angular);