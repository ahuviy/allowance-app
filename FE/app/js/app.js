(function (angular) {
	angular
		.module('app', ['ionic'])
		.config(wireUpTheStates)
		.run(ionicStartup)
		.run(reEnterLoginSession)
		.run(setHtmlDirAttr)
		.value('_', window._); // to introduce lodash to DI in controllers/services


	wireUpTheStates.$inject = ['$stateProvider', '$urlRouterProvider', 'DEFAULT_LANGUAGE'];

	function wireUpTheStates($stateProvider, $urlRouterProvider, DEFAULT_LANGUAGE) {
		$urlRouterProvider.otherwise('/:lang');
		$stateProvider
			.state('login', {
				url: '/:lang',
				templateUrl: 'views/login.html',
				controller: 'LoginCtrl',
				controllerAs: 'vm',
				cache: false,
				params: {
					lang: DEFAULT_LANGUAGE
				}
			})
			.state('home', {
				url: '/:lang/home',
				templateUrl: 'views/home.html',
				controller: 'HomeCtrl',
				controllerAs: 'vm',
				cache: false,
				params: {
					lang: DEFAULT_LANGUAGE
				}
			})
			.state('child', {
				url: '/:lang/child/:childId',
				templateUrl: 'views/child.html',
				controller: 'ChildCtrl',
				controllerAs: 'vm',
				params: {
					lang: DEFAULT_LANGUAGE
				}
			});
	}


	reEnterLoginSession.$inject = ['locStoreSrvc', 'locStoreMap', 'authSrvc'];

	function reEnterLoginSession(locStoreSrvc, locStoreMap, authSrvc) {
		var credentials = locStoreSrvc.get(locStoreMap.CREDENTIALS);
		if (credentials && credentials.username && credentials.token) {
			authSrvc.setLoggedInState(credentials);
		} else {
			authSrvc.setLoggedOutState();
		}
	}


	ionicStartup.$inject = ['$ionicPlatform'];

	function ionicStartup($ionicPlatform) {
		$ionicPlatform.ready(function () {
			// Hide the accessory bar by default (remove this to show the
			// accessory bar above the keyboard for form inputs)
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


	setHtmlDirAttr.$inject = ['$rootElement', 'DEFAULT_LANGUAGE', 'i18nChart'];

	function setHtmlDirAttr($rootElement, DEFAULT_LANGUAGE, i18nChart) {
		if (!i18nChart[DEFAULT_LANGUAGE].HTML_DIR_ATTR) {
			console.warn('the default language has no dir attribute specified');
			return;
		}
		$rootElement.attr('dir', i18nChart[DEFAULT_LANGUAGE].HTML_DIR_ATTR);
	}
} (angular));