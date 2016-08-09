'use strict';

function TabsController($scope) {

}

module.exports =
  angular.module('orion.common.components.tabs', [])
  .component('tabs', {
    templateUrl: './app/shared/components/tabs/tabs.html',
    controller: TabsController
  });
