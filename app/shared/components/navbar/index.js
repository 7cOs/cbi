'use strict';

function NavbarController($scope, $mdPanel) {
  var vm = this;

  // Expose public methods
  vm.showMenu = showMenu;

  // Default values
  vm.noNotifications = 'You have no unread notifications.';
  vm.notificationsActive = false;

  // PUBLIC METHODS
  function showMenu($mdPanel, menu) {
    vm.notificationsActive = true;

    $mdPanel.show({
      hideDelay: 0,
      position: 'top right',
      scope: $scope.$new(),
      templateUrl: './app/shared/components/navbar/panel-notifications.html'
    });
  };
}

module.exports =
  angular.module('orion.common.components.navbar', [])
  .component('navbar', {
    templateUrl: './app/shared/components/navbar/navbar.html',
    controller: NavbarController,
    controllerAs: 'nb'
  });
