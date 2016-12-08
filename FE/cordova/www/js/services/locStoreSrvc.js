(function(angular) {
    angular
        .module('app')
        .service('locStoreSrvc', locStoreSrvc);

    locStoreSrvc.$inject = ['$window'];
    function locStoreSrvc($window) {
        
        this.store = store;
        this.get = get;
        this.storeObject = storeObject;
        this.getObject = getObject;
        this.remove = remove;
        this.clearAll = clearAll;

        ////////////////////

        /**
         * store
         * Stores a {String} value to local-storage. Note: use this function to
         * store strings ONLY. For any other data-type, use the storeObject function.
         * @param {String} key Name of the key in local-storage.
         * @param {String} value The value to be stored.
         * @returns {undefined}
         */
        function store(key, value) {
            $window.localStorage[key] = value;
        }

        /**
         * get
         * Retrieves a {String} value from local-storage. Note: use this function to
         * retrieve strings ONLY. For any other data-type, use the getObject function.
         * @param {String} key Name of the key in local-storage.
         * @param {Any} defaultValue (optional) Value to return if no such key was found.
         * @returns {String} [The value to be retrieved | defaultValue | undefined]
         */
        function get(key, defaultValue) {
            if ($window.localStorage[key]) {
                return $window.localStorage[key];
            } else {
                return defaultValue ? defaultValue : undefined;
            }
        }

        /**
         * remove
         * Removes an entry from local-storage.
         * @param {String} key Name of the key in local-storage.
         * @returns {Boolean} An indication whether there was a key to remove.
         */
        function remove(key) {
            if ($window.localStorage[key]) {
                $window.localStorage.removeItem(key);
                return true;
            }
            return false;
        }

        /**
         * storeObject
         * Stores {Any} (any value) to local-storage. Uses JSON.stringify.
         * @param {String} key Name of the key in local-storage.
         * @param {Any} value The value to be stored.
         * @returns {undefined}
         */
        function storeObject(key, value) {
            $window.localStorage[key] = JSON.stringify(value);
        }

        /**
         * getObject
         * Retrieves {Any} (any value) from local-storage. Uses JSON.parse.
         * @param {String} key Name of the key in local-storage.
         * @param {Any} defaultValue (optional) Value to return if no such key was found.
         * @returns {Any} [The value to be retrieved | defaultValue | undefined]
         */
        function getObject(key, defaultValue) {
            if ($window.localStorage[key]) {
                return JSON.parse($window.localStorage[key]);
            } else {
                return defaultValue ? JSON.parse(defaultValue) : undefined;
            }
        }

        /**
         * clearAll
         * Clears all entries in local-storage.
         * @returns {undefined}
         */
        function clearAll() {
            $window.localStorage.clear();
        }
    }
} (angular));