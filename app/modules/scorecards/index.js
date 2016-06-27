'use strict';

module.exports =
  angular.module('andromeda.modules.scorecards', [
    //load your sample submodules here, e.g.:
    //require('./bar').name
  ])
  .config(function ($stateProvider) {
    $stateProvider
    .state('scorecards', {
      url: '/scorecards/',
      templateUrl: 'modules/scorecards/index.html',
      controller: 'scorecardsController'
    });
  })
  .controller('scorecardsController', require('./scorecardsController'));



