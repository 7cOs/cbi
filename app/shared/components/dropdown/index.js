'use strict';

function DropdownController($scope) {

}

module.exports =
  angular.module('andromeda.common.components.dropdown', [])
  .component('dropdown', {
    templateUrl: './app/shared/components/dropdown/dropdown.html',
    controller: DropdownController
  });
