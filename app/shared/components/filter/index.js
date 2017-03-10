'use strict';

module.exports =
  angular.module('cf.common.components.filter', [])
  .component('filter', {
    template: require('./filter.pug'),
    controller: 'filterController',
    controllerAs: 'filter'
  })
  .controller('filterController', require('./filterController'));
