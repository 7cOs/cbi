'use strict';

module.exports =
  angular.module('cf.modules.scorecards', [
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
      controllerAs: 's',
      analyticsData: {
        pageTitle: 'Performance : My Scorecards'
      }
    });
  })
  .controller('scorecardsController', require('./scorecardsController'));
