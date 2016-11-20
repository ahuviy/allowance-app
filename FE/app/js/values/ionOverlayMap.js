(function (angular) {

	var value = {
		error: {
			templateUrl: 'views/errorOverlay.html'
		},
		addChild: {
			templateUrl: 'views/addChildOverlay.html'
		},
		deposit: {
			templateUrl: 'views/depositOverlay.html'
		},
		withdraw: {
			templateUrl: 'views/withdrawOverlay.html'
		}
	};

	angular
		.module('app')
		.value('ionOverlayMap', value);

})(angular);