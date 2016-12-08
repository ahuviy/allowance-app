(function (angular) {
    angular
        .module('app')
        .service('authSrvc', authSrvc);

    authSrvc.$inject = ['locStoreSrvc', 'locStoreMap', '$http', 'cacheSrvc', 'cacheMap', 'routeSrvc'];

    function authSrvc(locStoreSrvc, locStoreMap, $http, cacheSrvc, cacheMap, routeSrvc) {
        // functions to export
        this.isAuthenticated = isAuthenticated;
        this.setLoggedInState = setLoggedInState;
        this.setLoggedOutState = setLoggedOutState;
        this.redirectToLoginIfNotAuth = redirectToLoginIfNotAuth;
        this.redirectToHomeIfAuth = redirectToHomeIfAuth;

        ///////////////////////

        /**
         * Check the login-cache if the user is already logged-in.
         * See app.js: 'reEnterLoginSession' for details
         */
        function isAuthenticated() {
            var loggedIn = cacheSrvc.get(cacheMap.login.id, cacheMap.login.keys.loggedIn);
            return loggedIn ? true : false;
        }

        /**
         * Go to login view if parent is not logged in
         */
        function redirectToLoginIfNotAuth() {
            if (!isAuthenticated()) { routeSrvc.go('login', true); }
        }

        /**
         * Go to home view if parent is already logged in
         */
        function redirectToHomeIfAuth() {
            if (isAuthenticated()) { routeSrvc.go('home', true); }
        }

        /**
         * Set the user-state as logged-in:
         * 1) save the user credentials {username, token} in local-storage
         * 2) set the loggedIn state as 'true' in the cache
         * 3) set the user token as a header for all future HTTP requests
         * @param {Object} credentials should contain username and token fields.
         */
        function setLoggedInState(credentials) {
            if (!credentials ||
                credentials.username === undefined ||
                credentials.token === undefined) {
                throw new Error('Bad args were received in setLoggedInState.');
            }
            locStoreSrvc.storeObject(locStoreMap.credentials, {
                username: credentials.username,
                token: credentials.token
            });
            cacheSrvc.store(cacheMap.login.id, cacheMap.login.keys.loggedIn, true);
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
            locStoreSrvc.remove(locStoreMap.credentials);
            locStoreSrvc.remove(locStoreMap.parentName);
            cacheSrvc.store(cacheMap.login.id, cacheMap.login.keys.loggedIn, false);
            $http.defaults.headers.common['x-access-token'] = undefined;
        }
    }
})(angular);