(function (angular) {
    angular
        .module('app')
        .directive('busyIndicator', busyIndicator);

    function busyIndicator() {
        return {
            restrict: 'E',
            templateUrl: 'views/busyIndicatorDrtv.html',
            replace: true,
            scope: {},
            controller: controller,
            controllerAs: 'vm',
            bindToController: true
        };
    }

    controller.$inject = ['$scope', '$rootScope', '$timeout'];

    function controller($scope, $rootScope, $timeout) {
        var ACTIVATION_DEBOUNCE_TIME_IN_MILLISECONDS = 500;
        var vm = this;
        vm.counter = 0;
        vm.show = false;

        $rootScope.$on('startBI', function () {
            vm.counter++;
        });

        $rootScope.$on('stopBI', function (event, forced) {
            if (forced) {
                vm.counter = 0;
            } else if (vm.counter > 0) {
                vm.counter--;
            }
        });

        $scope.$watch('vm.counter', function (newVal, oldVal) {
            if (angular.equals(oldVal, newVal)) {
                return;
            }
            setSpinnerVisibilityDebounceForActivation();

            function setSpinnerVisibilityDebounceForActivation() {
                if (vm.counter === 0) {
                    vm.show = false;
                }
                $timeout(function () {
                    if (vm.counter > 0) {
                        vm.show = true;
                    }
                }, ACTIVATION_DEBOUNCE_TIME_IN_MILLISECONDS);
            }
        });
    }
} (angular));