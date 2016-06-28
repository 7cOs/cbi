'use strict';

module.exports =
  angular.module('andromeda.modules.targetLists', [
    // load your sample submodules here, e.g.:
    // require('./bar').name
  ])
  .config(function ($stateProvider) {
    $stateProvider
    .state('target-lists', {
      url: '/target-lists',
      templateUrl: './app/modules/target-lists/layout.html',
      controller: 'targetListsController'
    });
  })
  .controller('targetListsController', require('./targetListsController'));
