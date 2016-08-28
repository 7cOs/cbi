'use strict';

function NavbarController($rootScope, $scope, $mdPanel, $mdDialog, notificationsService, opportunitiesService, targetListService, userService) {

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
  vm.notificationsService = notificationsService;
  vm.notifications = [];
  vm.unreadNotifications = 0;
  vm.userService = userService;

  // Defaults
  vm.noNotifications = 'No unread notifications.';
  vm.myAccountsOnly = true;

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

  vm.rationales = [
    {
      'type': 'New Buyer'
    }
  ];

  vm.targetLists = [
    {
      name: 'Irish Pubs'
    },
    {
      name: 'Grocery Stores'
    }
  ];

  // Expose public methods
  vm.markRead = markRead;
  vm.modalAddOpportunityForm = modalAddOpportunityForm;
  vm.closeModal = closeModal;
  vm.addNewOpportunity = addNewOpportunity;
  vm.newOpportunity = {};
  vm.newOpportunityArray = [];
  vm.addToTargetListArray = addToTargetListArray;
  vm.showNewRationaleInput = showNewRationaleInput;
  vm.addNewRationale = false;
  vm.addToTargetList = addToTargetList;

  init();

  // **************
  // PUBLIC METHODS
  // **************

  // Mark notification as read on click
  function markRead(notification) {
    vm.notificationsService
      .markNotification(notification.id, vm.notificationsService.status.READ)
      .then(function() {
        notification.status = vm.notificationsService.status.READ;
        setUnreadCount(vm.unreadNotifications - 1);
      });
  }

  // "Add Opportunity" modal
  function modalAddOpportunityForm() {
    $mdDialog.show({
      clickOutsideToClose: true,
      scope: $scope.$new(),
      templateUrl: './app/shared/components/navbar/modal-add-opportunity-form.html'
    });
  }

  // Add Opportunity
  function addNewOpportunity(opportunityList) {
    if (vm.addOpportunityForm.$invalid) {
      return false;
    }

    addToTargetListArray(vm.newOpportunity);

    vm.newOpportunityArray.forEach(function(opportunity) {

      // TODO will need to be called properly
      // opportunitiesService.createOpportunity();
    });

    vm.newOpportunity = {};
    $mdDialog.hide();
  }

  // Adds opportunities to an array with the same account name
  function addToTargetListArray (opportunity) {
    var accountName;

    vm.newOpportunityArray.push(opportunity);

    accountName = opportunity.properties.store.description;

    vm.newOpportunity =   {
      properties: {
        store: {
          description: accountName
        }
      }
    };
  }

  function addToTargetList(opportunity) {
    // TODO will need to be called properly
    // Not sure if this even the correct service call
    // targetListService.addTargetListOpportunities();
  }

  // Close "Add Opportunity" modal
  function closeModal() {
    vm.newOpportunity = {};
    $mdDialog.hide();
  }

  // Show inputs if a new item is needed
  function showNewRationaleInput()  {
    vm.addNewRationale = true;
  }

  // ***************
  // PRIVATE METHODS
  // ***************

  function init() {
    userService
    .getNotifications(userService.model.currentUser.personID)
    .then(function(result) {
      vm.notifications = result;
      setUnreadCount(vm.notifications);
      console.log(vm.notifications);
      console.log(vm.unreadNotifications);
    });
  }

  // Get unread notification count and set initial badge value
  function setUnreadCount(arr) {
    var value = 0;
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].status.toUpperCase() === 'UNSEEN') value++;
    }
    vm.unreadNotifications = value;
  }
}

module.exports =
  angular.module('cf.common.components.navbar', [])
  .component('navbar', {
    templateUrl: './app/shared/components/navbar/navbar.html',
    controller: NavbarController,
    controllerAs: 'nb'
  });
