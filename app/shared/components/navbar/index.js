'use strict';

function NavbarController($scope, $mdPanel) {
  var vm = this;

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
