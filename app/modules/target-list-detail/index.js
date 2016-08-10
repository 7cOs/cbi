'use strict';

module.exports =
  angular.module('orion.modules.targetListDetail', [
    // load your sample submodules here, e.g.:
    // require('./bar').name
  ])
  .config(function($stateProvider) {
    $stateProvider
    .state('target-list-detail', {
      url: '/target-list-detail',
      title: 'Target List',
      templateUrl: './app/modules/target-list-detail/layout.html',
      controller: 'targetListDetailController',
      controllerAs: 'tld'
    });
  })
  .controller('targetListDetailController', require('./targetListDetailController'));
