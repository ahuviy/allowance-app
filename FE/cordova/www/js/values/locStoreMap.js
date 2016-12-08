(function (angular) {
	angular
		.module('app')
		.value('locStoreMap', locStoreMap());

	/**
       * {Object} locStoreMap contains all local-storage keys.
       */
	function locStoreMap() {
		return {
			credentials: 'credentials',
			parentName: 'parentName'
		};
	}
})(angular);