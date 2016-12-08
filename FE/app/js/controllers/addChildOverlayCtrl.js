(function(angular) {
    angular
        .module('app')
        .controller('addChildOverlayCtrl', addChildOverlayCtrl);

    addChildOverlayCtrl.$inject = ['$scope', 'dataSrvc', 'authSrvc', 'ionErrorHandlerSrvc'];

    function addChildOverlayCtrl(addChildOverlayCtrl, dataSrvc, authSrvc, ionErrorHandlerSrvc) {

        var $scope = this;

        init();

        function init() {
            // skip to login if parent is not authenticated
            authSrvc.redirectToLoginIfNotAuth();

            // title could have been injected in the modal
            $scope.title = (typeof addChildOverlayCtrl.title === 'undefined') ?
                'Add Child' :
                addChildOverlayCtrl.title;

            if (typeof addChildOverlayCtrl.child === 'undefined') {
                // CREATE A NEW CHILD (if child was not injected in the modal)
                $scope.creatingNewChild = true;
                $scope.dataToSubmit = {
                    interestRate: 0,
                    rebateRate: 0
                };

                // BE: get a new account no.
                dataSrvc.api({ type: 'generateNewAccountNumber' }).then(function(res) {
                    console.log(res, 'res');
                    $scope.dataToSubmit.accountNo = res.data;
                });
            } else {
                // UPDATE AN EXISTING CHILD
                $scope.creatingNewChild = false;
                $scope.dataToSubmit = addChildOverlayCtrl.child;
                $scope.dataToSubmit.password = addChildOverlayCtrl.childPassword;
                $scope.dataToSubmit.accountNo = addChildOverlayCtrl.childAccountNo;
            }
        }

        $scope.submitChild = function() {
            // resolve the modal with the submit data
            addChildOverlayCtrl.resolveModal($scope.dataToSubmit);
        };

        $scope.cancelModal = function() {
            if ($scope.creatingNewChild) {
                // BE: recycle the generated account number
                var apiCfg = {
                    type: 'cancelNewAccountNumber',
                    urlParams: { accountNo: $scope.dataToSubmit.accountNo },
                    data: { accountNo: $scope.dataToSubmit.accountNo }
                };
                dataSrvc.api(apiCfg).then(function(res) { console.log(res, 'res'); });
            }

            // cancel the modal
            addChildOverlayCtrl.dismissModal();
        };

        $scope.deleteChild = function() {
			/**
			 * This function will only be available if updating an existing
			 * child. The child data will have been injected in the overlay scope
			 */
			var msg = 'Do you want to delete ' + $scope.dataToSubmit.name + '?';
			ionErrorHandlerSrvc.confirmPopup('Are you sure?', msg, sendDeleteReq);
		};

        function sendDeleteReq() {
            var apiCfg = {
                type: 'deleteChild',
                urlParams: { childId: addChildOverlayCtrl.child.userId }
            };
            dataSrvc.api(apiCfg).then(function(res) {
                console.log(res, 'deleteChild-res');

                // cancel the modal and go to state 'home'
                addChildOverlayCtrl.dismissModal('home');
            });
        }
    }
})(angular);