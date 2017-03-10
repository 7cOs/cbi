'use strict';

function DropdownController($scope) {

}

module.exports =
  angular.module('cf.common.components.dropdown', [])
  .component('dropdown', {
    template: require('./dropdown.pug'),
    controller: DropdownController
  });
