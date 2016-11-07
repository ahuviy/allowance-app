(function (angular) {
	angular
		.module('app')
		.controller('HomeCtrl', HomeCtrl);
	
	HomeCtrl.$inject = ['children', '$state'];

	function HomeCtrl(children, $state) {
		var vm = this;

		vm.children = children.getChildren();
	}
}(angular));