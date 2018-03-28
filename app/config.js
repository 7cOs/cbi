'use strict';
const myPerformanceConfigState = require('./containers/my-performance/my-performance.state.ts').configState;
const listsConfigState = require('./containers/lists/list-detail.state').configState;

module.exports = /*  @ngInject */
  function($mdThemingProvider, $locationProvider, $httpProvider, $urlRouterProvider, $stateProvider) {

    // call config for Angular containers
    myPerformanceConfigState($stateProvider);
    listsConfigState($stateProvider);

    if (!$httpProvider.defaults.headers.get) {
      $httpProvider.defaults.headers.get = {};
    }
    $httpProvider.interceptors.push('httpInterceptorService');

    // IE Workaround to correct incorrect caching by IE
    $httpProvider.defaults.headers.get['If-Modified-Since'] = 'Fri, 19 Aug 2016 05:00:00 GMT';

    $mdThemingProvider.theme('default')
      .primaryPalette('grey')
      .accentPalette('light-blue');

    $locationProvider.html5Mode({ enabled: true });

    // route to / when unknown route is encountered
    $urlRouterProvider.otherwise('/');
  };
