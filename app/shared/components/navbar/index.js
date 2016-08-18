'use strict';

function NavbarController($rootScope, $scope, $mdPanel, $mdDialog, notificationsService) {

  // ****************
  // CONTROLLER SETUP
  // ****************

  // Initial variables
  var vm = this,
      userAgent = navigator.userAgent;

  // User Agent Detection for IE fixes
  $rootScope.isIE = (/Trident\/7\./g).test(userAgent);
  $rootScope.isEdge = (/(?:\bEdge\/)(\d+)/g).test(userAgent);

  // Services
  vm.notificationsService = notificationsService.tempData();
  vm.notifications = vm.notificationsService.notifications;

  // Defaults
  vm.unreadNotifications = getUnreadCount();
  vm.noNotifications = 'No unread notifications.';

  // Mock data
  vm.accountSelectorSelected = 'Distributor';
  vm.accountSelectorOptions = [
    {
      name: 'Distributor'
    },
    {
      name: 'Chain'
    },
    {
      name: 'Store'
    }
  ];

  // Expose public methods
  vm.markRead = markRead;
  vm.modalAddOpportunityForm = modalAddOpportunityForm;
  vm.closeModal = closeModal;

  // **************
  // PUBLIC METHODS
  // **************

  // Mark notification as read on click
  function markRead(notification) {
    // Patch to mark read would go here
    notification.read = true;
    getUnreadCount();
  }

  // "Add Opportunity" modal
  function modalAddOpportunityForm() {
    $mdDialog.show({
      clickOutsideToClose: true,
      scope: $scope.$new(),
      templateUrl: './app/shared/components/navbar/modal-add-opportunity-form.html'
    });
  }

  // Close "Add Opportunity" modal
  function closeModal() {
    $mdDialog.hide();
  }

  // ***************
  // PRIVATE METHODS
  // ***************

  // Get unread notification count and set initial badge value
  function getUnreadCount() {
    var n = 0;

    angular.forEach(vm.notifications, function(value) {
      if (value.read === false) {
        n++;
      }
    });
    vm.unreadNotifications = n;
    return n;
  }
}

module.exports =
  angular.module('orion.common.components.navbar', [])
  .component('navbar', {
    templateUrl: './app/shared/components/navbar/navbar.html',
    controller: NavbarController,
    controllerAs: 'nb'
  });
