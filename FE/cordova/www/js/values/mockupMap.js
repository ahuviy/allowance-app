(function (angular) {
	angular
		.module('app')
		.value('mockupMap', mockupMap);
		
	/**
	 * The structure of each attribute is -
	 * url - contain all the queries if it is 'GET' method 
	 * method - 'GET'/'POST'
	 * args - just in a case of 'POST'
	 * mockup - same data as the returned in the real $get/$post request
	 */
	/*
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
	function mockupMap() {
		return {

		};
	}
}(angular));