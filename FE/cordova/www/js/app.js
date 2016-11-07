(function (angular) {
	angular
		.module('app', ['ionic'])
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
		$urlRouterProvider.otherwise('/');
		$stateProvider
			.state('home', {
				url: '/',
				templateUrl: 'views/home.html',
				controller: 'HomeCtrl',
				controllerAs: 'vm'
			})

		.state('child', {
			url: 'child/:childId',
			templateUrl: 'views/child.html',
			controller: 'ChildCtrl',
			controllerAs: 'vm'
		})

		/*
		// setup an abstract state for the tabs directive
		.state('tab', {
			url: '/tab',
			abstract: true,
			templateUrl: 'views/tabs.html'
		})

		.state('tab.parent', {
			url: '/parent',
			views: {
				'parent-tab': {
					controller: 'ParentCtrl',
					controllerAs: 'vm',
					templateUrl: 'views/tab-parent.html'
				}
			}
		})

		.state('tab.parentsChild', {
			url: '/parent/:childId',
			views: {
				'parent-tab': {
					templateUrl: 'views/parentsChild.html',
					controller: 'ParentsChildCtrl',
					controllerAs: 'vm'
				}
			}
		})

		.state('tab.child', {
			url: '/child',
			views: {
				'child-tab': {
					templateUrl: 'views/tab-child.html',
					controller: 'ParentCtrl'
				}
			}
		});
		*/
	}
}(angular));