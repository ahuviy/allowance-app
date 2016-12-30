(function (angular) {
	angular
		.module('app')
		.value('locStoreMap', locStoreMap());

	/**
     * {Object} locStoreMap contains all local-storage keys.
     */
	function locStoreMap() {
		return {
			CREDENTIALS: 'CREDENTIALS',
			PARENT_NAME: 'PARENT_NAME'
		};
	}
})(angular);