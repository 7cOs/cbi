'use strict';

module.exports =
  angular.module('andromeda.modules.targetLists', [
    // load your sample submodules here, e.g.:
    // require('./bar').name
  ])
  .config(function ($stateProvider) {
    $stateProvider
    .state('targetLists', {
      url: '/targetLists',
      templateUrl: './app/modules/targetLists/layout.html',
      controller: 'targetListsController'
    });
  })
  .controller('targetListsController', require('./targetListsController'));
