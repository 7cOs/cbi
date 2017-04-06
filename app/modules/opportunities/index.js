'use strict';

module.exports =
  angular.module('cf.modules.opportunities', [
  ])
  .config(function ($stateProvider) {
    $stateProvider
    .state('opportunities', {
      url: '/opportunities',
      title: 'Opportunities',
      params: {
        resetFiltersOnLoad: true,
        applyFiltersOnLoad: false
      },
      template: require('./layout.pug'),
      controller: 'opportunitiesController',
      controllerAs: 'o',
      analyticsData: {
        pageTitle: 'Opportunities'
      },
      onExit: function(opportunitiesService, filtersService) {
        opportunitiesService.clearOpportunitiesModel();
        filtersService.resetFilters();
        filtersService.resetPagination();
      }
    });
  })
  .controller('opportunitiesController', require('./opportunitiesController'));
