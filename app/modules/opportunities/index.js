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
      }
    });
  })
  .controller('opportunitiesController', require('./opportunitiesController'));
