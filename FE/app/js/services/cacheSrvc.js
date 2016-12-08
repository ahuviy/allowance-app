(function (angular) {
    angular
        .module('app')
        .service('cacheSrvc', cacheSrvc);

    cacheSrvc.$inject = ['$cacheFactory'];
    function cacheSrvc($cacheFactory) {


        ////////////////////


        // var loginCache = $cacheFactory(cacheMap.login.id);
        // loginCache.put(cacheMap.login.keys.loggedIn, true);


        // var loginCache = $cacheFactory.get(cacheMap.login.id);
        //     if (loginCache && loginCache.get(cacheMap.login.keys.loggedIn) === true) {
        //         return true;
        //     } else {
        //         return false;
        //     }


        // var loginCache = $cacheFactory.get(cacheMap.login.id) || $cacheFactory(cacheMap.login.id);
        // loginCache.put(cacheMap.login.keys.loggedIn, true);


        /**
         * Stores a {String} value to local-storage. Note: use this function to
         * store strings ONLY. For any other data-type, use the storeObject function.
         * @param {String} key Name of the key in local-storage.
         * @param {String} value The value to be stored.
         * @returns {undefined}
         */
        function store(key, value) {
            //$window.localStorage[key] = value;
        }
    }
})(angular);