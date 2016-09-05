'use strict';

function NavbarController($rootScope, $scope, $state, $window, $mdPanel, $mdDialog, $mdMenu, $mdSelect, notificationsService, opportunitiesService, targetListService, userService, versionService) {

  // ****************
  // CONTROLLER SETUP
  // ****************

  // Initial variables
  var vm = this,
      userAgent = navigator.userAgent;

  // User Agent Detection for IE fixes
  $rootScope.isIE = (/Trident\/7\./g).test(userAgent);
  $rootScope.isEdge = (/(?:\bEdge\/)(\d+)/g).test(userAgent);

  // Currently logged in user (for analytics)
  $window.currentUserId = userService.model.currentUser.employeeID;
  $window.analyticsId = $rootScope.analytics.id;

  // Services
  vm.notificationsService = notificationsService;
  vm.notifications = [];
  vm.unreadNotifications = 0;
  vm.userService = userService;
  vm.versionService = versionService;

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

  vm.targetLists = [];

  // Expose public methods
  vm.markRead = markRead;
  vm.modalAddOpportunityForm = modalAddOpportunityForm;
  vm.closeModal = closeModal;
  vm.closeMenus = closeMenus;
  vm.addOpportunity = addOpportunity;
  vm.addAnotherOpportunity = addAnotherOpportunity;
  vm.newOpportunity = {
    properties: {
      product: {
        type: 'sku'
      }
    }
  };
  vm.newOpportunityArray = [];
  vm.showNewRationaleInput = showNewRationaleInput;
  vm.addNewRationale = false;
  vm.addToTargetList = addToTargetList;
  vm.markSeen = markSeen;

  init();

  // **************
  // PUBLIC METHODS
  // **************

  // Mark notification as read on click
  function markRead(notification) {
    vm.notificationsService
      .markNotifications([{
        id: notification.id,
        status: vm.notificationsService.status.READ
      }])
      .then(function() {
        notification.status = vm.notificationsService.status.READ;
        setUnreadCount(vm.unreadNotifications - 1);
      });

    if (notification.objectType.toUpperCase() === 'TARGET_LIST') {
      targetListService.model.currentList.id = notification.objectId;
      $state.go('target-list-detail');
    } else if (notification.objectType.toUpperCase() === 'OPPORTUNITY') {
      opportunitiesService.model.opportunityId = notification.objectId;
      $state.go('opportunities');
    }
  }

  // Mark notification as seen when opened
  function markSeen(notifications) {
    var toMarkSeen = notifications
      .filter(function(i) {
        return i.status === vm.notificationsService.status.UNSEEN;
      })
      .map(function(i) {
        return {
          'id': i.id,
          'status': vm.notificationsService.status.SEEN
        };
      });

    vm.notificationsService
      .markNotifications(toMarkSeen)
      .then(function() {
        vm.notificationHelper.showBadge = false;
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
  function addOpportunity(opportunity) {
    if (saveOpportunity(opportunity)) {
      vm.newOpportunity = {};
      $mdDialog.hide();
    }
  }

  // Adds opportunities to an array with the same account name
  function addAnotherOpportunity(opportunity) {
    if (saveOpportunity(opportunity)) {
      vm.newOpportunity = {
        properties: {
          store: {
            description: opportunity.properties.store.description
          }
        }
      };
    }
  }

  function saveOpportunity(opportunity) {
    console.log('saving', vm.addOpportunityForm);
    if (vm.addOpportunityForm.$invalid === true) {
      return false;
    }

    var isDistribution = opportunity.properties.distributionType.type === 'new';
    var oppSubType = isDistribution ? 'ND001' : opportunity.properties.distributionType.description;
    var isMixedType = !isDistribution && opportunity.properties.product.type === 'mixed';
    var targetList = opportunity.properties.targetList;

    var payload = {
      'store': opportunity.properties.store.description,
      'product': !isMixedType && opportunity.properties.product.text,
      'mixedBrand': isMixedType,
      'rationale': opportunity.properties.rationale.description,
      'impactCode': opportunity.properties.impact.enum,
      'oppSubType': oppSubType
    };

    opportunitiesService
      .createOpportunity(payload)
      .then(function(result) {
        if (targetList) {
          addToTargetList(targetList, result);
        }
      });

    return true;
  }

  function addToTargetList(targetList, opportunity) {
    targetListService.addTargetListOpportunities(targetList, [opportunity.id]);
  }

  // Close "Add Opportunity" modal
  function closeModal() {
    vm.newOpportunity = {};
    $mdDialog.hide();
  }

  function closeMenus($event) {
    if ($event.relatedTarget === null) {
      $mdSelect.hide();
      $mdMenu.hide();
    }
  }

  // ***************
  // PRIVATE METHODS
  // ***************

  function init() {
    userService
    .getNotifications(userService.model.currentUser.employeeID)
    .then(function(result) {
      vm.notifications = result;
      setUnreadCount(vm.notifications);
    });

    userService
    .getTargetLists(userService.model.currentUser.employeeID)
    .then(function(result) {
      vm.targetLists = result.owned;
    });
    versionService.getVersion().then(function(data) {
      versionService.model.version = data;
    });
  };

  // Get unread notification count and set initial badge value
  function setUnreadCount(arr) {
    var value = 0;
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].status.toUpperCase() === 'UNSEEN') value++;
    }

    vm.notificationHelper = {
      unreadNotifications: value,
      showBadge: true
    };

    if (value < 1) vm.notificationHelper.showBadge = false;
  }

  // Show inputs if a new item is needed
  function showNewRationaleInput(yes)  {
    vm.addNewRationale = yes;
  }
}

module.exports =
  angular.module('cf.common.components.navbar', [])
  .component('navbar', {
    templateUrl: './app/shared/components/navbar/navbar.html',
    controller: NavbarController,
    controllerAs: 'nb'
  });
