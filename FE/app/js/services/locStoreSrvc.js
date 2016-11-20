/**
 * Local-storage service. Handles all access to the browser local storage
 */
(function(angular) {
    angular
        .module('app')
        .service('locStoreSrvc', locStoreSrvc);

    locStoreSrvc.$inject = ['$window'];

    function locStoreSrvc($window) {
        this.store = function(key, value) {
            $window.localStorage[key] = value;
        };
        this.get = function(key, defaultValue) {
            if ($window.localStorage[key]) {
                return $window.localStorage[key];
            } else {
                return defaultValue || undefined;
            }
        };
        this.remove = function(key) {
            if ($window.localStorage[key]) {
                $window.localStorage.removeItem(key);
            }
        };
        this.storeObject = function(key, value) {
            $window.localStorage[key] = JSON.stringify(value);
        };
        this.getObject = function(key, defaultObj) {
            if ($window.localStorage[key]) {
                return JSON.parse($window.localStorage[key]);
            } else {
                return JSON.parse(defaultObj) || undefined;
            }
        };
    }
} (angular));