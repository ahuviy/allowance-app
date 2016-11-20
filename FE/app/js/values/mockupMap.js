(function (angular) {
	/**
	 * The structure of each attribute is -
	 * url - contain all the queries if it is 'GET' method 
	 * method - 'GET'/'POST'
	 * args - just in a case of 'POST'
	 * mockup - same data as the returned in the real $get/$post request
	 */
	/**
	    'url' : {
	        method: 'POST',
	        args: {
	            a: 1,
	            b: 2
	        },
	        mockup: {
	            // mockup obj
	        }
	    }
	*/
	var value = {};
		

	angular
		.module('app')
		.value('mockupMap', value);
}(angular));