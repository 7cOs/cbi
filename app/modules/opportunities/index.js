'use strict';

module.exports =
  angular.module('andromeda.modules.opportunities', [
    //load your sample submodules here, e.g.:
    //require('./bar').name
  ])
  .config(function ($stateProvider) {
    $stateProvider
    .state('opportunities', {
      url: '/',
      //templateUrl: 'app/modules/opportunities/index.html',
      template:"<h1>testing testing</h1>",
      controller: 'opportunitiesController'
    });
  })
  .controller('opportunitiesController', require('./opportunitiesController'));


