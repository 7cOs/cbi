'use strict';

module.exports =
  angular.module('andromeda.modules.landing', [
    // load your sample submodules here, e.g.:
    // require('./bar').name
  ])
  .config(function ($stateProvider) {
    $stateProvider
    .state('landing', {
      url: '',
      templateUrl: './app/modules/landing/layout.html',
      controller: 'landingController'
    });
  })
  .controller('landingController', require('./landingController'));

