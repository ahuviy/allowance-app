(function (angular) {
	angular
		.module('app')
		.controller('ParentCtrl', ParentCtrl);
	
	ParentCtrl.$inject = ['children', '$state'];

	function ParentCtrl(children, $state) {
		var vm = this;

		vm.children = children.getChildren();
	}
}(angular));