'use strict';

module.exports = /*  @ngInject */
  function listController($scope, $state, $q, $location, $anchorScroll, $mdDialog, $timeout, $analytics, $filter, filtersService, loaderService, opportunitiesService, targetListService, storesService, userService, closedOpportunitiesService, ieHackService, toastService) {

    // ****************
    // CONTROLLER SETUP
    // ****************

    // Initial variables
    var vm = this;
    const maxOpportunities = 1000;
    let timer;

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
    vm.isAllOpportunitiesSelected = false;
    vm.isAllOpportunitiesInPageSelected = false;
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
    vm.selectAllToastVisible = false;

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
    vm.hasOpportunities = hasOpportunities;
    vm.openDismissModal = openDismissModal;
    vm.openShareModal = openShareModal;
    vm.opportunityTypeOrSubtype = opportunityTypeOrSubtype;
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
    vm.toggleOpportunitiesInStore = toggleOpportunitiesInStore;
    vm.selectAllOpportunities = selectAllOpportunities;
    vm.toggleSelectAllStores = toggleSelectAllStores;
    vm.updateOpportunityModel = updateOpportunityModel;
    vm.vsYAGrowthPercent = vsYAGrowthPercent;
    vm.getStoreToBePassedToAcct = getStoreToBePassedToAcct;
    vm.checkIfLinkDisabled = checkIfLinkDisabled;
    vm.remainingOpportunitySpots = remainingOpportunitySpots;
    vm.handleAddToTargetList = handleAddToTargetList;

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
        loaderService.openLoader(true);

        let opportunityIdsPromise = opportunityIdsToCopy();
        opportunityIdsPromise.then((opportunityIds) => {
          targetListService.addTargetListOpportunities(listId, opportunityIds).then(function(data) {
            updateCopiedOpportunities();
            vm.toggleSelectAllStores(false);

            loaderService.closeLoader();

            toastService.showToast('copied', opportunityIds);
          }, function(err) {
            loaderService.closeLoader();
            console.log('Error adding these ids: ', opportunityIds, ' Responded with error: ', err);
          });
        });
      }
    }

    function opportunityIdsToCopy() {
      var opportunityIdsPromise = $q.defer();

      if (vm.isAllOpportunitiesSelected) {
        opportunitiesService.getAllOpportunitiesIDs().then((opportunityIds) => {
          opportunityIdsPromise.resolve(opportunityIds);
        });
      } else {
        var opportunityIds = [];

        for (var i = 0; i < vm.selected.length; i++) {
          opportunityIds.push(vm.selected[i].id);
        }

        opportunityIdsPromise.resolve(opportunityIds);
      }

      return opportunityIdsPromise.promise;
    }

    function updateCopiedOpportunities() {
      for (var i = 0; i < vm.selected.length; i++) {
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
    }

    function createNewList(e) {
      var parentEl = angular.element(document.body);
      $mdDialog.show({
        clickOutsideToClose: false,
        parent: parentEl,
        scope: $scope.$new(),
        targetEvent: e,
        template: require('./create-target-list-modal.pug')
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
        template: require('./modal-share-opportunity.pug')
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
        template: require('./modal-dismiss-opportunity.pug')
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
        vm.undoClicked = false;
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
        template: require('./modal-opportunity-memo.pug')
      });
    }

    // Make call to applicable API endpoint for memo information per product
    // trigger population of memo with response data
    function getMemos(storeId, productId, type, code) {
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
          pickMemo(response, productId, code);
        }
      }
    }

    // Choose single memo from response/memo array based on most recent startDate
    function pickMemo(memos, productId, code) {
      var products = [];
      console.log(code);
      memos.forEach(function(value, key) {
        if (value.packageID === productId && value.typeCode === code) {
          products.push(value);
        }
      });
      if (products.length > 0) {
        vm.memoData = products[0];
      } else {
        vm.memoError = true;
      };
    };

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
        updateStateAfterUnselectingOpportunity();
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

      if (parent.selectedOpportunities === parent.groupedOpportunities.length) {
        updateSelectAllState();
      }

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

    function hasOpportunities() {
      if (opportunitiesService.model.opportunities.length === 0) {
        return false;
      } else {
        return true;
      }
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
        csvItem.storeDistributor = item.store.distributors ? item.store.distributors[0] : '';
        csvItem.TDLinx = item.store.id;
        csvItem.storeName = item.store.name;
        csvItem.storeAddress = item.store.streetAddress;
        csvItem.storeCity = item.store.city;
        csvItem.storeZip = item.store.zip;
        csvItem.storeDepletionsCTD = item.store.depletionsCurrentYearToDate;
        csvItem.storeDepletionsCTDYA = item.store.depletionsCurrentYearToDateYA;
        csvItem.storeDepletionsCTDYAPercent = item.store.depletionsCurrentYearToDateYAPercent;
        csvItem.storeSegmentation = item.store.segmentation;
        csvItem.opportunityType = $filter('formatOpportunitiesType')(opportunityTypeOrSubtype(item));
        csvItem.productName = item.product.name || item.product.brand;
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
     * Selects all the opportunities across all the pages
     */
    function selectAllOpportunities() {
      showSelectAllToast(false);
      vm.isAllOpportunitiesSelected = true;
    }

    /**
     * Toggles selection of all opportunites in all the stores
     * @param {Boolean} select Optional: whether to select or not. If not provided, will reverse the current state.
     */
    function toggleSelectAllStores (select) {
      if (select !== undefined && select !== null) {
        vm.isAllOpportunitiesInPageSelected = select;
      } else {
        vm.isAllOpportunitiesInPageSelected = !vm.isAllOpportunitiesInPageSelected;
      }

      if (vm.isAllOpportunitiesInPageSelected) {
        angular.forEach(opportunitiesService.model.opportunities, function(store, key) {
          selectAllOpportunitiesInStore(store, vm.selected);
        });

        showSelectAllToast(true);
      } else {
        updateStateAfterUnselectingOpportunity();
        vm.selected = [];

        angular.forEach(opportunitiesService.model.opportunities, function(store, key) {
          store.selectedOpportunities = 0;
        });
      }
    }

    function showSelectAllToast(show) {
      if (show && filtersService.model.appliedFilter.pagination.totalOpportunities < maxOpportunities) {
        vm.selectAllToastVisible = true;

        $timeout.cancel(timer);
        timer = $timeout(function () {
          vm.selectAllToastVisible = false;
        }, 10000);
      } else {
        $timeout.cancel(timer);
        vm.selectAllToastVisible = false;
      }
    }

    /**
     * Toggles selection of all opportunites in the specified store
     * @param {object} store Store that needs to be toggled
     * @param {Array} currentSelectionList Array of all currently selected items
     */
    function toggleOpportunitiesInStore (store, currentSelectionList) {
      const select = store.selectedOpportunities !== store.groupedOpportunities.length;

      if (select) {
        selectAllOpportunitiesInStore(store, currentSelectionList);
        updateSelectAllState();
      } else {
        deselectAllOpportunitiesInStore(store, currentSelectionList);
        updateStateAfterUnselectingOpportunity();
      }
    }

    /**
     * Checks if all the opportunities on the page are selected, then update the state accordingly
     */
    function updateSelectAllState() {
      var selectedStores = 0;
      angular.forEach(opportunitiesService.model.opportunities, function(store, key) {
        if (store.selectedOpportunities === store.groupedOpportunities.length) { selectedStores++; }
      });

      if (selectedStores === opportunitiesService.model.opportunities.length) {
        vm.isAllOpportunitiesInPageSelected = true;
        showSelectAllToast(true);
      } else {
        showSelectAllToast(false);
      }
    }

    /**
     * Update the state after unselecting one or many opportunities
     */
    function updateStateAfterUnselectingOpportunity() {
      vm.isAllOpportunitiesInPageSelected = false;
      vm.isAllOpportunitiesSelected = false;
      showSelectAllToast(false);
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

    function handleAddToTargetList(ev, targetList) {
      const usedOpps = targetList.opportunitiesSummary.opportunitiesCount;
      const remainingOpps = remainingOpportunitySpots(usedOpps);
      const totalOpps = usedOpps + vm.isAllOpportunitiesSelected ? filtersService.model.appliedFilter.pagination.totalOpportunities : this.selected.length;
      const hasRemainingOpps = totalOpps <= maxOpportunities;
      if (hasRemainingOpps) {
        vm.addToTargetList(targetList.id);
      } else {
        var parentEl = angular.element(document.body);
        $mdDialog.show({
          clickOutsideToClose: false,
          parent: parentEl,
          scope: $scope.$new(),
          targetEvent: ev,
          locals: {
            remainingOpps: remainingOpps
          },
          template: require('./modal-target-list-opportunities-exceeded.pug'),
          controller: ['remainingOpps', function(remainingOpps) {
            this.remainingOpps = remainingOpps;
          }],
          controllerAs: 'oppsModalCtrl'
        });
      }
    }

    function remainingOpportunitySpots(currentOpps) {
      const  remainingOpps = maxOpportunities - currentOpps;
      return remainingOpps > 0 ? remainingOpps : 0;
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
      return {store: storeDetails.id + '|' + storeDetails.name + '|' + false};
    }

    function init() {
      // Initialize the target lists for the user Id
      getTargetLists();

      // page is NOT target-list-detail, so it is opportunities
      if (vm.pageName === 'opportunities') {
        vm.analyticsCategory = 'Opportunities';
        vm.analyticsLabel = 'Opportunity Result List';
      } else {
        vm.analyticsCategory = 'Target Lists';
        vm.analyticsLabel = 'Opportunities';
      }
    }
  };
