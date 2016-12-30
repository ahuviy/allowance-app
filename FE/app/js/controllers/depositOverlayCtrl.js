(function(angular) {
    angular
        .module('app')
        .controller('depositOverlayCtrl', depositOverlayCtrl);

    depositOverlayCtrl.$inject = ['$scope', 'locStoreSrvc', 'authSrvc', 'locStoreMap', 'overlaySrvc'];

    function depositOverlayCtrl(depositOverlayCtrl, locStoreSrvc, authSrvc, locStoreMap, overlaySrvc) {
        var credentials;
        var $scope = this;

        init();

        function init() {
            // skip to login if parent is not authenticated
            authSrvc.redirectToLoginIfNotAuth();

            credentials = locStoreSrvc.get(locStoreMap.CREDENTIALS);

            // vars for the <select> html element
            $scope.selectDepositType = [
                { label: 'Normal', value: 'single' },
                { label: 'Weekly', value: 'weekly' },
                { label: 'Monthly', value: 'monthly' }
            ];

            // reset the data-to-submit
            $scope.dataToSubmit = {
                userId: depositOverlayCtrl.childId, // was injected to the overlay
                type: 'deposit',
                description: '',
                sum: undefined,
                performedBy: credentials.username,
                timestamp: undefined, // will be set on submission
                depositType: 'single'
            };
        }

        $scope.submitDeposit = function() {
            overlaySrvc.confirmPopup('Are you sure?', null, function() {
                // set timestamp
                $scope.dataToSubmit.timestamp = Date.parse(new Date());

                console.log($scope.dataToSubmit, 'submitting deposit');
                depositOverlayCtrl.resolveModal($scope.dataToSubmit);
            });
        };
    }
})(angular);