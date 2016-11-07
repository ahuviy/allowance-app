(function (angular) {
	angular
		.module('app')
		.factory('children', children);
	
	children.$inject = ['_'];

	function children(_) {
		var children = [
			{
				_id: 0,
				name: 'Moshe',
				balance: 200,
				allowance: true,
				allowanceAmount: 20
			},
			{
				_id: 1,
				name: 'Yamit',
				balance: -10,
				allowance: true,
				allowanceAmount: 30
			},
			{
				_id: 2,
				name: 'Hezi',
				balance: 0,
				allowance: false,
				allowanceAmount: null
			}
		];
		var service = {
			getChildren: getChildren,
			getChildById: getChildById
		};
		return service;

		//////////////////////

		function getChildren() {
			return children;
		}

		function getChildById(childId) {
			return _.find(children, {'_id': parseInt(childId)});
		}
	}
}(angular));