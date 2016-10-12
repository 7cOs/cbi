'use strict';

module.exports =
  angular.module('cf.common.components.filter', [])
  .component('filter', {
    templateUrl: './app/shared/components/filter/filter.html',
    controller: 'filterController',
    controllerAs: 'filter'
  })
  .controller('filterController', require('./filterController'));
