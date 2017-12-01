'use strict';

import { values } from 'lodash';

module.exports = /*  @ngInject */
  function listController($scope, $state, $q, $location, $anchorScroll, $mdDialog, $timeout, analyticsService, $filter, filtersService, loaderService, opportunitiesService, targetListService, storesService, userService, closedOpportunitiesService, ieHackService, toastService) {

    // ****************
    // CONTROLLER SETUP
    // ****************

    // Initial variables
    const vm = this;
    const maxOpportunities = 1000;

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
    vm.loadingList = false;
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
    vm.maxOpportunities = maxOpportunities;
    vm.csvDownloadOption = filtersService.csvDownloadOptions[0].value;

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
    vm.downloadModal = downloadModal;
    vm.expandCallback = expandCallback;
    vm.getCSVData = getCSVData;
    vm.getCSVHeader = getCSVHeader;
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
    vm.isTotalOpportunitiesWithinMaxLimit = isTotalOpportunitiesWithinMaxLimit;
    vm.resetOpportunitiesExpanded = resetOpportunitiesExpanded;
    vm.sendDownloadEvent = sendDownloadEvent;

    // Custom Headers for CSV export
    vm.csvHeader = [
      'Distributor',
      'TDLinx',
      'Store Name',
      'Store Number',
      'Address',
      'City',
      'ZIP',
      'Current YTD Store Volume',
      'Last YTD Store Volume',
      'Volume Trend for Store CYTD vs CYTD Last Year',
      'Segmentation'
    ];
    vm.csvHeaderNoStores = [
      'Opportunity Type',
      'Product',
      'Item Authorization',
      'Chain Mandate',
      'On Feature',
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

    function sendDownloadEvent() {
      if (vm.pageName === 'opportunities') {
        analyticsService.trackEvent('Opportunities', 'Download', 'Opportunity Result List');
      } else {
        analyticsService.trackEvent(
          targetListService.getAnalyticsCategory(
            vm.targetListService.model.currentList.permissionLevel,
            vm.targetListService.model.currentList.archived
          ),
          'Download Target List',
          vm.targetListService.model.currentList.id
        );
      }
    }

    /**
     * Add a person to a list of collaboraters
     * @param {object} person The person who needs to be added to the list of collaborators
     */
    function addToSharedCollaborators(person) {
      if (!vm.sharedCollaborators.length) {
        vm.sharedCollaborators.push(person);
      } else {
        const matchedPerson = checkIfPersonIsAddedToCollaborators(person);
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
      let matchedPerson = null;
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
      const matchedPerson = checkIfPersonIsAddedToCollaborators(person);
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
      if (listId && vm.selected.length) {
        loaderService.openLoader(true);

        let opportunityIdsPromise = opportunityIdsToCopy();
        opportunityIdsPromise.then(opportunityIds => {
          targetListService.addTargetListOpportunities(listId, opportunityIds).then(() => {
            updateTargetListOpportunityCountByListID(listId, opportunityIds.length);
            updateCopiedOpportunities();
            vm.toggleSelectAllStores(false);

            loaderService.closeLoader();

            toastService.showToast('copied', opportunityIds);
          }, function(err) {
            loaderService.closeLoader();
            console.log('Error adding these ids: ', opportunityIds, ' Responded with error: ', err);
            getTargetLists();
          });
        });
      }
    }

    function opportunityIdsToCopy() {
      const opportunityIdsPromise = $q.defer();

      if (vm.isAllOpportunitiesSelected) {
        const getIdsPromise = vm.pageName === 'target-list-detail'
          ? targetListService.getTargetListOpportunities(vm.targetListService.model.currentList.id)
          : opportunitiesService.getOpportunities(true);

          getIdsPromise.then(opportunities => opportunityIdsPromise.resolve(opportunities.map(opportunity => opportunity.id)));

      } else {
        const opportunityIds = vm.selected.map(opportunity => opportunity.id);
        opportunityIdsPromise.resolve(opportunityIds);
      }

      return opportunityIdsPromise.promise;
    }

    function updateCopiedOpportunities() {
      for (let i = 0; i < vm.selected.length; i++) {
        let breaking = false;

        if (vm.selected[i].status !== 'TARGETED') {
          // find opporuntities that were changed
          for (let j = 0; j < opportunitiesService.model.opportunities.length; j++) {
            for (let k = 0; k < opportunitiesService.model.opportunities[j].groupedOpportunities.length; k++) {
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
      const parentEl = angular.element(document.body);
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

      userService.addTargetList(vm.newList).then(response => {
        analyticsService.trackEvent(
          'Target Lists - My Target Lists',
          'Create Target List',
          response.id
        );

        vm.addToTargetList(response.id);
        vm.closeModal();
        vm.buttonDisabled = false;

        return targetListService.addTargetListShares(response.id, vm.newList.targetListShares);
      })
      .then(addCollaboratorResponse => {
        userService.model.targetLists.owned[0].collaborators = addCollaboratorResponse.data;

        vm.newList = {
          name: '',
          description: '',
          opportunities: [],
          collaborators: [],
          targetListShares: [],
          collaborateAndInvite: false
        };
      })
      .catch(error => console.error('Error creating target list: ', error));
    }

    function addCollaborator(e) {
      vm.newList.collaborators.push(e);
      const share = {
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

      const parentEl = angular.element(document.body);
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
        for (let i = 0; i < vm.sharedCollaborators.length; i++) {
          userService.sendOpportunity(vm.sharedCollaborators[i].employeeId, vm.currentOpportunityId).then(function(data) {
            vm.opportunityShared = true;
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
      const parentEl = angular.element(document.body);
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
              const storeGroup = store.groupedOpportunities;

              storeGroup.forEach(function(opportunity, key) {
                if (opportunity.id === oId && dismiss) {
                  storeGroup.splice(key, 1);
                } else if (opportunity.id === oId && !dismiss) {
                  opportunity.status = 'CLOSED';
                  analyticsService.trackEvent(
                    'Opportunities',
                    'Close Opportunity',
                    opportunity.id
                  );
                }
              });

              if (storeGroup.length < 1) {
                vm.opportunitiesService.model.opportunities.splice(key, 1);
                vm.filtersService.model.appliedFilter.pagination.totalStores -= 1;
                vm.filtersService.model.appliedFilter.pagination = vm.filtersService.getNewPaginationState(vm.filtersService.model.appliedFilter.pagination);
              }
            });

            if (vm.filtersService.model.appliedFilter.pagination.shouldReloadData) {
              vm.opportunitiesService.getAndUpdateStoresWithOpportunities();
              vm.filtersService.model.appliedFilter.pagination.shouldReloadData = false;
            }
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

    function removeAllOpportunities() {
      targetListService.getTargetListOpportunityIDs(targetListService.model.currentList.id).then(opportunityIds => {
        targetListService.deleteTargetListOpportunities(targetListService.model.currentList.id, opportunityIds).then(response => {
          updateOpportunityModel(opportunitiesService.model.opportunities, opportunityIds);
          updateTargetListOpportunityCountByListID(targetListService.model.currentList.id, 0 - opportunityIds.length);
          vm.loadingList = false;
        }).catch((err) => {
          console.log('Error deleting these ids: ', opportunityIds, ' Responded with error: ', err);
          vm.loadingList = false;
        });
      });
    }

    function removeOpportunity() {
      vm.loadingList = true;
      vm.selectAllToastVisible = false;
      const opportunityIds = vm.selected.map(opp => opp.id);

      if (vm.isAllOpportunitiesSelected) {
        removeAllOpportunities();
      } else {
        targetListService.deleteTargetListOpportunities(targetListService.model.currentList.id, opportunityIds).then(function(data) {
          updateOpportunityModel(opportunitiesService.model.opportunities, opportunityIds);
          updateTargetListOpportunityCountByListID(targetListService.model.currentList.id, 0 - opportunityIds.length);
          vm.loadingList = false;
        }, function(err) {
          console.log('Error deleting these ids: ', opportunityIds, ' Responded with error: ', err);
          vm.loadingList = false;
        });
      }
    }

    function updateOpportunityModel(opps, selectedIds) {
      for (let i = 0; i < selectedIds.length; i++) {
        for (let j = 0; j < opps.length; j++) {
          for (let k = 0; k < opps[j].groupedOpportunities.length; k++) {
            const oppId = opps[j].groupedOpportunities[k].id;

            if (selectedIds[i] === oppId) {
              opps[j].groupedOpportunities.splice(k, 1);
              opps[j].brands.splice(k, 1);
              filtersService.model.appliedFilter.pagination.totalOpportunities--;
              break;
            }
          }

          if (!opps[j].groupedOpportunities.length) {
            opps.splice(j, 1);
            filtersService.model.appliedFilter.pagination.totalStores--;
          }
        }
      }

      vm.selected = [];

      if (vm.isAllOpportunitiesSelected) {
        filtersService.model.appliedFilter.pagination.totalPages = 0;
        filtersService.model.appliedFilter.pagination.currentPage = 0;
      } else if (vm.isAllOpportunitiesInPageSelected) {
        filtersService.model.appliedFilter.pagination.currentPage
          ? filtersService.model.appliedFilter.pagination.currentPage--
          : filtersService.model.appliedFilter.pagination.currentPage = 0;

        filtersService.model.appliedFilter.pagination.totalPages--;
        targetListService.getTargetListOpportunities(targetListService.model.currentList.id,
                                                    {type: 'targetListOpportunities'})
                                                    .then(() => {
        });
      }
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
      const parentEl = angular.element(document.body);
      $mdDialog.show({
        clickOutsideToClose: false,
        parent: parentEl,
        scope: $scope.$new(),
        targetEvent: ev,
        template: require('./modal-opportunity-memo.pug')
      });
    }

    function downloadModal(oId, ev) {
      vm.currentOpportunityId = oId;
      vm.sharedCollaborators = [];
      vm.opportunityShared = false;
      vm.shareOpportunityFail = false;

      const parentEl = angular.element(document.body);
      $mdDialog.show({
        clickOutsideToClose: false,
        parent: parentEl,
        scope: $scope.$new(),
        targetEvent: ev,
        template: require('./modal-download-opportunity.pug')
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
      const products = [];
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
      vm.loadingList = true;
      filtersService.addSortFilter(name);

      if (vm.pageName === 'opportunities') {
        opportunitiesService.getAndUpdateStoresWithOpportunities().then(() => {
          vm.loadingList = false;
        });
      } else if (vm.pageName === 'target-list-detail') {
        targetListService.getAndUpdateTargetListStoresWithOpportunities(targetListService.model.currentList.id,
                          {type: 'targetListOpportunities'})
                          .then(() => {
          vm.loadingList = false;
        });
      }
    }

    // Select or deselect individual list item
    function selectOpportunity(event, parent, item, list) {
      const idx = list.indexOf(item);
      let groupedCount = 0;

      if (idx > -1) {
        updateStateAfterUnselectingOpportunity();
        removeItem(item, list, idx);
      } else {
        addItem(item, list);
      }
      event.stopPropagation();

      // Get selected opportunity count
      for (const key in parent.groupedOpportunities) {
        const obj = parent.groupedOpportunities[key];
        if (obj.selected === true) { groupedCount++; }
      }
      parent.selectedOpportunities = groupedCount;

      if (parent.selectedOpportunities === parent.groupedOpportunities.length) updateSelectAllState();

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
      return opportunitiesService.model.opportunities.length;
    }

    function noOpportunitiesExpanded() {
      return vm.expandedOpportunities === 0;
    }

    function resetOpportunitiesExpanded() {
      vm.expandedOpportunities = 0;
    }

    function showDisabled(message) {
      vm.disabledMessage = message;
    }

    function getCSVData() {
      const csvDataPromise = $q.defer();

      if (vm.isAllOpportunitiesSelected) {
        loaderService.openLoader(true);

        const getOpportunitiesPromise = vm.pageName === 'target-list-detail'
          ? targetListService.getFormattedTargetListOpportunities(targetListService.model.currentList.id)
          : vm.opportunitiesService.getFormattedOpportunities(true);

        getOpportunitiesPromise
          .then(opportunities => {
            csvDataPromise.resolve(createCSVData(opportunities));
            loaderService.closeLoader();
          })
          .catch(() => {
            loaderService.closeLoader();
          });
      } else {
        csvDataPromise.resolve(createCSVData(vm.selected));
      }
      sendDownloadEvent();
      return csvDataPromise.promise;
    }

    function createCSVData(opportunities) {
      const csvData = {};
      let counter = 0;
      opportunities.reduce((data, opportunity) => {
        const item = {};
        const csvItem = {};
        angular.copy(opportunity, item);
        csvItem.storeDistributor = item.store.distributors ? item.store.distributors[0] : '';
        csvItem.TDLinx = item.store.id;
        csvItem.storeName = item.store.name;
        csvItem.storeNumber = item.store.storeNumber;
        csvItem.storeAddress = item.store.streetAddress;
        csvItem.storeCity = item.store.city;
        csvItem.storeZip = item.store.zip;
        csvItem.storeDepletionsCTD = item.store.depletionsCurrentYearToDate;
        csvItem.storeDepletionsCTDYA = item.store.depletionsCurrentYearToDateYA;
        csvItem.storeDepletionsCTDYAPercent = item.store.depletionsCurrentYearToDateYAPercent;
        csvItem.storeSegmentation = item.store.segmentation;

        if (vm.csvDownloadOption !== filtersService.csvDownloadOptions[2].value) {
          csvItem.opportunityType = $filter('formatOpportunitiesType')(opportunityTypeOrSubtype(item));
          csvItem.productName = item.product.name || item.product.brand;
          csvItem.itemAuthorization = item.isItemAuthorization;
          csvItem.chainMandate = item.isChainMandate;
          csvItem.onFeature = item.isOnFeature;
          csvItem.opportunityStatus = item.status;
          csvItem.impactPredicted = item.impactDescription;
        }

        if (vm.csvDownloadOption === filtersService.csvDownloadOptions[0].value) {
          csvItem.rationale = item.rationale;
        }

        if (vm.csvDownloadOption === filtersService.csvDownloadOptions[2].value) {
          csvData[csvItem.TDLinx] = csvItem;
        } else {
          csvData[counter] = csvItem;
          counter = counter + 1;
        }
        return;
      }, []);
      return values(csvData);
    }

    function getCSVHeader() {
      const localCSVHeader = angular.copy(vm.csvHeader);

      if (vm.csvDownloadOption !== filtersService.csvDownloadOptions[2].value) {
        for (var key in vm.csvHeaderNoStores) {
          localCSVHeader.push(vm.csvHeaderNoStores[key]);
        }
      }

      if (vm.csvDownloadOption === filtersService.csvDownloadOptions[0].value) {
        localCSVHeader.push('Rationale');
      }

      return localCSVHeader;
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

        vm.selectAllToastVisible = true;
      } else {
        updateStateAfterUnselectingOpportunity();
        vm.selected = [];

        unselectAllOpportunities();
      }
    }

    /**
     * Unselects all the opportunities in all the stores
     */
    function unselectAllOpportunities() {
      opportunitiesService.model.opportunities = opportunitiesService.model.opportunities.map((store) => {
        store.selectedOpportunities = 0;

        store.groupedOpportunities = store.groupedOpportunities.map((opportunity) => {
          opportunity.selected = false;
          return opportunity;
        });

        return store;
      });
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
      let selectedStores = 0;
      angular.forEach(opportunitiesService.model.opportunities, function(store, key) {
        if (store.selectedOpportunities === store.groupedOpportunities.length) selectedStores++;
      });

      if (selectedStores === opportunitiesService.model.opportunities.length) {
        vm.isAllOpportunitiesInPageSelected = true;
        vm.selectAllToastVisible = true;
      } else {
        vm.selectAllToastVisible = false;
      }
    }

    /**
     * Update the state after unselecting one or many opportunities
     */
    function updateStateAfterUnselectingOpportunity() {
      vm.isAllOpportunitiesInPageSelected = false;
      vm.isAllOpportunitiesSelected = false;
      vm.selectAllToastVisible = false;
    }

    /**
     * Selects all opportunities in a store passed to this function
     * @param {object} store Store that needs to be toggled
     * @param {Array} currentSelectionList Array of all currently selected items
     */
    function selectAllOpportunitiesInStore(store, currentSelectionList) {
      for (const key in store.groupedOpportunities) {
        const opportunity = store.groupedOpportunities[key];
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
      for (const key in store.groupedOpportunities) {
        const opportunity = store.groupedOpportunities[key],
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
      let currentYearToDate = opportunity.store.depletionsCurrentYearToDate;
      let currentYearToDateYearAgo = opportunity.store.depletionsCurrentYearToDateYA;
      let yearAgoPercentValue = opportunity.store.depletionsCurrentYearToDateYAPercent;

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
      let result;
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

    function handleAddToTargetList(ev, targetList, idx, addAction) {
      const usedOpps = targetList.opportunitiesSummary.opportunitiesCount;
      const remainingOpps = remainingOpportunitySpots(usedOpps);
      const totalOpps = usedOpps + (vm.isAllOpportunitiesSelected ? filtersService.model.appliedFilter.pagination.totalOpportunities : this.selected.length);
      const hasRemainingOpps = totalOpps <= maxOpportunities;
      if (hasRemainingOpps) {
        analyticsService.trackEvent(
          targetListService.getAnalyticsCategory(vm.targetListService.model.currentList.permissionLevel, targetListService.model.currentList.archived),
          `${addAction ? 'Add' : 'Copy'} to Target List`,
          addAction ? targetList.id : vm.targetListService.model.currentList.id
        );
        vm.addToTargetList(targetList.id);
      } else {
        const parentEl = angular.element(document.body);
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

    /**
     * Whether or not the number of all the fetched opportunities is smaller than the max threshold
     * @returns {Boolean}
     */
    function isTotalOpportunitiesWithinMaxLimit() {
      return filtersService.model.appliedFilter.pagination.totalOpportunities <= maxOpportunities;
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
      vm.disabledMessage = '';
      updateStateAfterUnselectingOpportunity();
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

    function checkIfLinkDisabled(storeDetails) {
      let id = null;
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
      return {
        storeid: storeDetails.id,
        myaccountsonly: false,
        depletiontimeperiod: 'CYTD'
      };
    }

    function updateTargetListOpportunityCount(idxOfTargetList, numberToAdd) {
      vm.userService.model.targetLists.owned[idxOfTargetList].opportunitiesSummary.opportunitiesCount += numberToAdd;
    }

    function updateTargetListOpportunityCountByListID(listID, opportunityCount) {
      const foundListIdx = vm.userService.model.targetLists.owned.findIndex(targetList => targetList.id === listID);
      if (foundListIdx > -1) updateTargetListOpportunityCount(foundListIdx, opportunityCount);
    }

    function init() {
      // Initialize the target lists for the user Id
      getTargetLists();
    }
  };
