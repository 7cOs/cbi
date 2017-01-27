'use strict';

module.exports = /*  @ngInject */
  function listController($scope, $state, $q, $location, $anchorScroll, $mdDialog, $timeout, $analytics, filtersService, loaderService, opportunitiesService, targetListService, storesService, userService, closedOpportunitiesService, ieHackService, toastService) {

    // ****************
    // CONTROLLER SETUP
    // ****************

    // Initial variables
    var vm = this;

    // Services
    vm.opportunitiesService = opportunitiesService;
    vm.userService = userService;
    vm.filtersService = filtersService;
    vm.targetListService = targetListService;

    // Defaults
    vm.ascending = true;
    vm.currentOpportunityId = '';
    vm.depletionsChevron = false;
    vm.disabledMessage = '';
    vm.expandedOpportunities = 0;
    vm.isSelectAllActivated = false;
    vm.memoData = {};
    vm.memoError = false;
    vm.memoType = '';
    vm.newList = {
      name: '',
      description: '',
      opportunities: [],
      collaborators: [],
      targetListShares: [],
      collaborateAndInvite: false
    };
    vm.opportunitiesChevron = false;
    vm.opportunityDismissTrigger = false;
    vm.opportunityShared = false;
    vm.orderName = [];
    vm.reverse = false;
    vm.segmentationChevron = false;
    vm.selected = [];
    vm.sharedCollaborators = [];
    vm.shareOpportunityFail = false;
    vm.showSubMenu = false;
    vm.storeChevron = true;
    vm.stores = [];
    vm.undoClicked = false;

    // Expose public methods
    vm.addCollaborator = addCollaborator;
    vm.addToSharedCollaborators = addToSharedCollaborators;
    vm.addToTargetList = addToTargetList;
    vm.allOpportunitiesExpanded = allOpportunitiesExpanded;
    vm.closeCreateTargetListModal = closeCreateTargetListModal;
    vm.closeModal = closeModal;
    vm.closeOrDismissOpportunity = closeOrDismissOpportunity;
    vm.collapseCallback = collapseCallback;
    vm.createNewList = createNewList;
    vm.depletionsVsYaPercent = depletionsVsYaPercent;
    vm.displayBrandIcon = displayBrandIcon;
    vm.expandCallback = expandCallback;
    vm.flattenOpportunity = flattenOpportunity;
    vm.getDate = getDate;
    vm.getMemos = getMemos;
    vm.getTargetLists = getTargetLists;
    vm.impactSort = impactSort;
    vm.noOpportunitiesExpanded = noOpportunitiesExpanded;
    vm.openDismissModal = openDismissModal;
    vm.openShareModal = openShareModal;
    vm.opportunityTypeOrSubtype = opportunityTypeOrSubtype;
    vm.pageName = pageName;
    vm.pickMemo = pickMemo;
    vm.removeOpportunity = removeOpportunity;
    vm.removeSharedCollaborator = removeSharedCollaborator;
    vm.saveNewList = saveNewList;
    vm.selectOpportunity = selectOpportunity;
    vm.shareOpportunity = shareOpportunity;
    vm.showDisabled = showDisabled;
    vm.showItemAuthorizationFlag = showItemAuthorizationFlag;
    vm.showOpportunityMemoModal = showOpportunityMemoModal;
    vm.sortBy = sortBy;
    vm.submitFeedback = submitFeedback;
    vm.toggleOpportunitiesInStores = toggleOpportunitiesInStores;
    vm.toggleSelectAllStores = toggleSelectAllStores;
    vm.updateOpportunityModel = updateOpportunityModel;
    vm.vsYAGrowthPercent = vsYAGrowthPercent;
    vm.getStoreToBePassedToAcct = getStoreToBePassedToAcct;
    vm.checkIfLinkDisabled = checkIfLinkDisabled;

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
      'Opportunity Status',
      'Opportunity Predicted Impact'
    ];
    vm.csvHeaderRationale = csvHeaderRationale();

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
      ieHackService.forceRepaint();
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
          toastService.showToast('copied', opportunityIds);

          // for each selected item
          for (i = 0; i < vm.selected.length; i++) {
            var breaking = false;

            if (vm.selected[i].status !== 'TARGETED') {
              // find opporuntities that were changed
              for (var j = 0; j < opportunitiesService.model.opportunities.length; j++) {
                for (var k = 0; k < opportunitiesService.model.opportunities[j].groupedOpportunities.length; k++) {
                  if (opportunitiesService.model.opportunities[j].groupedOpportunities[k].id === vm.selected[i].id) {
                    if (opportunitiesService.model.opportunities[j].groupedOpportunities[k].impact === 'H') {
                      opportunitiesService.model.opportunities[j].store.highImpactOpportunityCount--;
                    }

                    // remove from opportunities model if open is selected, otherwise just change status
                    if (filtersService.model.opportunityStatusOpen && filtersService.model.opportunityStatusOpen === true) {
                      opportunitiesService.model.opportunities[j].groupedOpportunities.splice(k, 1);
                      filtersService.model.appliedFilter.pagination.totalOpportunities--;
                    } else {
                      opportunitiesService.model.opportunities[j].groupedOpportunities[k].status = 'TARGETED';
                    }

                    if (opportunitiesService.model.opportunities[j].groupedOpportunities.length === 0) {
                      opportunitiesService.model.opportunities.splice(j, 1);
                      filtersService.model.appliedFilter.pagination.totalStores--;
                    }

                    // break loop after needle is found to save on performance
                    breaking = true;
                    break;
                  }
                }
                if (breaking) break;
              }
            }
          }
          // reset selected
          vm.selected = [];
          vm.isSelectAllActivated = true;
          vm.toggleSelectAllStores();
          vm.selected = [];
        }, function(err) {
          console.log('Error adding these ids: ', opportunityIds, ' Responded with error: ', err);
        });
      }
    }

    function createNewList(e) {
      var parentEl = angular.element(document.body);
      $mdDialog.show({
        clickOutsideToClose: false,
        parent: parentEl,
        scope: $scope.$new(),
        targetEvent: e,
        templateUrl: './app/shared/components/list/create-target-list-modal.html'
      });
    }

    function closeCreateTargetListModal() {
      vm.newList = {
        name: '',
        description: '',
        opportunities: [],
        collaborators: []
      };
      $mdDialog.hide();
    }

    function saveNewList(e) {
      vm.buttonDisabled = true;

      // Create target list
      userService.addTargetList(vm.newList).then(function(response) {
        $analytics.eventTrack('Add to Target List', {category: vm.analyticsCategory, label: response.id});
        vm.addToTargetList(response.id);
        vm.closeModal();
        vm.buttonDisabled = false;

        return targetListService.addTargetListShares(response.id, vm.newList.targetListShares);
      })
      .then(function(addCollaboratorResponse) {
        userService.model.targetLists.owned[0].collaborators = addCollaboratorResponse.data;

        vm.newList = {
          name: '',
          description: '',
          opportunities: [],
          collaborators: [],
          targetListShares: [],
          collaborateAndInvite: false
        };
      });
    }

    function addCollaborator(e) {
      vm.newList.collaborators.push(e);
      var share = {
        employeeId: e.employeeId
      };
      vm.newList.targetListShares.push(share);
    }

    function closeModal() {
      $mdDialog.hide();
    }

    function displayBrandIcon(haystack, needle) {
      return haystack.indexOf(needle) !== -1;
    }

    // Check if all items are selected
    /* not useful when you can uncheck alt j
    function isChecked() {
      return vm.selected.length === opportunitiesService.model.opportunities.length;
    }
    */

    function openShareModal(oId, ev) {
      vm.currentOpportunityId = oId;
      vm.sharedCollaborators = [];
      vm.opportunityShared = false;
      vm.shareOpportunityFail = false;

      var parentEl = angular.element(document.body);
      $mdDialog.show({
        clickOutsideToClose: false,
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
        clickOutsideToClose: false,
        parent: parentEl,
        scope: $scope.$new(),
        targetEvent: ev,
        templateUrl: './app/shared/components/list/modal-dismiss-opportunity.html'
      });
    }

    function closeOrDismissOpportunity(oId, payload, dismiss) {
      vm.opportunityDismissTrigger = true;
      vm.currentOpportunityId = oId;

      $timeout(function() {
        if (!vm.undoClicked) {
          (dismiss
            ? opportunitiesService.createOpportunityFeedback(oId, payload)
            : closedOpportunitiesService.closeOpportunity(oId))
          .then(function() {
            vm.opportunitiesService.model.opportunities.forEach(function(store, key) {
              var storeGroup = store.groupedOpportunities;
              storeGroup.forEach(function(opportunity, key) {
                if (opportunity.id === oId && dismiss) {
                  storeGroup.splice(key, 1);
                } else if (opportunity.id === oId && !dismiss) {
                  opportunity.status = 'CLOSED';
                }
              });
              if (storeGroup.length < 1) {
                vm.opportunitiesService.model.opportunities.splice(key, 1);
                vm.filtersService.model.appliedFilter.pagination.roundedStores -= 1;
              }
            });
          });
        }
        vm.opportunityDismissTrigger = false;
        vm.currentOpportunityId = '';
        vm.filtersService.model.appliedFilter.pagination.totalOpportunities -= 1;
      }, 4000);
    }

    function submitFeedback(opportunity, data) {

      if (data.type === 'other' && !data.feedback) {
        data.feedback = 'other';
      }
      vm.closeOrDismissOpportunity(opportunity, data, true);
      vm.opportunityDismissTrigger = true;
      vm.opportunity.feedback = '';
      $mdDialog.hide();
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
        opportunityIds.push(vm.selected[i].id);
      }

      targetListService.deleteTargetListOpportunities(targetListService.model.currentList.id, opportunityIds).then(function(data) {
        console.log('Done deleting these ids: ', opportunityIds);
        updateOpportunityModel(opportunitiesService.model.opportunities, vm.selected);
      }, function(err) {
        console.log('Error deleting these ids: ', opportunityIds, ' Responded with error: ', err);
      });
    }

    function updateOpportunityModel(opportunities, selected) {
      var opps  = opportunities,
          selectedArr = selected;

      for (var i = 0; i < selectedArr.length; i++) {
        for (var j = 0; j < opps.length; j++) {
          for (var k = 0; k < opps[j].groupedOpportunities.length; k++) {
            var oppId = opps[j].groupedOpportunities[k].id;

            if (selectedArr[i].id === oppId) {
              opps[j].groupedOpportunities.splice(k, 1);
              opps[j].brands.splice(k, 1);
              filtersService.model.appliedFilter.pagination.totalOpportunities--;
              break;
            }
          }

          if (!opps[j].groupedOpportunities.length) {
            opps.splice(j, 1);
            filtersService.model.appliedFilter.pagination.roundedStores--;
          }
        }
      }
      vm.selected = [];
      selectedArr = [];
    }

    function showItemAuthorizationFlag(authCode, depletions) {
      if (authCode === 'CM' || authCode === 'SP') {
        return true;
      } else if (authCode === 'BM' && depletions <= 0) {
        return true;
      } else {
        return false;
      }
    }

    function showOpportunityMemoModal(ev) {
      vm.memoData = {};
      var parentEl = angular.element(document.body);
      $mdDialog.show({
        clickOutsideToClose: false,
        parent: parentEl,
        scope: $scope.$new(),
        targetEvent: ev,
        templateUrl: './app/shared/components/list/modal-opportunity-memo.html'
      });
    }

    // Make call to applicable API endpoint for memo information per product
    // trigger population of memo with response data
    function getMemos(storeId, productId, type) {
      vm.memoType = '';
      if (type === 'Item Authorization') {
        storesService.getItemAuthorizations(storeId).then(populateMemo);
        vm.memoType = type;
      } else {
        storesService.getFeatures(storeId).then(populateMemo);
        vm.memoType = type;
      }

      function populateMemo(response) {
        if (response.length === 0) {
          vm.memoError = true;
        } else {
          vm.memoError = false;
          pickMemo(response, productId);
        }
      }
    }

    // Choose single memo from response/memo array based on most recent startDate
    function pickMemo(memos, productId) {
      var products = [];
      memos.forEach(function(value, key) {
        if (value.packageID === productId) {
          products.push(value);
        }
      });

      if (products[0] && products[0].setPeriodStartDate !== undefined) {
        products.sort(function(a, b) {
          var setDateA = toDate(a.setPeriodStartDate);
          var setDateB = toDate(b.setPeriodStartDate);
          return setDateB - setDateA;
        });
        vm.memoData = products[0];
      } else if (products[0] && products[0].featurePeriodStartDate !== undefined) {
        products.sort(function(a, b) {
          var featDateA = toDate(a.featurePeriodStartDate);
          var featDateB = toDate(b.featurePeriodStartDate);
          return featDateB - featDateA;
        });
        vm.memoData = products[0];
      } else {
        vm.memoError = true;
      }

      function toDate(string) {
        var dateObj = new Date(string);
        return dateObj;
      }
    }

    // Sort by selected property
    function sortBy(name) {
      vm.ascending = !vm.ascending;
      loaderService.openLoader(true);

      if ($state.current.name === 'opportunities') {
        filtersService.addSortFilter(name);
        opportunitiesService.getOpportunities();
      } else if ($state.current.name === 'target-list-detail') {
        vm.orderName = [];
        if (vm.ascending) {
          if (name === 'store') vm.orderName = ['store.name'];
          if (name === 'opportunity') vm.orderName = ['-groupedOpportunities.length'];
          if (name === 'depletions') vm.orderName = ['store.depletionsCurrentYearToDate'];
          if (name === 'segmentation') vm.orderName = ['store.segmentation'];
        } else {
          if (name === 'store') vm.orderName = ['-store.name'];
          if (name === 'opportunity') vm.orderName = ['-groupedOpportunities.length'];
          if (name === 'depletions') vm.orderName = ['-store.depletionsCurrentYearToDate'];
          if (name === 'segmentation') vm.orderName = ['-store.segmentation'];
        }
      }
      loaderService.closeLoader();
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

    function flattenOpportunity(obj, rationale) {
      var data = [];

      angular.forEach(obj, function(value, key) {
        var item = {};
        var csvItem = {};
        angular.copy(value, item);
        csvItem.storeDistributor = item.store.distributors[0];
        csvItem.TDLinx = item.store.id;
        csvItem.storeName = item.store.name;
        csvItem.storeAddress = item.store.streetAddress;
        csvItem.storeCity = item.store.city;
        csvItem.storeZip = item.store.zip;
        csvItem.storeDepletionsCTD = item.store.depletionsCurrentYearToDate;
        csvItem.storeDepletionsCTDYA = item.store.depletionsCurrentYearToDateYA;
        csvItem.storeDepletionsCTDYAPercent = item.store.depletionsCurrentYearToDateYAPercent;
        csvItem.storeSegmentation = item.store.segmentation;
        csvItem.opportunityType = item.type;
        csvItem.productName = item.product.name;
        csvItem.itemAuthorization = item.isItemAuthorization;
        csvItem.chainMandate = item.isChainMandate;
        csvItem.onFeature = item.isOnFeature;
        csvItem.opportunityStatus = item.status;
        csvItem.impactPredicted = item.impactDescription;

        if (rationale) {
          csvItem.rationale = item.rationale;
        }

        data.push(csvItem);

      });

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

    function vsYAGrowthPercent(ty, ya) {
      if (ty > 0 && ya === 0) {
        return 100;
      } else if (ty === 0 && ya > 0) {
        return -100;
      } else if (ty === 0 && ya === 0) {
        return 0;
      } else {
        return (ty / ya - 1) * 100;
      }
    }

    function depletionsVsYaPercent(opportunity) {
      var currentYearToDate = opportunity.store.depletionsCurrentYearToDate,
          currentYearToDateYearAgo = opportunity.store.depletionsCurrentYearToDateYA,
          yearAgoPercentValue = opportunity.store.depletionsCurrentYearToDateYAPercent;

      if (currentYearToDateYearAgo === 0 && currentYearToDate > 0) {
        yearAgoPercentValue = 100;
      } else if (currentYearToDateYearAgo > 0 && currentYearToDate === 0) {
        yearAgoPercentValue = -100;
      } else if (currentYearToDateYearAgo === 0 && currentYearToDate === 0) {
        yearAgoPercentValue = 0;
      } else {
        yearAgoPercentValue = (currentYearToDate / currentYearToDateYearAgo - 1) * 100;
      }

      if (yearAgoPercentValue > 999) {
        yearAgoPercentValue = 999;
      }

      return yearAgoPercentValue;
    }

    function opportunityTypeOrSubtype(product) {
      if (product.type === 'CUSTOM') {
        return product.subType;
      } else {
        return product.type;
      }
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

    function csvHeaderRationale() {
      var rationale = angular.copy(vm.csvHeader);
      rationale.push('Rationale');
      return rationale;
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

    function checkIfLinkDisabled(storeDetails) {
      var id = null;
      if (storeDetails) {
        if (filtersService.model.selected.myAccountsOnly === true) {
          id = storeDetails.versionedId;
        } else {
          id = storeDetails.id;
        }
        return id !== null && typeof id !== 'undefined';
      } else {
        return false;
      }
    }

    function getStoreToBePassedToAcct(storeDetails) {
      var store = null,
          id = null;
      // If myAccountsOnly is true pass the versionedId (9 digits). As a fallback if it's null send id
      if (filtersService.model.selected.myAccountsOnly === true) {
        id = storeDetails.versionedId;
        store = {
          store: id + '|' + storeDetails.name + '|' + filtersService.model.selected.myAccountsOnly
        };
      } else {
        // If myAccountsOnly is true pass the id (7 digits). As a fallback if it's null send versionedId
        id = storeDetails.id;
        store = {
          store: id + '|' + storeDetails.name + '|' + filtersService.model.selected.myAccountsOnly
        };
      }
      return store;
    }

    function init() {
      // Initialize the target lists for the user Id
      getTargetLists();

      // page is NOT target-list-detail, so it is opportunities
      if (pageName(['target-list-detail'])) {
        vm.analyticsCategory = 'Opportunities';
        vm.analyticsLabel = 'Opportunity Result List';
      } else {
        vm.analyticsCategory = 'Target Lists';
        vm.analyticsLabel = 'Opportunities';
      }
    }
  };
