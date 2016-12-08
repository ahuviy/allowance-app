(function (angular) {
	angular
		.module('app', ['ionic'])
		.run(ionicStartup)
		.run(reEnterLoginSession)
		.config(configStates)
		.value('_', window._); // to introduce lodash to DI in controllers/services

	/**
	 * If user credentials are already saved in local-storage, set the token
	 * as a header for all http requests and cache a global: 'loggedIn' to true
	 * in a 'login' cache.
	 */
	reEnterLoginSession.$inject = ['$http', 'locStoreSrvc', '$cacheFactory', 'cacheMap', 'locStoreMap'];
	function reEnterLoginSession($http, locStoreSrvc, $cacheFactory, cacheMap, locStoreMap) {
		var credentials = locStoreSrvc.getObject(locStoreMap.credentials);
		var loginCache = $cacheFactory(cacheMap.login.id);

		if (credentials && credentials.username && credentials.token) {
			$http.defaults.headers.common['x-access-token'] = credentials.token;
			loginCache.put(cacheMap.login.keys.loggedIn, true);
		} else {
			loginCache.put(cacheMap.login.keys.loggedIn, false);
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
				StatusBar.styleDefault(); // jshint ignore:line
			}
		});
	}

	configStates.$inject = ['$stateProvider', '$urlRouterProvider'];
	function configStates($stateProvider, $urlRouterProvider) {
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
} (angular));