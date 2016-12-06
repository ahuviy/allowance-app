(function (angular) {
	angular
		.module('app')
		.value('ionOverlayMap', ionOverlayMap());

	function ionOverlayMap() {
		return {
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
	}
})(angular);