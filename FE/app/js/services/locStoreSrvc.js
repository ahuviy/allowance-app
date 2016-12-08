(function (angular) {
    angular
        .module('app')
        .service('locStoreSrvc', locStoreSrvc);

    locStoreSrvc.$inject = ['$window'];
    
    function locStoreSrvc($window) {
        // functions to export
        this.store = store;
        this.get = get;
        this.remove = remove;
        this.clearAll = clearAll;

        ////////////////////

        /**
         * Stores {Any} (any value) to local-storage.
         * @param {String} key Name of the key in local-storage.
         * @param {Any} value The value to be stored.
         * @returns {undefined}
         */
        function store(key, value) {
            $window.localStorage[key] = JSON.stringify(value);
        }

        /**
         * Retrieves {Any} (any value) from local-storage.
         * @param {String} key Name of the key in local-storage.
         * @param {Any} defaultValue (optional) Value to return if no such key was found.
         * @returns {Any} [The value to be retrieved | defaultValue | undefined]
         */
        function get(key, defaultValue) {
            if ($window.localStorage[key]) {
                return JSON.parse($window.localStorage[key]);
            } else {
                return defaultValue ? JSON.parse(defaultValue) : undefined;
            }
        }

        /**
         * Removes an entry from local-storage.
         * @param {String} key Name of the key in local-storage.
         * @returns {Boolean} An indication whether there was a key to remove.
         */
        function remove(key) {
            if ($window.localStorage[key]) {
                $window.localStorage.removeItem(key);
                return true;
            } else {
                return false;
            }
        }

        /**
         * Clears all entries in local-storage.
         * @returns {undefined}
         */
        function clearAll() {
            $window.localStorage.clear();
        }
    }
} (angular));