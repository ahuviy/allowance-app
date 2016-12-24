(function (angular) {
    angular
        .module('app')
        .service('locStoreSrvc', locStoreSrvc);

    locStoreSrvc.$inject = ['$window'];
    
    function locStoreSrvc($window) {
        
        // FUNCTIONS TO EXPORT
        this.store = store;
        this.get = get;
        this.remove = remove;
        this.removeAll = removeAll;


        function store(key, value) {
            $window.localStorage[key] = JSON.stringify(value);
        }

        function get(key, defaultValue) {
            if ($window.localStorage[key]) {
                return JSON.parse($window.localStorage[key]);
            } else {
                return defaultValue ? JSON.parse(defaultValue) : undefined;
            }
        }

        function remove(key) {
            if ($window.localStorage[key]) {
                $window.localStorage.removeItem(key);
            }
        }

        function removeAll() {
            $window.localStorage.clear();
        }
    }
} (angular));