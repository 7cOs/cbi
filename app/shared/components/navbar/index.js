'use strict';

function NavbarController($scope, $location) {
  $scope.location = $location.path();
}

module.exports =
  angular.module('andromeda.common.components.datepicker', [])
  .component('navbar', {
    templateUrl: './app/shared/components/navbar/navbar.html',
    controller: NavbarController
  });
