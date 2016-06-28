'use strict';

module.exports =
  angular.module('andromeda.modules.opportunities', [
  ])
  .config(function ($stateProvider) {
    $stateProvider
    .state('opportunities', {
      url: '',
      templateUrl: './app/modules/opportunities/layout.html',
      controller: 'opportunitiesController'
    });
  })
  .controller('opportunitiesController', require('./opportunitiesController'));
