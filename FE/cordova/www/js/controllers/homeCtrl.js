(function(angular) {
    angular
        .module('app')
        .controller('HomeCtrl', HomeCtrl);

    HomeCtrl.$inject = ['dataSrvc', 'ionOverlaySrvc', 'locStoreSrvc', 'locStoreMap', '$scope', 'authSrvc', 'ionErrorHandlerSrvc', 'routeSrvc'];
    function HomeCtrl(dataSrvc, ionOverlaySrvc, locStoreSrvc, locStoreMap, HomeCtrl, authSrvc, ionErrorHandlerSrvc, routeSrvc) {
        var credentials;
		var $scope = this;

        init();

        function init() {
            // skip to login-view if parent is not authenticated
            authSrvc.redirectToLoginIfNotAuth();

            // retrieve the parent-credentials and parentName from local-storage
            credentials = locStoreSrvc.getObject(locStoreMap.credentials);
            $scope.parentName = locStoreSrvc.get(locStoreMap.parentName);

            // BE: get all the children of this parent
			var apiCfg = {
                type: 'getChildren',
                urlObj: { parentUsername: credentials.username }
            };
            dataSrvc.api(apiCfg).then(function(res) {
				console.log(res.data, 'getChildren-res');
				$scope.children = res.data.children || [];
				$scope.parentName = res.data.parentName;
				
				// store parent-name in local-storage
				locStoreSrvc.store(locStoreMap.parentName, res.data.parentName);
			});
        }

        $scope.logout = function() {
            ionErrorHandlerSrvc.confirmPopup('Are you sure?', null, function() {
                authSrvc.setLoggedOutState();
                routeSrvc.gotoLogin();
            });
        };

        $scope.openAddChildModal = function() {
            ionOverlaySrvc.setOverlay({ type: 'addChild' }).then(apiAddChild);
        };

        function apiAddChild(child) {
            // BE: add child
            var apiCfg = {
                type: 'addChild',
                args: child,
                urlObj: { parentUsername: credentials.username }
            };
            dataSrvc.api(apiCfg).then(function(res) {
                console.log(res, "res");
                $scope.children.push(res.data);
            });
        }
    }
})(angular);