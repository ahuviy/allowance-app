/**
 * This is a remnant from Nir's youtube application
 */
(function (angular) {
	angular
		.module('app')
		.service('cordovaSrvc', cordovaSrvc);

	/////////////////////////////

	cordovaSrvc.$inject = ['$window', '$q', '$ionicPlatform'];
	
	function cordovaSrvc($window, $q, $ionicPlatform) {
		var that = this;

		// check that cordova is present
		this.is = function () {
			return !!$window.cordova;
		};

		// get the phone sim number
		this.getSerial = function () {
			var defer = $q.defer();

			// if not in cordova set sim as 'dev'
			if (!that.is()) {
				defer.resolve('dev');
			}

			// if in cordova and sim is already known (sim is stored in that._serial)
			else if (that._serial) {
				defer.resolve(that._serial);
			}

			// if in cordova and sim not yet known, fetch sim
			else {
				$ionicPlatform.ready(fetchSim);
			}

			return defer.promise;

			function fetchSim() {
				window.plugins.sim.getSimInfo(simCallbackSuccess, simCallbackError);
			}

			function simCallbackSuccess(simObj) {
				that._serial = simObj.simSerialNumber;
				defer.resolve(that._serial);
			}

			function simCallbackError(err) {
				defer.reject({
					err: err,
					msg: 'cordova sim plugin error'
				});
			}
		};

		// set the base URL for all requests if made from cordova
		this.getPrefix = function () {
			return that.is() ? 'https://nir-youtube.herokuapp.com' : '';
		};
	}
}(angular));