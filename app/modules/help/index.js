'use strict';

module.exports =
  angular.module('cf.modules.help', [
    // load your sample submodules here, e.g.:
    // require('./bar').name
  ])
  .config(function ($stateProvider) {
    $stateProvider
    .state('help', {
      url: '/help',
      title: 'Help',
      templateUrl: './app/modules/help/layout.html',
      controller: 'helpController',
      controllerAs: 'help'
    });
  })
  .controller('helpController', require('./helpController'));
