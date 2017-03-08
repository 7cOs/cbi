'use strict';

function TabsController($scope) {

}

module.exports =
  angular.module('cf.common.components.tabs', [])
  .component('tabs', {
    template: require('./tabs.pug'),
    controller: TabsController
  });
