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

        
        function go(state, disableBackBtn) {
            disableBackBtn = disableBackBtn || false;
            if (disableBackBtn) {
                $ionicHistory.nextViewOptions({ disableBackBtn: true });
            }
            $state.go(state);
        }

        function reload() {
            $state.go($state.current, {}, { reload: true });
        }
    }
})(angular);