'use strict';

function NavbarController($rootScope, $scope, $mdPanel, notificationsService) {
  var vm = this,
      userAgent = navigator.userAgent;

  // User Agent Detection for IE fixes
  $rootScope.isIE = (/Trident\/7\./g).test(userAgent);
  $rootScope.isEdge = (/(?:\bEdge\/)(\d+)/g).test(userAgent);

  // Services
  vm.notificationsService = notificationsService.tempData();
  vm.notifications = vm.notificationsService.notifications;

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
