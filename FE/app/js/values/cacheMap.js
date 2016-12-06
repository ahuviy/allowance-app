(function (angular) {
	angular
		.module('app')
		.value('cacheMap', cacheMap());
		
	/**
     * cacheMap is {Object} containing objects:
     * {
     *   cache1Id: {
     *     id: {String} cacheId,
     *     key1: {String} cacheKey1,
     *     ...
     *   },
     *   ...
     * }
     */
    function cacheMap() {
		return {
            login: {
                id: 'login',
                loggedIn: 'loggedIn' // {Boolean}
            }
		};
	}
}(angular));