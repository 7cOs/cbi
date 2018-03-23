'use strict';

module.exports =
  angular.module('cf.modules.targetListDetail', [
    // load your sample submodules here, e.g.:
    // require('./bar').name
  ])
  .config(function($stateProvider) {
    $stateProvider
    .state('target-list-detail', {
      url: '/lists/:id',
      title: 'Target List',
      template: require('./layout.pug'),
      controller: 'targetListDetailController',
      controllerAs: 'tld',
      onExit: function($rootScope, opportunitiesService, filtersService) {
        $rootScope.isGrayedOut = false;
        opportunitiesService.clearOpportunitiesModel();
        filtersService.resetFilters();
        filtersService.resetPagination();
      },
      analyticsData: {
        pageTitle: 'Target List',
        pageUrl: '/lists/:id'
      }
    });
  })
  .controller('targetListDetailController', require('./targetListDetailController'));
