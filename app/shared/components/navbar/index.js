'use strict';

function NavbarController($scope) {
  $scope.$on('page:loaded', function(event, data) {
    $scope.pageName = data;
  });
}

module.exports =
  angular.module('orion.common.components.navbar', [])
  .component('navbar', {
    templateUrl: './app/shared/components/navbar/navbar.html',
    controller: NavbarController
  });
