(function (angular) {
	angular
		.module('allowance', ['ionic'])
		.constant('_', window._) // to introduce lodash to DI in controllers/services
		.run(ionicStartup)
		.config(configStates);

	////////////////////////

	function ionicStartup($ionicPlatform) {
		$ionicPlatform.ready(function () {
			// Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
			// for form inputs)
			if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
				cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
				cordova.plugins.Keyboard.disableScroll(true);
			}
			if (window.StatusBar) {
				// org.apache.cordova.statusbar required
				StatusBar.styleDefault(); // jshint ignore:line
			}
		});
	}

	////////////////////////

	function configStates($stateProvider, $urlRouterProvider) {
		$stateProvider

		// setup an abstract state for the tabs directive
			.state('tab', {
			url: '/tab',
			abstract: true,
			templateUrl: 'templates/tabs.html'
		})

		.state('tab.parent', {
			url: '/parent',
			views: {
				'parent-tab': {
					controller: 'ParentCtrl',
					controllerAs: 'vm',
					templateUrl: 'templates/tab-parent.html'
				}
			}
		})

		.state('tab.parentsChild', {
			url: '/parent/:childId',
			views: {
				'parent-tab': {
					templateUrl: 'templates/parentsChild.html',
					controller: 'ParentsChildCtrl',
					controllerAs: 'vm'
				}
			}
		})

		.state('tab.child', {
			url: '/child',
			views: {
				'child-tab': {
					templateUrl: 'templates/tab-child.html',
					controller: 'ParentCtrl'
				}
			}
		});

		// if none of the above states are matched, use this as the fallback
		$urlRouterProvider.otherwise('/tab/parent');
	}
}(angular));