'use strict';

module.exports =
  angular.module('cf.common.components.list', [])
  .component('list', {
    templateUrl: './app/shared/components/list/list.html',
    controller: 'listController',
    controllerAs: 'list'
  })
  .controller('listController', require('./listController'));
