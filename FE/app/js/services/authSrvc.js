(function (angular) {
    angular
        .module('app')
        .service('authSrvc', authSrvc);

    authSrvc.$inject = ['locStoreSrvc', 'locStoreMap', '$http', 'cacheSrvc', 'cacheMap', 'routeSrvc'];

    function authSrvc(locStoreSrvc, locStoreMap, $http, cacheSrvc, cacheMap, routeSrvc) {

        var FUNCTIONS_TO_EXPORT = {
            isAuthenticated: isAuthenticated,
            setLoggedInState: setLoggedInState,
            setLoggedOutState: setLoggedOutState,
            redirectToHomeIfAuth: redirectToHomeIfAuth,
            redirectToLoginIfNotAuth: redirectToLoginIfNotAuth
        };
        Object.assign(this, FUNCTIONS_TO_EXPORT);


        function Authenticator(credentials) {
            this.credentials = credentials;
        }
        Authenticator.prototype.validateInputArgs = function () {
            if (!this.credentials ||
                this.credentials.username === undefined ||
                this.credentials.token === undefined) {
                throw new Error('Bad input args.');
            }
        };
        Authenticator.prototype.saveCredentialsInLocalStorage = function () {
            locStoreSrvc.store(locStoreMap.CREDENTIALS, this.credentials);
        };
        Authenticator.prototype.addUserTokenToHeaders = function () {
            $http.defaults.headers.common['x-access-token'] = this.credentials.token;
        };

        function isAuthenticated() {
            return getCachedLoggedInState() ? true : false;
        }

        // credentials = { username: username, token: token }
        function setLoggedInState(credentials) {
            var auth = new Authenticator(credentials);
            auth.validateInputArgs();
            auth.saveCredentialsInLocalStorage();
            setCachedLoggedInStateAs(true);
            auth.addUserTokenToHeaders();
        }

        function setLoggedOutState() {
            removeCredentialsFromLocalStorage();
            setCachedLoggedInStateAs(false);
            removeUserTokenFromHeaders();
        }

        function removeCredentialsFromLocalStorage() {
            locStoreSrvc.remove(locStoreMap.CREDENTIALS);
            locStoreSrvc.remove(locStoreMap.PARENT_NAME);
        }

        function removeUserTokenFromHeaders() {
            $http.defaults.headers.common['x-access-token'] = undefined;
        }

        function redirectToHomeIfAuth() {
            if (isAuthenticated()) { routeSrvc.go('home', true); }
        }

        function redirectToLoginIfNotAuth() {
            if (!isAuthenticated()) { routeSrvc.go('login', true); }
        }

        function getCachedLoggedInState() {
            return cacheSrvc.get(cacheMap.LOGIN.id, cacheMap.LOGIN.keys.LOGGED_IN);
        }

        function setCachedLoggedInStateAs(newState) {
            if (typeof newState !== 'boolean') {
                throw new TypeError ('arg must be a boolean');
            }
            cacheSrvc.store(cacheMap.LOGIN.id, cacheMap.LOGIN.keys.LOGGED_IN, newState);
        }
    }
})(angular);