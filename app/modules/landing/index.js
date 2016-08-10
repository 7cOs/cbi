'use strict';

module.exports =
  angular.module('orion.modules.landing', [
    // load your sample submodules here, e.g.:
    // require('./bar').name
  ])
  .config(function ($stateProvider) {
    $stateProvider
    .state('landing', {
      url: '/',
      title: 'Welcome',
      templateUrl: './app/modules/landing/layout.html',
      controller: 'landingController',
      controllerAs: 'l'
    });
  })
  .controller('landingController', require('./landingController'));
