'use strict';

module.exports =
  angular.module('orion.modules.targetLists', [
    // load your sample submodules here, e.g.:
    // require('./bar').name
  ])
  .config(function ($stateProvider) {
    $stateProvider
    .state('target-lists', {
      url: '/target-lists',
      title: 'Target Lists',
      templateUrl: './app/modules/target-lists/layout.html',
      controller: 'targetListsController',
      controllerAs: 't'
    });
  })
  .controller('targetListsController', require('./targetListsController'));
