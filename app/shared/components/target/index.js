'use strict';

module.exports =
  angular.module('cf.common.components.target', [])
  .component('target', {
    template: require('./target.pug'),
    controller: 'targetListController',
    controllerAs: 'target'
  })
  .controller('targetListController', require('./targetListController'));
