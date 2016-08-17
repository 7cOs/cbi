'use strict';

module.exports =
  function($mdThemingProvider, $locationProvider) {
    $mdThemingProvider.theme('default')
      .primaryPalette('grey')
      .accentPalette('light-blue', {
        'default': '50'
      });
    $locationProvider.html5Mode(true);
  };
