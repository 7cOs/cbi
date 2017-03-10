'use strict';

module.exports =
  angular.module('cf.common.components.list', [])
  .component('list', {
    template: require('./list.pug'),
    controller: 'listController',
    controllerAs: 'list'
  })
  .controller('listController', require('./listController'));
