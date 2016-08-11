'use strict';

module.exports =
  angular.module('orion.modules.opportunities', [
  ])
  .config(function ($stateProvider) {
    $stateProvider
    .state('opportunities', {
      url: '/opportunities',
      title: 'Opportunities',
      templateUrl: './app/modules/opportunities/layout.html',
      controller: 'opportunitiesController',
      controllerAs: 'o'
    });
  })
  .controller('opportunitiesController', require('./opportunitiesController'));
