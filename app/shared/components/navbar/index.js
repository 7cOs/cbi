'use strict';

function NavbarController($scope) {
  $scope.$on('page:loaded', function(event, data) {
    $scope.pageName = data;
  });

  // Show market overview header if state has changed on Accounts Dashboard
  $scope.$on('scroll:scrollBelowHeader', function(event, data) {
    $scope.overviewOpen = data;
  });
}

module.exports =
  angular.module('andromeda.common.components.navbar', [])
  .component('navbar', {
    templateUrl: './app/shared/components/navbar/navbar.html',
    controller: NavbarController
  });
