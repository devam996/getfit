(function(){
    'use strict';

    angular
        .module('wfhApp')
        .config(configConfig);

    configConfig.$inject = ['$mdThemingProvide'];

    function configConfig($mdThemingProvide) {
        var themePalette = {
            primary: "blue",
            accent: "amber",
            warn: "red"
        };

        activate();

        function activate() {
            setTheme();
        }

        function setTheme() {
            $mdThemingProvider.theme('default')
                .primaryPalette(themePalette.primary)
                .accentPalette(themePalette.accent)
                .warnPalette(themePalette.warn);
        }
    }

}());