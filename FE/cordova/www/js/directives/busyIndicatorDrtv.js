(function (angular) {
	var drtv = ['$rootScope',
        function($rootScope){
            return {
            	restrict: 'E',
                templateUrl: 'views/busyIndicatorDrtv.html',
            	replace: true,
                scope: true,
                controller: function($scope, $rootScope){
                    $scope.show = 0;

                    $rootScope.$on('startBI', function(){
                        $scope.show++;
                    });

                    $rootScope.$on('progressBI', function(event, progress){
                        $scope.progress = progress;
                    });

                    $rootScope.$on('stopBI', function(event, forced){
                        if (forced){
                            $scope.show = 0;
                        } else if ($scope.show !== 0){
                            $scope.show--; 
                        }
                        $scope.progress = null;
                    });
                }
            };
        }
    ];

    angular.module('app').directive('busyIndicator' ,drtv);
}(angular));