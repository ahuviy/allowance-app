(function (angular) {
	angular
		.module('app')
		.service('loggerSrvc', loggerSrvc);

	loggerSrvc.$inject = [];

	function loggerSrvc() {
		this.cl = cl;

		function cl(title, data, collapse) {
			typeof(collapse === 'undefined')
                ? console.group(title)
                : console.groupCollapsed(title); 
            console.log(data);
			console.groupEnd();
		}
	}
})(angular);