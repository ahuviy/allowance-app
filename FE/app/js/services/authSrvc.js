(function (angular) {
    angular
        .module('app')
        .service('authSrvc', authSrvc);

    authSrvc.$inject = ['locStoreSrvc', 'locStoreMap', '$http', 'cacheSrvc', 'cacheMap', 'routeSrvc'];

    function authSrvc(locStoreSrvc, locStoreMap, $http, cacheSrvc, cacheMap, routeSrvc) {

        // FUNCTIONS TO EXPORT
        this.isAuthenticated = isAuthenticated;
        this.setLoggedInState = setLoggedInState;
        this.setLoggedOutState = setLoggedOutState;
        this.redirectToHomeIfAuth = redirectToHomeIfAuth;
        this.redirectToLoginIfNotAuth = redirectToLoginIfNotAuth;

        
        function Authenticator(credentials) {
            this.credentials = credentials;
        }
        Authenticator.prototype.validateInputArgs = function () {
            if (!this.credentials ||
                this.credentials.username === undefined ||
                this.credentials.token === undefined) {
                throw new Error('Bad args were received in setLoggedInState.');
            }
        };
        Authenticator.prototype.saveCredentialsInLocalStorage = function () {
            locStoreSrvc.store(locStoreMap.credentials, {
                username: this.credentials.username,
                token: this.credentials.token
            });
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
            locStoreSrvc.remove(locStoreMap.credentials);
            locStoreSrvc.remove(locStoreMap.parentName);
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
            return cacheSrvc.get(cacheMap.login.id, cacheMap.login.keys.loggedIn);
        }

        // newState = true|false
        function setCachedLoggedInStateAs(newState) {
            cacheSrvc.store(cacheMap.login.id, cacheMap.login.keys.loggedIn, newState);
        }
    }
})(angular);