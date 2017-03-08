'use strict';

module.exports =
  angular.module('cf.common.components.expanded', [])
  .component('expanded', {
    template: require('./expanded.pug'),
    controller: 'expandedController',
    controllerAs: 'expanded'
  })
  .controller('expandedController', require('./expandedController'));
