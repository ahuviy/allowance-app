(function (angular) {
    angular
        .module('app')
        .service('routeSrvc', routeSrvc);

    routeSrvc.$inject = ['$ionicHistory', '$state'];
    
    function routeSrvc($ionicHistory, $state) {
        // functions to export
        this.go = go;
        this.reload = reload;

        ////////////////////
        
        /**
         * Go to new state.
         * @param {String} state new state to go to.
         * @param {Boolean} disableBack disable the back button on next state. Default is false.
         */
        function go(state, disableBack) {
            if (disableBack === undefined) {
                disableBack = false;
            }
            if (disableBack) {
                $ionicHistory.nextViewOptions({ disableBack: true });
            }
            $state.go(state);
        }

        /**
         * Reload current state
         */
        function reload() {
            $state.go($state.current, {}, { reload: true });
        }
    }
})(angular);