(function (angular) {
    angular
        .module('app')
        .service('locStoreSrvc', locStoreSrvc);
        
    locStoreSrvc.$inject = ['$window'];
    
    function locStoreSrvc($window) {
        this.store = function (key, value) {
            $window.localStorage[key] = value;
        };
        this.get = function (key, defaultValue) {
            return $window.localStorage[key] || defaultValue;
        };
        this.remove = function (key) {
            $window.localStorage.removeItem(key);
        };
        this.storeObject = function (key, value) {
            $window.localStorage[key] = JSON.stringify(value);
        };
        this.getObject = function (key, defaultValue) {
            return JSON.parse($window.localStorage[key] || defaultValue);
        };
    }
}(angular));