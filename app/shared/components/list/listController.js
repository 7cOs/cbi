'use strict';

module.exports = /*  @ngInject */
  function listController($scope, $state, $q, $location, $anchorScroll, $mdDialog, $timeout, filtersService, loaderService, opportunitiesService, targetListService, storesService, userService, closedOpportunitiesService) {

    // ****************
    // CONTROLLER SETUP
    // ****************

    // Initial variables
    var vm = this;

    // Services
    vm.opportunitiesService = opportunitiesService;
    vm.userService = userService;
    vm.filtersService = filtersService;

    // Defaults
    vm.currentOpportunityId = '';
    vm.depletionsChevron = false;
    vm.expandedOpportunities = 0;
    vm.opportunitiesChevron = false;
    vm.reverse = false;
    vm.segmentationChevron = false;
    vm.selected = [];
    vm.sharedCollaborators = [];
    vm.stores = [];
    // sortProperty is set to default sort on page load
    // vm.sortProperty = 'store.name';
    vm.storeChevron = true;
    vm.showSubMenu = false;
    vm.disabledMessage = '';
    vm.opportunityShared = false;
    vm.shareOpportunityFail = false;
    vm.opportunityDismissTrigger = false;
    vm.undoClicked = false;
    vm.isSelectAllActivated = false;

    // Expose public methods
    vm.addToSharedCollaborators = addToSharedCollaborators;
    vm.addToTargetList = addToTargetList;
    vm.closeModal = closeModal;
    vm.displayBrandIcon = displayBrandIcon;
    vm.exists = exists;
    vm.isChecked = isChecked;
    vm.openShareModal = openShareModal;
    vm.openDismissModal = openDismissModal;
    vm.pageName = pageName;
    vm.removeOpportunity = removeOpportunity;
    vm.shareOpportunity = shareOpportunity;
    vm.sortBy = sortBy;
    vm.selectOpportunity = selectOpportunity;
    vm.showCorporateMemoModal = showCorporateMemoModal;
    vm.submitFeedback = submitFeedback;
    vm.cancelFeedback = cancelFeedback;
    vm.allOpportunitiesExpanded = allOpportunitiesExpanded;
    vm.noOpportunitiesExpanded = noOpportunitiesExpanded;
    vm.showDisabled = showDisabled;
    vm.flattenOpportunity = flattenOpportunity;
    vm.getTargetLists = getTargetLists;
    vm.expandCallback = expandCallback;
    vm.collapseCallback = collapseCallback;
    vm.getDate = getDate;
    vm.toggleOpportunitiesInStores = toggleOpportunitiesInStores;
    vm.toggleSelectAllStores = toggleSelectAllStores;
    vm.removeSharedCollaborator = removeSharedCollaborator;
    vm.impactSort = impactSort;

    // Mock Data for memo modal
    vm.limitedTime = {
      title: 'Limited Time Only',
      startDate: '07/09/16',
      endDate: '08/31/16',
      resetStart: 'None',
      resetEnd: 'None',
      price: 12.99,
      onMenu: 'Yes',
      notes: 'A Home brew from a miller light starts reminiscing about a lost buzz, because a childlike bottle learns a hard lesson from a Sierra Nevada Pale Ale. When you see some Sam Adams for a spudgun, it means that a bill behind the Hops Alligator Ale daydreams. The Long Trail Ale around a broken bottle seeks an Amarillo Pale Ale over a sake bomb.',
      mandateIcon: 'featured'
    };

    // Custom Headers for CSV export
    vm.csvHeader = [
      'Distributor',
      'TDLinx',
      'Store Name',
      'Address',
      'City',
      'ZIP',
      'Current YTD Store Volume',
      'Last YTD Store Volume',
      'Volume Trend for Store CYTD vs CYTD Last Year',
      'Segmentation',
      'Opportunity Type',
      'Product',
      'Item Authorization',
      'Chain Mandate',
      'On Feature',
      'Opportunity Rationale',
      'Opportunity Status',
      'Opportunity Predicted Impact'
    ];

    init();

    // **************
    // PUBLIC METHODS
    // **************
    //
    $scope.$on('$mdMenuClose', function() {
      vm.showSubMenu = false;
    });

    /**
     * Add a person to a list of collaboraters
     * @param {object} person The person who needs to be added to the list of collaborators
     */
    function addToSharedCollaborators(person) {
      if (!vm.sharedCollaborators.length) {
        vm.sharedCollaborators.push(person);
      } else {
        var matchedPerson = checkIfPersonIsAddedToCollaborators(person);
        if (!matchedPerson) {
          vm.sharedCollaborators.push(person);
        }
      }
    }

    /**
     * Check if a person already exists amongst a list of collaboraters
     * @param {object} person The person who needs to be added to the list of collaborators
     * @returns {object} matchedPerson Returns the matchedPerson if the object exists or returns null
     */
    function checkIfPersonIsAddedToCollaborators(person) {
      var matchedPerson = null;
      vm.sharedCollaborators.forEach(function(collab, key) {
        if (!matchedPerson && person.employeeId === collab.employeeId) {
          matchedPerson = {
            'obj': collab,
            'key': key
          };
        }
      });
      return matchedPerson;
    }

    /**
     * Remove a person from a list of collaboraters if the object exists
     * @param {object} person The person who needs to be added to the list of collaborators
     */
    function removeSharedCollaborator(person) {
      var matchedPerson = checkIfPersonIsAddedToCollaborators(person);
      if (matchedPerson) {
        vm.sharedCollaborators.splice(matchedPerson.key, 1);
      }
    }

    function getDate() {
      return new Date();
    }

    // TODO Update view and model and show success or error message
    /**
     * This function adds the selected opportunities to target list
     * @param {string} listId Guid of the target list
     */
    function addToTargetList(listId) {
      if (listId && vm.selected.length > 0) {
        var opportunityIds = [];
        for (var i = 0; i < vm.selected.length; i++) {
          opportunityIds.push(vm.selected[i].id);
        }
        targetListService.addTargetListOpportunities(listId, opportunityIds).then(function(data) {
          return data;
        }, function(err) {
          console.log('Error adding these ids: ', opportunityIds, ' Responded with error: ', err);
          return err;
        });
      }
    }

    function closeModal() {
      $mdDialog.hide();
    }

    function displayBrandIcon(haystack, needle) {
      return haystack.indexOf(needle) !== -1;
    }

    // Check if list item exists and is selected
    function exists(item, list) {
      return list.indexOf(item) > -1;
    }

    // Check if all items are selected
    function isChecked() {
      return vm.selected.length === opportunitiesService.model.opportunities.length;
    }

    function openShareModal(oId, ev) {
      vm.currentOpportunityId = oId;
      vm.sharedCollaborators = [];
      vm.opportunityShared = false;
      vm.shareOpportunityFail = false;

      var parentEl = angular.element(document.body);
      $mdDialog.show({
        clickOutsideToClose: true,
        parent: parentEl,
        scope: $scope.$new(),
        targetEvent: ev,
        templateUrl: './app/shared/components/list/modal-share-opportunity.html'
      });
    }

    function shareOpportunity() {
      if (vm.sharedCollaborators.length > 0) {
        for (var i = 0; i < vm.sharedCollaborators.length; i++) {
          userService.sendOpportunity(vm.sharedCollaborators[i].employeeId, vm.currentOpportunityId).then(function(data) {
            vm.opportunityShared = true;
            console.log('shared');
          });
        }
      } else {
        vm.opportunityShared = false;
        vm.shareOpportunityFail = true;
      }
      closeModal();
    }

    function openDismissModal(oId, ev) {
      vm.currentOpportunityId = oId;
      vm.opportunityShared = false;
      vm.shareOpportunityFail = false;
      vm.opportunityDismissTrigger = false;
      vm.undoClicked = false;

      // actionOverlay(opportunity, action);
      var parentEl = angular.element(document.body);
      $mdDialog.show({
        clickOutsideToClose: true,
        parent: parentEl,
        scope: $scope.$new(),
        targetEvent: ev,
        templateUrl: './app/shared/components/list/modal-dismiss-opportunity.html'
      });
    }

    function submitFeedback(opportunity, data) {
      dismissOpportunity(opportunity, data);
      vm.opportunityDismissTrigger = true;
      $mdDialog.hide();
    }

    function cancelFeedback(opportunity) {
      closeModal();
    }

    // arr of pages to be hidden on
    function pageName(arr) {
      arr = arr || [];
      for (var i = 0; i < arr.length; i++) {
        if ($state.current.name === arr[i]) return false;
      }

      return true;
    }

    function removeOpportunity() {
      var opportunityIds = [];

      // add opportunity ids into array to be posted
      for (var i = 0; i < vm.selected.length; i++) {
        for (var j = 0; j < vm.selected[i].groupedOpportunities.length; j++) {
          opportunityIds.push(vm.selected[i].groupedOpportunities[j].id);
        }
      }

      targetListService.deleteTargetListOpportunities(targetListService.model.currentList.id, opportunityIds).then(function(data) {
        console.log('Done deleting these ids: ', opportunityIds);
        // to do - update view and model
      }, function(err) {
        console.log('Error deleting these ids: ', opportunityIds, ' Responded with error: ', err);
      });
    }

    function showCorporateMemoModal(ev) {
      var parentEl = angular.element(document.body);
      $mdDialog.show({
        clickOutsideToClose: true,
        parent: parentEl,
        scope: $scope.$new(),
        targetEvent: ev,
        templateUrl: './app/shared/components/list/modal-corporate-memo.html'
      });
    }

    // Sort by selected property
    function sortBy(name) {
      filtersService.addSortFilter(name);

      loaderService.openLoader(true);
      opportunitiesService.getOpportunities().then(function(data) {
        loaderService.closeLoader();
      });
    }

    // Select or deselect individual list item
    function selectOpportunity(event, parent, item, list) {
      var idx = list.indexOf(item),
          groupedCount = 0;

      if (idx > -1) {
        removeItem(item, list, idx);
      } else {
        addItem(item, list);
      }
      event.stopPropagation();

      // Get selected opportunity count
      for (var key in parent.groupedOpportunities) {
        var obj = parent.groupedOpportunities[key];
        if (obj.selected === true) { groupedCount++; }
      }
      parent.selectedOpportunities = groupedCount;
      getTargetLists();
    }

    function expandCallback(item) {
      vm.expandedOpportunities++;
    }

    function collapseCallback(item) {
      vm.expandedOpportunities--;
    }

    function allOpportunitiesExpanded() {
      return vm.expandedOpportunities === opportunitiesService.model.opportunities.length;
    }

    function noOpportunitiesExpanded() {
      return vm.expandedOpportunities === 0;
    }

    function showDisabled(message) {
      vm.disabledMessage = message;
    }

    function flattenOpportunity(obj) {
      var data = [];

      angular.forEach(obj, function(value, key) {
        var item = {};
        angular.copy(value, item);
        item.storeDistributor = item.store.distributors[0];
        item.TDLinx = item.product.id;
        item.storeName = item.store.name;
        item.storeAddress = item.store.streetAddress;
        item.storeCity = item.store.city;
        item.storeZip = item.store.zip;
        item.storeDepletionsCTD = item.store.depletionsCurrentYearToDate;
        item.storeDepletionsCTDYA = item.store.depletionsCurrentYearToDateYA;
        item.storeDepletionsCTDYAPercent = item.store.depletionsCurrentYearToDateYAPercent;
        item.storeSegmentation = item.store.segmentation;
        item.opportunityType = item.type;
        item.productName = item.product.name;
        item.itemAuthorization = item.isItemAuthorization;
        item.chainMandate = item.isChainMandate;
        item.onFeature = item.isOnFeature;
        item.opportunityRationale = item.rationale;
        item.opportunityStatus = item.status;
        item.impactPredicted = item.impactDescription;

        delete item.id;
        delete item.type;
        delete item.subType;
        delete item.impact;
        delete item.impactDescription;
        delete item.status;
        delete item.rationale;
        delete item.dismissed;
        delete item.selected;
        delete item.isItemAuthorization;
        delete item.isChainMandate;
        delete item.itemAuthorizationCode;
        delete item.itemAuthorizationDesc;
        delete item.depletionsCurrentYearToDate;
        delete item.depletionsCurrentYearToDateYA;
        delete item.lastDepletionDate;
        delete item.depletionsCurrentYearToDateYAPercent;
        delete item.depletionsCurrentYearToDateYAPercentNegative;
        delete item.isOnFeature;
        delete item.featureTypeCode;
        delete item.featureTypeDesc;
        delete item.priorityPackageFlag;
        delete item.brands;
        delete item.groupedOpportunities;
        delete item.product;
        delete item.store;

        data.push(item);
      });
      console.log(data);

      return data;
    }

    /**
     * Initializes the target lists for the user
     */
    function getTargetLists() {
      if (!userService.model.targetLists || userService.model.targetLists.owned.length < 1) {
        userService.getTargetLists(userService.model.currentUser.employeeID).then(function(data) {
          userService.model.targetLists = data;
        });
      }
    }

    /**
     * Toggles selection of all opportunites in the store and the store itself
     */
    function toggleSelectAllStores () {
      angular.forEach(opportunitiesService.model.opportunities, function(store, key) {
        if (vm.isSelectAllActivated) {
          deselectAllOpportunitiesInStore(store, vm.selected);
        } else {
          selectAllOpportunitiesInStore(store, vm.selected);
        }
      });

      if (vm.isSelectAllActivated) {
        vm.selected = [];
      }
      vm.isSelectAllActivated = !vm.isSelectAllActivated;
    }

    /**
     * Toggles selection of all opportunites in the store and the store itself
     * @param {object} store Store that needs to be toggled
     * @param {Array} currentSelectionList Array of all currently selected items
     */
    function toggleOpportunitiesInStores (store, currentSelectionList) {
      vm.isSelectAllActivated = false;
      if (store.selectedOpportunities === store.groupedOpportunities.length) {
        deselectAllOpportunitiesInStore(store, currentSelectionList);
      } else {
        selectAllOpportunitiesInStore(store, currentSelectionList);
      }
    }

    /**
     * Selects all opportunities in a store passed to this function
     * @param {object} store Store that needs to be toggled
     * @param {Array} currentSelectionList Array of all currently selected items
     */
    function selectAllOpportunitiesInStore(store, currentSelectionList) {
      for (var key in store.groupedOpportunities) {
        var opportunity = store.groupedOpportunities[key];
        addItem(opportunity, currentSelectionList);
      }
      store.selectedOpportunities = store.groupedOpportunities.length;
    }

    /**
     * Deselects all opportunities in a store passed to this function
     * @param {object} store Store that needs to be toggled
     * @param {Array} currentSelectionList Array of all currently selected items
     */
    function deselectAllOpportunitiesInStore(store, currentSelectionList) {
      for (var key in store.groupedOpportunities) {
        var opportunity = store.groupedOpportunities[key],
            idx = currentSelectionList.indexOf(opportunity);
        removeItem(opportunity, currentSelectionList, idx);
      }
      store.selectedOpportunities = 0;
    }

    // ***************
    // PRIVATE METHODS
    // ***************

    $scope.$on('$mdMenuClose', function() {
      vm.showSubMenu = false;
    });

    $scope.$watch('list.expandedOpportunities', function() {
      vm.disabledMessage = '';
    });

    $scope.$watch('list.opportunitiesService.model.opportunities', function() {
      vm.selected = [];
      vm.isSelectAllActivated = false;
      vm.disabledMessage = '';
    });

    /**
     * Check if opprtunity is in the opportunities selection array
     * @param {object} opportunity Opportunity object
     * @param {Array} currentSelectionList Array of all currently selected items
     * @returns {Boolean}
     */
    function isItemInList(opportunity, currentSelectionList) {
      return currentSelectionList.indexOf(opportunity) !== -1;
    }

    function removeItem(item, list, idx) {
      if (isItemInList(item, list)) {
        item.selected = false;
        list.splice(idx, 1);
      }
    }

    function addItem(item, list) {
      if (!isItemInList(item, list)) {
        item.selected = true;
        list.push(item);
      }
    }

    function dismissOpportunity(oId, payload) {
      vm.opportunityDismissTrigger = true;

      $timeout(function() {
        if (!vm.undoClicked) {
          opportunitiesService.createOpportunityFeedback(oId, payload).then(function() {
            vm.opportunitiesService.model.opportunities.forEach(function(store, key) {
              var storeGroup = store.groupedOpportunities;
              storeGroup.forEach(function(opportunity, key) {
                if (opportunity.id === oId) {
                  storeGroup.splice(key, 1);
                }
              });
              if (storeGroup.length < 1) {
                vm.opportunitiesService.model.opportunities.splice(key, 1);
                vm.filtersService.model.appliedFilter.pagination.totalStores -= 1;
              }
            });
          });
        }
        vm.opportunityDismissTrigger = false;
        vm.filtersService.model.appliedFilter.pagination.totalOpportunities -= 1;
      }, 4000);
    }

    function impactSort (item) {
      var result;
      switch (item.impact) {
        case 'H':
          result = 0;
          break;
        case 'M':
          result = 1;
          break;
        case 'L':
          result = 2;
          break;
      }
      return result;
    }

    function init() {
      // Initialize the target lists for the user Id
      getTargetLists();
    }
  };
