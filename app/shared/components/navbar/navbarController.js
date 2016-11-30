'use strict';

module.exports = /*  @ngInject */
  function navbarController($rootScope, $scope, $state, $window, $mdPanel, $mdDialog, $mdMenu, $mdSelect, $anchorScroll, notificationsService, opportunitiesService, targetListService, userService, versionService, loaderService, ieHackService, toastService, filtersService, moment) {

    // ****************
    // CONTROLLER SETUP
    // ****************

    // Initial variables
    var vm = this;

    // User Agent Detection for IE fixes
    $rootScope.isIE = ieHackService.isIE;
    $rootScope.isEdge = ieHackService.isEdge;

    // Reset any active loaders and scroll position on state change
    $rootScope.$on('$stateChangeStart', function() {
      loaderService.closeLoader();
      $anchorScroll();
    });

    // fixes hanging selects in menu
    $rootScope.$on('$mdMenuClose', function() {
      $mdSelect.hide();
    });

    // Currently logged in user (for analytics)
    $window.currentUserId = userService.model.currentUser.employeeID;
    $window.analyticsId = $rootScope.analytics.id;

    // Services
    vm.notificationsService = notificationsService;
    vm.userService = userService;
    vm.versionService = versionService;

    // Defaults
    vm.addNewRationale = false;
    vm.myAccountsOnly = true;
    vm.noNotifications = 'No unread notifications.';
    vm.notifications = [];
    vm.newOpportunityArray = [];
    vm.newOpportunityTemplate = {
      properties: {
        product: {
          type: 'sku'
        },
        distributionType: {
          type: 'new'
        }
      }
    };
    vm.newOpportunity = vm.newOpportunityTemplate;
    vm.unreadNotifications = 0;

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
        'type': 'Based on account visit / discussion with decision-maker'
      }
    ];

    vm.targetLists = [];

    // Expose public methods
    vm.addAnotherOpportunity = addAnotherOpportunity;
    vm.addOpportunity = addOpportunity;
    vm.addToTargetList = addToTargetList;
    vm.closeMenus = closeMenus;
    vm.closeModal = closeModal;
    vm.getTargetLists = getTargetLists;
    vm.markRead = markRead;
    vm.markSeen = markSeen;
    vm.modalAddOpportunityForm = modalAddOpportunityForm;
    vm.showNewRationaleInput = showNewRationaleInput;

    $scope.$watch(function() { return toastService.model; }, function(newVal) {
      vm.archived = newVal.archived;
      vm.deleted = newVal.deleted;
      vm.added = newVal.added;
      vm.copied = newVal.copied;
      vm.deleteError = newVal.deleteError;
      vm.multipleTargetListsSelected = newVal.multipleTargetListsSelected;
    }, true);

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
          setUnreadCount(vm.notifications);
        });

      if (notification.objectType.toUpperCase() === 'TARGET_LIST') {
        $state.go('target-list-detail', ({id: notification.shortenedObject.id}));
      } else if (notification.objectType.toUpperCase() === 'OPPORTUNITY') {
        opportunitiesService.model.opportunityId = notification.shortenedObject.id;
        $state.go('opportunities', (opportunitiesService.model.opportunityId), {reload: true});
      } else if (notification.objectType.toUpperCase() === 'ACCOUNT') $state.go('accounts');

      $mdMenu.hide();
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
      var targetListToFind = opportunity.properties.targetList,
          model = userService.model.targetLists.owned;

      angular.forEach(model, function(key, value) {
        if (key.id === targetListToFind) {
          model[value].dateOpportunitiesUpdated = moment().format();
          var tempModel = model[value];
          model.splice(value, 1).unshift(tempModel);
        }
      });

      var tempType = opportunity.properties.product.type;

      opportunity.properties.store = vm.chosenStoreObject;
      opportunity.properties.product = vm.chosenProductObject;
      opportunity.properties.product.type = tempType;
      if (saveOpportunity(opportunity)) {
        vm.newOpportunity = {};
        $mdDialog.hide();
      }

      filtersService.model.appliedFilter.pagination.totalOpportunities++;
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

      if (opportunity.properties.rationale.other) {
        opportunity.properties.rationale.description = opportunity.properties.rationale.other;
      }

      var payload = {
        'store': opportunity.properties.store.id,
        'itemId': !isMixedType && opportunity.properties.product.id,
        'itemType': 'SKU_PACKAGE',
        'mixedBrand': isMixedType,
        'rationale': opportunity.properties.rationale.description,
        'impact': opportunity.properties.impact.enum,
        'subType': oppSubType
      };

      opportunitiesService
        .createOpportunity(payload)
        .then(function(result) {
          if (targetList) {
            addToTargetList(targetList, result);
          }
          toastService.showToast('added');
        });

      return true;
    }

    function addToTargetList(targetList, opportunity) {
      var storeExists = false;

      targetListService.addTargetListOpportunities(targetList, [opportunity.id]);
      opportunity.brands = [];
      opportunity.brands.push(opportunity.product.brand.toLowerCase());

      angular.forEach(opportunitiesService.model.opportunities, function(key, value) {

        if (opportunity.store.id === key.store.id) {
          key.groupedOpportunities.push(opportunity);
          storeExists = true;
        }
      });

      if (!storeExists) {
        filtersService.model.appliedFilter.pagination.totalStores++;
        opportunity.groupedOpportunities = [];
        opportunity.groupedOpportunities.push(opportunity);
        opportunitiesService.model.opportunities.push(opportunity);
      }
    }

    // Close "Add Opportunity" modal
    function closeModal() {
      vm.newOpportunity = vm.newOpportunityTemplate;
      $mdDialog.hide();
    }

    function closeMenus($event) {
      if ($event.relatedTarget === null) {
        $mdSelect.hide();
        $mdMenu.hide();
      }
    }

    function getTargetLists() {
      if (vm.targetLists.length < 1) {
        userService
        .getTargetLists(userService.model.currentUser.employeeID)
        .then(function(result) {
          vm.targetLists = result.owned;
        });
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

      versionService.getVersion().then(function(data) {
        versionService.model.version = data;
      });
    };

    // Get unread notification count and set initial badge value
    function setUnreadCount(arr) {
      var unseen = 0;
      var notRead = 0;
      for (var i = 0; i < arr.length; i++) {
        if (arr[i].status.toUpperCase() === 'UNSEEN') unseen++;
        if (arr[i].status.toUpperCase() !== 'READ') notRead++;
      }

      vm.notificationHelper = {
        unseenNotifications: unseen,
        unreadNotifications: notRead,
        showBadge: true
      };

      if (unseen < 1) vm.notificationHelper.showBadge = false;
    }

    // Show inputs if a new item is needed
    function showNewRationaleInput(yes)  {
      vm.addNewRationale = yes;
    }
  };
