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
        resetFiltersOnLoad: true
      },
      templateUrl: './app/modules/opportunities/layout.html',
      controller: 'opportunitiesController',
      controllerAs: 'o'
    });
  })
  .controller('opportunitiesController', require('./opportunitiesController'));
