'use strict';

module.exports =
  angular.module('cf.modules.landing', [
    // load your sample submodules here, e.g.:
    // require('./bar').name
  ])
  .config(function ($stateProvider) {
    $stateProvider
    .state('landing', {
      url: '/',
      title: 'Welcome',
      template: require('./layout.pug'),
      controller: 'landingController',
      controllerAs: 'l',
      analyticsData: {
        pageTitle: 'Home'
      }
    });
  })
  .controller('landingController', require('./landingController'));

