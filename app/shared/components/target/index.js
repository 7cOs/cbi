'use strict';

module.exports =
  angular.module('cf.common.components.target', [])
  .component('target', {
    templateUrl: './app/shared/components/target/target.html',
    controller: 'targetListController',
    controllerAs: 'target'
  })
  .controller('targetListController', require('./targetListController'));
