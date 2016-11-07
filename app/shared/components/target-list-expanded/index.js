'use strict';

module.exports =
  angular.module('cf.common.components.expanded', [])
  .component('expanded', {
    templateUrl: './app/shared/components/target-list-expanded/expanded.html',
    controller: 'expandedController',
    controllerAs: 'expanded'
  })
  .controller('expandedController', require('./expandedController'));
