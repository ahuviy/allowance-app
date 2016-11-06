(function (angular) {
	angular
		.module('allowance')
		.controller('ParentCtrl', ParentCtrl);
	
	ParentCtrl.$inject = ['children', '$state'];

	function ParentCtrl(children, $state) {
		var vm = this;

		vm.children = children.getChildren();
	}
}(angular));