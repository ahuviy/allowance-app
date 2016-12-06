(function (angular) {
	angular
		.module('app')
		.value('cacheMap', cacheMap());
		
	/**
     * {Object} cacheMap contains cache objects.
     * Each cache object contains 2 properties:
     *   id: {String} cache-object name
     *   keys: {Object} cache-object keys.
     * Each key in keys is: {String} name of the key.
     */
    function cacheMap() {
		return {
            login: {
                id: 'login',
                keys: {
                    loggedIn: 'loggedIn' // {Boolean}
                }
            }
		};
	}
}(angular));