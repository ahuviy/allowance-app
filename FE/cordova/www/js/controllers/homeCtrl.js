(function (angular) {
	angular
		.module('app')
		.controller('HomeCtrl', HomeCtrl);

	HomeCtrl.$inject = ['dataSrvc', 'ionOverlaySrvc', 'locStoreSrvc', 'noBEmsg', '$scope'];
	
	function HomeCtrl(dataSrvc, ionOverlaySrvc, locStoreSrvc, noBEmsg, $scope) {
		var parentId = '';
		var vm = this;
		vm.children = [];
		vm.openAddChildModal = openAddChildModal;
		
		
		// do this whenever (re)-entering the page 
		$scope.$on('$ionicView.enter', function(e) {
			activate();
		});
		
		
		function activate() {
			parentId = locStoreSrvc.get('parentId', '');
			dataSrvc
				.api({
					type: 'getChildren',
					urlObj: {parentId: parentId}
				})
				.then(function (res) {
					vm.children = res.data;
				});
		}

		function openAddChildModal() {
			ionOverlaySrvc
				.setOverlay({ type: 'addChild' })
				.then(apiAddChild);
		}

		function apiAddChild(child) {
			dataSrvc.api({
				type: 'addChild',
				args: child,
				urlObj: {parentId: parentId},
				specialErrorHandlerData: noBEmsg
			}).then(function (res) {
				console.log(res, "res");
				vm.children.push(res.data);
			});
		}
	}
}(angular));