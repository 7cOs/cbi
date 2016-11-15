'use strict';

module.exports =
  angular.module('cf.modules.targetListDetail', [
    // load your sample submodules here, e.g.:
    // require('./bar').name
  ])
  .config(function($stateProvider) {
    $stateProvider
    .state('target-list-detail', {
      url: '/target-lists/:id',
      title: 'Target List',
      templateUrl: './app/modules/target-list-detail/layout.html',
      controller: 'targetListDetailController',
      controllerAs: 'tld',
      onExit: function($rootScope, opportunitiesService) {
        $rootScope.isGrayedOut = false;

        opportunitiesService.model = {
          filterApplied: false,
          opportunities: [],
          opportunityId: null,
          noOpportunitiesFound: false
        };
      }
    });
  })
  .controller('targetListDetailController', require('./targetListDetailController'));
