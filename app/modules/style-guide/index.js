'use strict';

module.exports =
  angular.module('orion.modules.styleGuide', [
  ])
  .config(function ($stateProvider) {
    $stateProvider
    .state('style-guide', {
      url: '/style-guide',
      templateUrl: './app/modules/style-guide/layout.html',
      controller: 'styleGuideController'
    });
  })
  .controller('styleGuideController', require('./styleGuideController'));
