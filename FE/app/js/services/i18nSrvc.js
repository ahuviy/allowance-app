(function (angular) {
    angular
        .module('app')
        .service('i18nSrvc', i18nSrvc);

    i18nSrvc.$inject = ['DEFAULT_LANGUAGE', 'i18nChart', 'routeSrvc', '$rootElement'];

    function i18nSrvc(DEFAULT_LANGUAGE, i18nChart, routeSrvc, $rootElement) {

        var FUNCTIONS_TO_EXPORT = {
            getCurrentLang: getCurrentLang,
            setLangAs: setLangAs
        };
        Object.assign(this, FUNCTIONS_TO_EXPORT);


        var CURRENT_LANGUAGE = DEFAULT_LANGUAGE;


        function getCurrentLang() {
            return CURRENT_LANGUAGE;    
        }
        
        
        function setLangAs(newLang) {
            if (!i18nChart[newLang]) {
                console.error('new language is not supported in i18nChart');
                return;
            }
            CURRENT_LANGUAGE = newLang;
            setHtmlDirAttr(CURRENT_LANGUAGE);
            routeSrvc.reload({ lang: CURRENT_LANGUAGE });
        }

        
        function setHtmlDirAttr(lang) {
            if (!i18nChart[lang].HTML_DIR_ATTR) {
                console.warn('language has no dir attribute specified');
                return;
            }
            $rootElement.attr('dir', i18nChart[lang].HTML_DIR_ATTR);
        }
    }
})(angular);