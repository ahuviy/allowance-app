(function (angular) {
	angular
		.module('app', ['ionic'])
		.config(wireTheStates)
		.run(ionicStartup)
		.run(reEnterLoginSession)
		.value('_', window._); // to introduce lodash to DI in controllers/services

	
	wireTheStates.$inject = ['$stateProvider', '$urlRouterProvider'];
	
	function wireTheStates($stateProvider, $urlRouterProvider) {
		$urlRouterProvider.otherwise('/');
		$stateProvider
			.state('login', {
				url: '/',
				templateUrl: 'views/login.html',
				controller: 'LoginCtrl',
				controllerAs: 'vm',
				cache: false
			})
			.state('home', {
				url: '/home',
				templateUrl: 'views/home.html',
				controller: 'HomeCtrl',
				controllerAs: 'vm',
				cache: false
			})
			.state('child', {
				url: 'child/:childId',
				templateUrl: 'views/child.html',
				controller: 'ChildCtrl',
				controllerAs: 'vm'
			});
	}

	
	reEnterLoginSession.$inject = ['locStoreSrvc', 'locStoreMap', 'authSrvc'];
	
	function reEnterLoginSession(locStoreSrvc, locStoreMap, authSrvc) {
		var credentials = locStoreSrvc.getObject(locStoreMap.credentials);
		if (credentials && credentials.username && credentials.token) {
			authSrvc.setLoggedInState(credentials);
		} else {
			authSrvc.setLoggedOutState();
		}
	}

	
	ionicStartup.$inject = ['$ionicPlatform'];
	
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
				StatusBar.styleDefault();
			}
		});
	}
} (angular));