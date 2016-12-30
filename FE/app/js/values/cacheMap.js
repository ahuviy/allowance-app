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
            LOGIN: {
                id: 'LOGIN',
                keys: {
                    LOGGED_IN: 'LOGGED_IN' // {Boolean}
                }
            },
            API_GET: {
                id: 'API_GET',
                keys: {}
            },
            API_DELETE: {
                id: 'API_DELETE',
                keys: {}
            },
            API_POST: {
                id: 'API_POST',
                keys: {}
            },
            API_PUT: {
                id: 'API_PUT',
                keys: {}
            }
		};
	}
}(angular));