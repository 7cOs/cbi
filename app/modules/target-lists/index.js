'use strict';

module.exports = /*  @ngInject */
  angular.module('cf.modules.targetLists', [
    // load your sample submodules here, e.g.:
    // require('./bar').name
  ])
  .config(function ($stateProvider) {
    $stateProvider
    .state('lists', {
      url: '/lists',
      title: 'Lists',
      params: {
        obj: 0
      },
      template: require('./layout.pug'),
      controller: 'targetListsController',
      controllerAs: 't',
      analyticsData: {
        pageTitle: 'Lists'
      }
    });
  })
  .controller('targetListsController', require('./targetListsController'));
