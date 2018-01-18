'use strict';

module.exports = /*  @ngInject */
  function navbarController($rootScope, $scope, $state, $transitions, $window, $mdPanel, $mdDialog, $mdMenu, $mdSelect, $anchorScroll, $location, analyticsService, notificationsService, opportunitiesService, targetListService, userService, versionService, loaderService, ieHackService, toastService, filtersService, chipsService, notesService, moment, ENV_VARS) {

    // ****************
    // CONTROLLER SETUP
    // ****************

    // Initial variables
    var vm = this;
    vm.linkToIQ = ENV_VARS.iqURL;

    // User Agent Detection for IE fixes
    $rootScope.isIE = ieHackService.isIE;
    $rootScope.isEdge = ieHackService.isEdge;

    // Reset any active loaders and scroll position on state change
    $transitions.onStart({}, function() {
      loaderService.closeLoader();
      $anchorScroll();
    });

    // fixes hanging selects in menu
    $rootScope.$on('$mdMenuClose', function() {
      $mdSelect.hide();
    });

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
    vm.unDismissOpportunity = unDismissOpportunity;
    vm.getTargetLists = getTargetLists;
    vm.notificationClicked = notificationClicked;
    vm.markSeen = markSeen;
    vm.modalAddOpportunityForm = modalAddOpportunityForm;
    vm.modalCustomOpportunityError = modalCustomOpportunityError;
    vm.addDuplicateOpportunityId = addDuplicateOpportunityId;
    vm.showImpact = showImpact;
    vm.showNewRationaleInput = showNewRationaleInput;
    vm.goToNote = goToNote;
    vm.sendFeedback = sendFeedback;
    vm.openIQLink = openIQLink;
    vm.onTeamPerformancePage = onTeamPerformancePage;
    vm.onAccountDashboardPage = onAccountDashboardPage;
    vm.onMyScorecardsPage = onMyScorecardsPage;

    $scope.$watch(function() { return toastService.model; }, function(newVal) {
      vm.archived = newVal.archived;
      vm.deleted = newVal.deleted;
      vm.added = newVal.added;
      vm.copied = newVal.copied;
      vm.deleteError = newVal.deleteError;
      vm.multipleTargetListsSelected = newVal.multipleTargetListsSelected;
      vm.performanceDataError = newVal.performanceDataError;
    }, true);

    init();

    // **************
    // PUBLIC METHODS
    // **************

    // Mark notification as read on click
    function notificationClicked(notification) {
      vm.notificationsService
        .markNotifications([{
          id: notification.id,
          status: vm.notificationsService.status.READ
        }])
        .then(function() {
          notification.status = vm.notificationsService.status.READ;
          if (vm.notificationHelper) {
            vm.notificationHelper.showBadge = false;
            vm.notificationHelper.unseenNotifications = 0;
          }
        });

      if (notification.objectType.toUpperCase() === 'TARGET_LIST') {
        $state.go('target-list-detail', ({id: notification.shortenedObject.id}));
      } else if (notification.objectType.toUpperCase() === 'OPPORTUNITY') {
        opportunitiesService.model.filterApplied = false;
        $state.go('opportunities', {'resetFiltersOnLoad': false, 'opportunityID': notification.shortenedObject.id}, {reload: true});
      } else if (notification.objectType.toUpperCase() === 'ACCOUNT') {
        $state.go('accounts');
      } else if (notification.objectType.toUpperCase() === 'STORE' ||
                 notification.objectType.toUpperCase() === 'DISTRIBUTOR') {
        goToNote(notification);
      }

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
          if (vm.notificationHelper) {
            vm.notificationHelper.showBadge = false;
            vm.notificationHelper.unseenNotifications = 0;
          }
        });
    }

    // "Add Opportunity" modal
    function modalAddOpportunityForm(restoreCache) {
      $mdDialog.show({
        clickOutsideToClose: false,
        scope: $scope.$new(),
        template: require('./modal-add-opportunity-form.pug')
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
        template: require('./modal-custom-opportunity-error.pug')
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
              vm.duplicateOpportunityId = key.objectIdentifier;
            }
          }
        });
      } else {
        vm.generalError = true;
      }
    }

    function addDuplicateOpportunityId(id) {
      if (!id) {
        vm.cachedTargetList = '';
        vm.currentOpportunityId = '';
        closeModal();
      } else {
        var existingOpportunityArr = [];
        existingOpportunityArr.push(id);

        targetListService.addTargetListOpportunities(vm.cachedTargetList, existingOpportunityArr).then(function(success) {
          vm.cachedTargetList = '';
          vm.currentOpportunityId = '';
          toastService.showToast('copied', existingOpportunityArr);
          closeModal();
        }, function(error) {
          if (!vm.cachedTargetList || error.data[0].description === 'TLOPP101') {
            vm.cachedTargetList = '';
            vm.currentOpportunityId = '';
            closeModal();
          }
        });
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
      opportunitiesService.getFormattedSingleOpportunity(oppID)
      .then(function(response) {
        var isoDate = new Date(response.dateUpdated).toISOString();
        vm.dateUpdated = moment(isoDate).format('M/D/YYYY');
      });
    }

    function unDismissOpportunity(id) {
      opportunitiesService.deleteOpportunityFeedback(id).then(function(data) {
        addDuplicateOpportunityId(vm.duplicateId);
        closeModal();
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
          model.splice(value, 1);
          model.unshift(tempModel);
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

    // this is a private function
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
        .then(function(success) {
          if (targetList) {
            addToTargetList(targetList, success);
          }
          if ($state.current.name === 'opportunities') {
            $state.go('opportunities', (success.id, opportunitiesService.model.filterApplied = false, opportunitiesService.model.opportunities = []), {reload: true});
          }
          toastService.showToast('added');
          vm.newOpportunity = vm.newOpportunityTemplate;
          resetFormModels();
          if (success.id) {
            sendAddOpportunityAnalyticsEvent(success.id);
          }
        }, function(error) {
          console.log(error);
          vm.duplicateOpportunity = opportunity;
          vm.duplicateOpportunity.properties.rationale.description = rationale;
          vm.cachedTargetList = targetList;
          vm.duplicateId = error.data[0].objectIdentifier;
          modalCustomOpportunityError(error);
        });

      return true;
    }

    function sendAddOpportunityAnalyticsEvent(opportunityId) {
      analyticsService.trackEvent(
        'Opportunities',
        'Add Opportunity',
        opportunityId
      );
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
      vm.newOpportunity.properties.distributionType.description = '';
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

    function goToNote(notification) {
      var accountNote = {
        'id': [],
        'name': '',
        'noteId': ''
      };

      accountNote.id.push(notification.objectId);
      accountNote.name = notification.shortenedObject.name ? notification.shortenedObject.name : notification.shortenedObject.store_name;
      accountNote.type = notification.objectType;
      accountNote.noteId = notification.salesforceUserNoteID;

      notesService.model.currentStoreName = accountNote.name;

      $state.go('accounts', {
        resetFiltersOnLoad: false,
        applyFiltersOnLoad: true,
        openNotesOnLoad: true,
        pageData: {
          account: accountNote
        },
        storeId: notification.shortenedObject.tdlinx_number
      });
    }

    // cannot test this because it's causing phantom.js to reliably crash
    function sendFeedback() {
      var newline = '%0D%0A',
        emailString = 'mailto:compassbeersfeedback@cbrands.com';

      emailString += '?subject=Compass Portal Feedback';
      emailString += '&body=';
      emailString += 'Feedback%3A ' + newline + newline + newline;
      emailString += 'Compass Web Version%3A ' + versionService.model.version.hash + ' %2D ' + versionService.model.version.version + newline;
      emailString += 'URL%3A ' + window.encodeURIComponent($location.absUrl()) + newline;
      emailString += 'User Email%3A ' + window.encodeURIComponent(userService.model.currentUser.email) + newline + newline;

      $window.location = emailString;
    }

    function onTeamPerformancePage() {
      return $state.current.name === 'team-performance';
    }

    function onAccountDashboardPage() {
      return $state.current.name === 'accounts';
    }

    function onMyScorecardsPage() {
      return $state.current.name === 'scorecards';
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

    function openIQLink() {
      $window.open(vm.linkToIQ, '_blank');
    }

  };
