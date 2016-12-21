'use strict';

module.exports = /*  @ngInject */
  function navbarController($rootScope, $scope, $state, $window, $mdPanel, $mdDialog, $mdMenu, $mdSelect, $anchorScroll, notificationsService, opportunitiesService, targetListService, userService, versionService, loaderService, ieHackService, toastService, filtersService, chipsService, moment) {

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
    vm.cacheInputs = true;
    vm.cachedOpportunity;
    vm.dateUpdated = '';
    vm.dismissedError = false;
    vm.duplicateError = false;
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
    vm.oppID;
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
    vm.addOpportunity = addOpportunity;
    vm.addToTargetList = addToTargetList;
    vm.closeMenus = closeMenus;
    vm.closeModal = closeModal;
    vm.getDismissedOpportunity = getDismissedOpportunity;
    vm.getTargetLists = getTargetLists;
    vm.markRead = markRead;
    vm.markSeen = markSeen;
    vm.modalAddOpportunityForm = modalAddOpportunityForm;
    vm.modalCustomOpportunityError = modalCustomOpportunityError;
    vm.showImpact = showImpact;
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
          vm.notificationHelper.showBadge = false;
          vm.notificationHelper.unseenNotifications = 0;
        });

      if (notification.objectType.toUpperCase() === 'TARGET_LIST') {
        $state.go('target-list-detail', ({id: notification.shortenedObject.id}));
      } else if (notification.objectType.toUpperCase() === 'OPPORTUNITY') {
        opportunitiesService.model.opportunityId = notification.shortenedObject.id;
        $state.go('opportunities', (opportunitiesService.model.opportunityId, opportunitiesService.model.filterApplied = false), {reload: true});
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
          vm.notificationHelper.unseenNotifications = 0;
        });
    }

    // "Add Opportunity" modal
    function modalAddOpportunityForm(restoreCache) {
      $mdDialog.show({
        clickOutsideToClose: false,
        scope: $scope.$new(),
        templateUrl: './app/shared/components/navbar/modal-add-opportunity-form.html'
      });
      if (restoreCache) {
        vm.cacheInputs = true;
        vm.newOpportunity = vm.cachedOpportunity;
      } else {
        vm.cacheInputs = false;
        vm.newOpportunity = vm.newOpportunityTemplate;
        resetFormModels();
      }
    }

    function modalCustomOpportunityError(error) {
      vm.dismissedError = vm.duplicateError = vm.generalError = false;

      $mdDialog.show({
        clickOutsideToClose: false,
        scope: $scope.$new(),
        templateUrl: './app/shared/components/navbar/modal-custom-opportunity-error.html'
      });

      if (error.status === 400) {
        angular.forEach(error.data, function(key, value) {
          var keepGoing = true;
          if (keepGoing && error.data.length > 1 && key.description === 'OPP107') {
            vm.duplicateOpportunity.properties.distributionType.type = 'New Distribution';
            vm.duplicateError = vm.generalError = false;
            vm.dismissedError = true;
            keepGoing = false;
            vm.getDismissedOpportunity(key.objectIdentifier);
            vm.oppID = key.objectIdentifier;
          } else {
            if (error.data.length < 2 && key.description === 'OPP101') {
              vm.duplicateOpportunity.properties.distributionType.type = 'New Distribution';
              vm.dismissedError = vm.generalError = false;
              vm.duplicateError = true;
            }
          }
        });
      } else {
        vm.generalError = true;
      }
    }

    function showImpact(letter) {
      if (letter === 'H') {
        return 'High';
      } else if (letter === 'M') {
        return 'Medium';
      } else {
        return 'Low';
      }
    }

    function getDismissedOpportunity(oppID) {
      opportunitiesService.getOpportunities(oppID, true)
      .then(function(response) {
        var isoDate = new Date(response[0].dateUpdated).toISOString();
        vm.dateUpdated = moment(isoDate).format('M/D/YYYY');
      });
    }

    // Add Opportunity
    function addOpportunity(opportunity) {
      var targetListToFind = opportunity.properties.targetList,
          model = userService.model.targetLists.owned;

      if (vm.addOpportunityForm.$invalid) {
        return false;
      }

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
        $mdDialog.hide();
      }
      vm.cachedOpportunity = angular.copy(vm.newOpportunity);
    }

    function saveOpportunity(opportunity) {

      if (vm.addOpportunityForm.$invalid) {
        return false;
      }

      var isDistribution = opportunity.properties.distributionType.type === 'new';
      var oppSubType = isDistribution ? 'ND_001' : opportunity.properties.distributionType.description;
      var isMixedType = !isDistribution && opportunity.properties.product.type === 'mixed';
      var targetList = opportunity.properties.targetList;
      var itemType = opportunity.properties.product.id ? 'SKU_PACKAGE' : 'BRAND';
      var itemId;
      var rationale;

      if (opportunity.properties.rationale.other) {
        rationale = opportunity.properties.rationale.other;
      } else {
        rationale = opportunity.properties.rationale.description;
      }

      if (!opportunity.properties.product.id && opportunity.properties.product.brandCode) {
        itemType = 'BRAND';
        itemId = opportunity.properties.product.brandCode;
      } else {
        itemType = 'SKU_PACKAGE';
        itemId = opportunity.properties.product.id;
      }

      var payload = {
        'store': opportunity.properties.store.id,
        'itemId': itemId,
        'itemType': itemType,
        'mixedBrand': isMixedType,
        'rationale': rationale,
        'impact': opportunity.properties.impact.enum,
        'subType': oppSubType
      };
      opportunitiesService
        .createOpportunity(payload)
        .then(function(success, error) {
          if (targetList) {
            addToTargetList(targetList, success);
          }
          if ($state.current.name === 'opportunities') {
            chipsService.applyFilters();
          }
          toastService.showToast('added');
          vm.newOpportunity = vm.newOpportunityTemplate;
          resetFormModels();
        }, function(error) {
          console.log(error);
          vm.duplicateOpportunity = opportunity;
          vm.duplicateOpportunity.properties.rationale.description = rationale;
          modalCustomOpportunityError(error);
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
    function closeModal(deleteFeedback) {
      if (deleteFeedback) opportunitiesService.deleteOpportunityFeedback(vm.oppID);
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
      var dateAfter = moment().subtract(30, 'days').format('YYYY-MM-DD');
      userService
      .getNotifications(userService.model.currentUser.employeeID, dateAfter)
      .then(function(result) {
        vm.notifications = result;
        setUnreadCount(vm.notifications);
      });

      versionService.getVersion().then(function(data) {
        versionService.model.version = data;
      });
    };

    function resetFormModels() {
      vm.newOpportunity.properties.distributionType ? vm.newOpportunity.properties.distributionType.type = 'new' : angular.noop;
      vm.newOpportunity.properties.rationale ? vm.newOpportunity.properties.rationale = {'description': '', 'other': ''} : angular.noop;
      vm.newOpportunity.properties.impact ? vm.newOpportunity.properties.impact.enum = '' : angular.noop;
      vm.newOpportunity.properties.targetList ? vm.newOpportunity.properties.targetList = '' : angular.noop;
      vm.addNewRationale = false;
    }

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
