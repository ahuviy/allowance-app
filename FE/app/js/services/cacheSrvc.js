(function (angular) {
    angular
        .module('app')
        .service('cacheSrvc', cacheSrvc);

    cacheSrvc.$inject = ['$cacheFactory', '$q'];

    function cacheSrvc($cacheFactory, $q) {

        var FUNCTIONS_TO_EXPORT = {
            get: get,
            getAsync: getAsync,
            store: store,
            storeAsync: storeAsync
        };
        Object.assign(this, FUNCTIONS_TO_EXPORT);


        function get(cacheId, key) {
            return $cacheFactory.get(cacheId).get(key);
        }

        function getAsync(cacheId, key) {
            var defer = $q.defer();
            var result = $cacheFactory.get(cacheId).get(key);
            if (result) {
                defer.resolve(result);
            } else {
                defer.reject();
            }
            return defer.promise;
        }

        function store(cacheId, key, value) {
            var cache = $cacheFactory.get(cacheId) || $cacheFactory(cacheId);
            cache.put(key, value);
        }

        function storeAsync(cacheId, key, value) {
            var defer = $q.defer();
            var cache = $cacheFactory.get(cacheId) || $cacheFactory(cacheId);
            cache.put(key, value);
            defer.resolve();
            return defer.promise;
        }
    }
})(angular);