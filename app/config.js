'use strict';

module.exports =
  angular.module('andromeda.modules.config')
  .config(function($mdThemingProvider, $locationProvider) {
    $mdThemingProvider.theme('default')
      .primaryPalette('grey')
      .accentPalette('light-blue');
    $locationProvider.html5Mode(true);
  });
