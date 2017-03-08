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
      template: require('./layout.pug'),
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
      },
      analyticsData: {
        pageTitle: 'Target List',
        pageUrl: '/target-lists/:id'
      }
    });
  })
  .controller('targetListDetailController', require('./targetListDetailController'));
