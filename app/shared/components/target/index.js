'use strict';

function TargetListController($scope) {

}

module.exports =
  angular.module('andromeda.common.components.target', [])
  .component('target', {
    templateUrl: './app/shared/components/target/target.html',
    controller: TargetListController,
    controllerAs: 'target'
  });
