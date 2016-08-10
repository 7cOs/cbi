'use strict';

module.exports =
  angular.module('andromeda.modules.help', [
    // load your sample submodules here, e.g.:
    // require('./bar').name
  ])
  .config(function ($stateProvider) {
    $stateProvider
    .state('help', {
      url: '/help',
      templateUrl: './app/modules/help/layout.html',
      controller: 'helpController',
      controllerAs: 's'
    });
  })
  .controller('helpController', require('./helpController'));
