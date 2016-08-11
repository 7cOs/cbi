'use strict';

module.exports =
  angular.module('orion.modules.scorecards', [
    // load your sample submodules here, e.g.:
    // require('./bar').name
  ])
  .config(function ($stateProvider) {
    $stateProvider
    .state('scorecards', {
      url: '/scorecards',
      title: 'Scorecards',
      templateUrl: './app/modules/scorecards/layout.html',
      controller: 'scorecardsController',
      controllerAs: 's'
    });
  })
  .controller('scorecardsController', require('./scorecardsController'));
