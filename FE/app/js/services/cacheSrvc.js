(function (angular) {
    angular
        .module('app')
        .service('cacheSrvc', cacheSrvc);

    cacheSrvc.$inject = ['$cacheFactory', '$q'];
    function cacheSrvc($cacheFactory, $q) {
        this.get = get;
        this.getAsync = getAsync;
        this.store = store;
        this.storeAsync = storeAsync;

        ////////////////////

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