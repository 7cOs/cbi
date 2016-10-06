'use strict';

module.exports = /*  @ngInject */
  function($mdThemingProvider, $locationProvider, $httpProvider) {

    if (!$httpProvider.defaults.headers.get) {
      $httpProvider.defaults.headers.get = {};
    }

    // IE Workaround to correct incorrect caching by IE
    $httpProvider.defaults.headers.get['If-Modified-Since'] = 'Mon, 26 Jul 1997 05:00:00 GMT';

    $mdThemingProvider.theme('default')
      .primaryPalette('grey')
      .accentPalette('light-blue');
    $locationProvider.html5Mode(true);
  };
