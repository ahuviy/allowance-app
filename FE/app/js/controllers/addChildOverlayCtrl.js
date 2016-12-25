(function (angular) {
    angular
        .module('app')
        .controller('addChildOverlayCtrl', addChildOverlayCtrl);

    addChildOverlayCtrl.$inject = ['$scope', 'dataSrvc', 'authSrvc', 'overlaySrvc'];

    function addChildOverlayCtrl(addChildOverlayCtrl, dataSrvc, authSrvc, overlaySrvc) {

        var $scope = this;

        init();
        setupButtonActions();

        function init() {
            authSrvc.redirectToLoginIfNotAuth(); // TODOahuvi: move this logic to route-resolve
            $scope.title = addChildOverlayCtrl.title || 'Add Child'; // could have been injected in the modal
            if (addChildOverlayCtrl.child === undefined) {
                setupControllerForCreatingNewChild();
            } else {
                setupControllerForUpdatingExistingChild();
            }
        }

        function setupButtonActions() {
            $scope.submitChild = function () {
                addChildOverlayCtrl.resolveModal($scope.dataToSubmit);
            };

            $scope.cancelModal = function () {
                if ($scope.creatingNewChild) {
                    cancelNewAccountNumber();
                }
                addChildOverlayCtrl.dismissModal();
            };

            $scope.deleteChild = function () {
                var msg = 'Do you want to delete ' + $scope.dataToSubmit.name + '?';
                overlaySrvc.confirmPopup('Are you sure?', msg, sendDeleteReq);
            };
        }

        function setupControllerForUpdatingExistingChild() {
            $scope.creatingNewChild = false;
            $scope.dataToSubmit = addChildOverlayCtrl.child;
            $scope.dataToSubmit.password = addChildOverlayCtrl.childPassword;
            $scope.dataToSubmit.accountNo = addChildOverlayCtrl.childAccountNo;
        }

        function setupControllerForCreatingNewChild() {
            $scope.creatingNewChild = true;
            $scope.dataToSubmit = {
                interestRate: 0,
                rebateRate: 0
            };
            getNewAccountNo();
        }

        function sendDeleteReq() {
            dataSrvc.api({
                type: 'deleteChild',
                urlParams: { childId: addChildOverlayCtrl.child.userId }
            }).then(function (res) {
                console.log(res, 'deleteChild-res');

                // cancel the modal and go to state 'home'
                addChildOverlayCtrl.dismissModal('home');
            });
        }

        function getNewAccountNo() {
            dataSrvc.api({
                type: 'generateNewAccountNumber'
            }).then(function (res) {
                console.log(res, 'generateNewAccountNumber-res');
                $scope.dataToSubmit.accountNo = res.data;
            });
        }

        function cancelNewAccountNumber() {
            dataSrvc.api({
                type: 'cancelNewAccountNumber',
                urlParams: { accountNo: $scope.dataToSubmit.accountNo },
                data: { accountNo: $scope.dataToSubmit.accountNo }
            }).then(function (res) {
                console.log(res, 'cancelNewAccountNumber-res');
            });
        }
    }
})(angular);