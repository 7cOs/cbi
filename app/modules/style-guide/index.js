'use strict';

module.exports =
  angular.module('cf.modules.styleGuide', [
  ])
  .config(function ($stateProvider) {
    $stateProvider
    .state('style-guide', {
      url: '/style-guide',
      title: 'Style Guide',
      templateUrl: './app/modules/style-guide/layout.html',
      controller: 'styleGuideController',
      controllerAs: 'sg'
    });
  })
  .controller('styleGuideController', require('./styleGuideController'));
