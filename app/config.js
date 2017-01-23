'use strict';

module.exports = /*  @ngInject */
  function($mdThemingProvider, $locationProvider, $httpProvider, $analyticsProvider) {

    if (!$httpProvider.defaults.headers.get) {
      $httpProvider.defaults.headers.get = {};
    }
    $httpProvider.interceptors.push('httpInterceptorService');

    // IE Workaround to correct incorrect caching by IE
    $httpProvider.defaults.headers.get['If-Modified-Since'] = 'Fri, 19 Aug 2016 05:00:00 GMT';

    $mdThemingProvider.theme('default')
      .primaryPalette('grey')
      .accentPalette('light-blue');
    $locationProvider.html5Mode(true);

    // disable angulartics auto tracking
    $analyticsProvider.virtualPageviews(false);
    $analyticsProvider.trackRoutes(false);
    $analyticsProvider.trackStates(false);
    $analyticsProvider.firstPageview(false);
  };
