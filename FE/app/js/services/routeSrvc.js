(function (angular) {
    angular
        .module('app')
        .service('routeSrvc', routeSrvc);

    routeSrvc.$inject = ['$ionicHistory', '$state'];
    
    function routeSrvc($ionicHistory, $state) {
        
        var FUNCTIONS_TO_EXPORT = {
            go: go,
            reload: reload
        };
        Object.assign(this, FUNCTIONS_TO_EXPORT);

        
        function go(state, disableBackBtn, stateParams) {
            disableBackBtn = disableBackBtn || false;
            stateParams = stateParams || {};
            if (disableBackBtn) {
                $ionicHistory.nextViewOptions({ disableBack: true });
            }
            $state.go(state, stateParams);
        }

        function reload(newParams) {
            newParams = newParams || {};
            $state.go($state.current, newParams, { reload: true });
        }
    }
})(angular);