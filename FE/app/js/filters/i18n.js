(function (angular) {
    angular
        .module('app')
        .filter('i18n', fltr);

    fltr.$inject = ['i18nChart', '$state', '$parse', 'DEFAULT_LANGUAGE'];

    function fltr(i18nChart, $state, $parse, DEFAULT_LANGUAGE) {
        return function (key) {
            var lang = $state.params.lang || DEFAULT_LANGUAGE;
            if (!key) {
                console.error('i18n could not detect a key-string.');
            }
            var translated = $parse(key)(i18nChart[lang]);
            if (!translated) {
                console.warn('i18n - value wasnt found for [' + key + ']');
                translated = key;
            }
            return translated;
        };
    }
})(angular);