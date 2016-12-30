(function(angular) {
    angular
        .module('app')
        .controller('HomeCtrl', HomeCtrl);

    HomeCtrl.$inject = ['dataSrvc', 'overlaySrvc', 'locStoreSrvc', 'locStoreMap', '$scope', 'authSrvc', 'ionErrorHandlerSrvc', 'routeSrvc'];
    function HomeCtrl(dataSrvc, overlaySrvc, locStoreSrvc, locStoreMap, HomeCtrl, authSrvc, ionErrorHandlerSrvc, routeSrvc) {
        var credentials;
		var $scope = this;

        init();

        function init() {
            // skip to login-view if parent is not authenticated
            authSrvc.redirectToLoginIfNotAuth();

            // retrieve the parent-credentials and parentName from local-storage
            credentials = locStoreSrvc.get(locStoreMap.CREDENTIALS);
            $scope.parentName = locStoreSrvc.get(locStoreMap.PARENT_NAME);

            // BE: get all the children of this parent
			var apiCfg = {
                type: 'getChildren',
                urlParams: { parentUsername: credentials.username }
            };
            dataSrvc.api(apiCfg).then(function(res) {
				console.log(res.data, 'getChildren-res');
				$scope.children = res.data.children || [];
				$scope.parentName = res.data.parentName;
				
				// store parent-name in local-storage
				locStoreSrvc.store(locStoreMap.PARENT_NAME, res.data.parentName);
			});
        }

        $scope.logout = function() {
            overlaySrvc.confirmPopup('Are you sure?', null, function() {
                authSrvc.setLoggedOutState();
                routeSrvc.go('login', true);
            });
        };

        $scope.openAddChildModal = function() {
            overlaySrvc.setOverlay({ type: 'addChild' }).then(apiAddChild);
        };

        function apiAddChild(child) {
            // BE: add child
            var apiCfg = {
                type: 'addChild',
                data: child,
                urlParams: { parentUsername: credentials.username }
            };
            dataSrvc.api(apiCfg).then(function(res) {
                console.log(res, "res");
                $scope.children.push(res.data);
            });
        }
    }
})(angular);