'use strict';

function NavbarController($rootScope, $scope, $mdPanel) {
  var vm = this,
      userAgent = navigator.userAgent;

  $rootScope.isIE = (/Trident\/7\./g).test(userAgent);
  $rootScope.isEdge = (/(?:\bEdge\/)(\d+)/g).test(userAgent);

  // Default values
  vm.noNotifications = 'No unread notifications.';
}

module.exports =
  angular.module('orion.common.components.navbar', [])
  .component('navbar', {
    templateUrl: './app/shared/components/navbar/navbar.html',
    controller: NavbarController,
    controllerAs: 'nb'
  });
