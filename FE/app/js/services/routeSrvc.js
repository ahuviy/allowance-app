(function (angular) {
    angular
        .module('app')
        .service('routeSrvc', routeSrvc);

    routeSrvc.$inject = ['$ionicHistory', '$state'];
    
    function routeSrvc($ionicHistory, $state) {
        
        // FUNCTIONS TO EXPORT
        this.go = go;
        this.reload = reload;

        
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