'use strict';

module.exports = /*  @ngInject */
  angular.module('cf.modules.targetLists', [
    // load your sample submodules here, e.g.:
    // require('./bar').name
  ])
  .config(function ($stateProvider) {
    $stateProvider
    .state('target-lists', {
      url: '/target-lists',
      title: 'Target Lists',
      params: {
        obj: 0
      },
      templateUrl: './app/modules/target-lists/layout.html',
      controller: 'targetListsController',
      controllerAs: 't'
    });
  })
  .controller('targetListsController', require('./targetListsController'));
