'use strict';

module.exports = /*  @ngInject */
  function($mdThemingProvider, $locationProvider) {
    $mdThemingProvider.theme('default')
      .primaryPalette('grey')
      .accentPalette('light-blue');
    $locationProvider.html5Mode(true);
  };
