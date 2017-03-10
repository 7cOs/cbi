'use strict';

module.exports =
  angular.module('cf.modules.help', [
    // load your sample submodules here, e.g.:
    // require('./bar').name
  ])
  .config(function ($stateProvider) {
    $stateProvider
    .state('help', {
      url: '/help',
      title: 'Help',
      template: require('./layout.pug'),
      controller: 'helpController',
      controllerAs: 'help',
      analyticsData: {
        pageTitle: 'Help'
      }
    });
  })
  .controller('helpController', require('./helpController'));
