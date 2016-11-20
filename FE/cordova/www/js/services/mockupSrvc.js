/*
 * The mockup-service has one function- mockup().
 * This function takes a url, a method ('GET'/'POST'), and optional args.
 * It checks the 'mockupMap' (in values) for reference to see what the
 * appropriate (mocked) response should be.
 * If no such HTTP call is found in mockupMap, the function returns null.
 */
(function (angular) {
	angular
		.module('app')
		.service('mockupSrvc', mockupSrvc);

	mockupSrvc.$inject = ['mockupMap', '$q'];

	function mockupSrvc(mockupMap, $q) {
		this.mockup = mockup;

		/*
		 * This function checks that:
		 * 1) this url exists
		 * 2) the specified method exists for that url
		 * 3) the args of the url+method are the same as the supplied args
		 *
		 * If so,return the relevant mockup object. If not,
		 * return 'null'.
		 */
		function mockup(url, method, args) {
			var defer = $q.defer();
			
			if (mockupMap[url] &&
				mockupMap[url].method === method &&
				angular.equals(mockupMap[url].args, args)
			   ) {

				defer.resolve(mockupMap[url].mockup);

			} else {
				return null;
			}
			return defer.promise;
		}
	}
})(angular);