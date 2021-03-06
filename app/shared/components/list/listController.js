'use strict';

const findIndex = require('lodash/findIndex');
const uniqBy = require('lodash/uniqBy');
const values = require('lodash/values');

const OpportunitiesDownloadType = require('../../../enums/opportunities-download-type.enum').OpportunitiesDownloadType;
const ListSelectionType = require('../../../enums/lists/list-selection-type.enum').ListSelectionType;

module.exports = /*  @ngInject */
  function listController($scope, $state, $q, $location, $anchorScroll, $mdDialog, $timeout, analyticsService, $filter, filtersService, loaderService, opportunitiesService, targetListService, storesService, userService, closedOpportunitiesService, ieHackService, listsApiService, listsTransformerService, toastService, compassModalService) {

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
    vm.inactiveStatusTooltipInputData = {
      title: 'Inactive Status',
      text: [
        'This opportunity recommendation is no longer supported by data analytics (see Compass user guide for more details).',
        'Consider removing this opportunity from your list to ensure your list stays actionable and relevant.'
      ]
    };
    vm.velocityTooltipInputData = {
      title: 'Velocity',
      text: [
        'Monthly velocity for this account, calculated by taking the total volume over the selected time period (e.g. L90)' +
        ' and dividing by number of 30 day periods (3).',
        '“vs YA %” indicates the trend of velocity this year vs. same time period last year.'
      ]
    };

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
    vm.launchAddToListModal = launchAddToListModal;
    vm.openShareModal = openShareModal;
    vm.opportunitiesToCopy = opportunitiesToCopy;
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
    vm.retrieveStoreCountForSelectedOpportunities = retrieveStoreCountForSelectedOpportunities;
    vm.retrieveOpportunityCountFromSelection = retrieveOpportunityCountFromSelection;
    // Custom Headers for CSV export
    vm.csvHeader = [
      'Distributor',
      'TDLinx',
      'Distributor Customer Code',
      'Distributor Sales Route (Primary)',
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
    vm.csvHeaderProductsAndOthers = [
      'Opportunity Type',
      'Product Brand',
      'Product Sku',
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

    function launchAddToListModal(selectedOpportunities, allActiveLists) {
      const sortedActiveLists = sortAndFilterActiveLists(allActiveLists);
      opportunitiesToCopy(selectedOpportunities).then((opportunities) => {
        const selectedStoreIds = uniqBy(opportunities.map(opportunity => opportunity.store.id));
        const numberOfSelectedOpportunities = opportunities.length;
        const numberOfSelectedStores = selectedStoreIds.length;

        const CHOOSE_A_LIST = 'Choose a List';
        const CREATE_NEW_LIST = 'Create New List';

        const dropdownMenuDefault = [
          {
            display: CHOOSE_A_LIST,
            value: CHOOSE_A_LIST
          },
          { display: CREATE_NEW_LIST,
            value: CREATE_NEW_LIST
          }
        ];

        const listDropdownMenu = dropdownMenuDefault
          .concat(sortedActiveLists
            .map(list => {
              return {
                display: list.name,
                value: list.id
              };
          })
        );

        const radioOptions = [{
          display: ListSelectionType.Stores,
          value: ListSelectionType.Stores
        }, {
          display: ListSelectionType.Opportunities,
          value: ListSelectionType.Opportunities
        }];

        const radioInputModel = {
          selected: radioOptions[0].value,
          radioOptions: radioOptions,
          title: 'OPTIONS',
          stacked: false
        };

        const dropdownInputModel = {
          selected: listDropdownMenu[0].value,
          dropdownOptions: listDropdownMenu,
          title: 'LIST'
        };

        const modalBody = `<div class='modal-body-inner-title'>CURRENT SELECTION</div><b>${numberOfSelectedOpportunities} ${numberOfSelectedOpportunities === 1 ? 'opportunity' : 'opportunities'}</b> selected across ${numberOfSelectedStores} ${numberOfSelectedStores === 1 ? 'store' : 'stores'}`;

        const addToListInputs = {
          title: 'Add to List',
          bodyText: modalBody,
          radioInputModel: radioInputModel,
          dropdownInputModel: dropdownInputModel,
          acceptLabel: 'Add to List',
          rejectLabel: 'Cancel'
        };

        let compassModalOverlayRef = compassModalService.showActionModalDialog(addToListInputs, null);
        compassModalService.modalActionBtnContainerEvent(compassModalOverlayRef.modalInstance).then((value) => {
          const listSelectionType = value.radioOptionSelected;
          const listOptions = {
            listSelectionType: listSelectionType,
            selectedStoreIds: selectedStoreIds,
            opportunities: opportunities
          };
          if (value.dropdownOptionSelected === CREATE_NEW_LIST) {
            createNewList(null, listOptions);
          } else {
            const listId = value.dropdownOptionSelected;
            addToList(listId, listOptions);
          }
        });
      });
    };

    function sendDownloadEvent() {
      if (vm.pageName === 'opportunities') {
        analyticsService.trackEvent(
          'Opportunities',
          'Download Opportunities - ' + filtersService.csvDownloadOptions.find(downloadOption => downloadOption.value === vm.csvDownloadOption).label,
          'Opportunity Result Set');
      } else {
        analyticsService.trackEvent(
          targetListService.getAnalyticsCategory(
            vm.targetListService.model.currentList.permissionLevel,
            vm.targetListService.model.currentList.archived
          ),
          'Download List - ' + filtersService.csvDownloadOptions.find(downloadOption => downloadOption.value === vm.csvDownloadOption).label,
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

    // TODO: REMOVE this funciton and corresponding specs; no longer used
    /**
     * @deprecated
     * This function adds the selected opportunities to target list
     * @param {string} listId Guid of the target list
     */
    function addToTargetList(listId) {
      if (listId && vm.selected.length) {
        loaderService.openLoader(true);

        opportunitiesToCopy().then(opportunities => {
          const formattedOpportunities = opportunities.map(opportunity => { return { opportunityId: opportunity.id }; });
          updateCopiedOpportunities();
          updateTargetListOpportunityCountByListID(listId, opportunities.length);
          listsApiService.addOpportunitiesToListPromise(listId, formattedOpportunities)
            .then(result => {
              vm.toggleSelectAllStores(false);
              loaderService.closeLoader();
              toastService.showToast('added');
          }, err => {
            loaderService.closeLoader();
            console.log('Error adding these ids: ', opportunities.map(opp => opp.id), ' Responded with error: ', err);
            toastService.showToast('addedError');
            getTargetLists();
          });
        });
      }
    }

    function opportunitiesToCopy(selectedOpportunities) {
      const opportunities = selectedOpportunities || vm.selected;
      const opportunityIdsPromise = $q.defer();

      if (vm.isAllOpportunitiesSelected) {
        const getIdsPromise = vm.pageName === 'target-list-detail'
          ? targetListService.getTargetListOpportunities(vm.targetListService.model.currentList.id)
          : opportunitiesService.getOpportunities(true);

          getIdsPromise.then(opportunities => opportunityIdsPromise.resolve(opportunities));

      } else {
        opportunityIdsPromise.resolve(opportunities);
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

    function createNewList(e, listOptions) {
      const parentEl = angular.element(document.body);
      $mdDialog.show({
        clickOutsideToClose: false,
        parent: parentEl,
        scope: $scope.$new(),
        locals: {
          listOptions: listOptions
        },
        controller: ['listOptions', function(listOptions) {
          this.listOptions = listOptions;
        }],
        controllerAs: 'createNewListModal',
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

    function saveNewList(e, listOptions) {
      vm.buttonDisabled = true;
      const formattedList = listsTransformerService.formatNewList(vm.newList);
      listsApiService.createListPromise(formattedList)
        .then(response => {
          analyticsService.trackEvent(
            'Lists - My Lists',
            'Create List',
            response.id
          );

          addToList(response.id, listOptions);
          vm.closeModal();
          vm.buttonDisabled = false;

          if (userService.model.targetLists) {
            userService.model.targetLists.owned[0].collaborators = response.collaborators;
          }

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

        getOpportunitiesPromise.then(opportunities => {
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
      const formattedCSVData = opportunities.reduce((csvData, opportunity, index) => {
        if (vm.csvDownloadOption === OpportunitiesDownloadType.STORES && csvData.hasOwnProperty(opportunity.store.id)) return csvData;

        const opportunityCSVData = {
          storeDistributor: getStoreDistributor(opportunity),
          TDLinx: opportunity.store.id,
          distributorCustomerCode: getDistributorCustomerCode(opportunity.store.distributorsSalesInfo),
          primaryDistributorSalesRoute: getDistributorSalesRoute(opportunity.store.distributorsSalesInfo),
          storeName: opportunity.store.name,
          storeNumber: opportunity.store.storeNumber,
          storeAddress: opportunity.store.streetAddress,
          storeCity: opportunity.store.city,
          storeZip: opportunity.store.zip,
          storeDepletionsCTD: opportunity.store.depletionsCurrentYearToDate,
          storeDepletionsCTDYA: opportunity.store.depletionsCurrentYearToDateYA,
          storeDepletionsCTDYAPercent: opportunity.store.depletionsCurrentYearToDateYAPercent,
          storeSegmentation: opportunity.store.segmentation
        };

        if (vm.csvDownloadOption !== OpportunitiesDownloadType.STORES) {
          opportunityCSVData.opportunityType = $filter('formatOpportunitiesType')(opportunityTypeOrSubtype(opportunity));
          opportunityCSVData.productBrand = opportunity.product.brand;
          opportunityCSVData.productSku = opportunity.product.name || 'Any';
          opportunityCSVData.itemAuthorization = opportunity.isItemAuthorization;
          opportunityCSVData.chainMandate = opportunity.isChainMandate;
          opportunityCSVData.onFeature = opportunity.isOnFeature;
          opportunityCSVData.opportunityStatus = opportunity.status;
          opportunityCSVData.impactPredicted = opportunity.impactDescription;
        }

        if (vm.csvDownloadOption === OpportunitiesDownloadType.WITH_RATIONALES) {
          opportunityCSVData.rationale = opportunity.rationale;
        }

        if (vm.csvDownloadOption === OpportunitiesDownloadType.STORES) {
          csvData[opportunity.store.id] = opportunityCSVData;
        } else {
          csvData[index] = opportunityCSVData;
        }

        return csvData;
      }, {});

      return values(formattedCSVData);
    }

    function getCSVHeader() {
      let localCSVHeader;

      if (vm.csvDownloadOption !== filtersService.csvDownloadOptions[2].value) {
        localCSVHeader = vm.csvHeader.concat(vm.csvHeaderProductsAndOthers);
      } else {
        localCSVHeader = angular.copy(vm.csvHeader);
      }

      if (vm.csvDownloadOption === filtersService.csvDownloadOptions[0].value) {
        localCSVHeader.push('Rationale');
      }

      return localCSVHeader;
    }

    function getStoreDistributor(opportunity) {
      if (filtersService.model.selected.distributor.length === 1) {
        return filtersService.model.selected.distributor[0].name;
      } else if (opportunity.store.distributors) {
        return opportunity.store.distributors[0];
      } else {
        return '';
      }
    }

    /**
     * Initializes the target lists for the user
     */
    function getTargetLists() {
      const currentUserEmployeeID = userService.model.currentUser.employeeID;
      listsApiService.getListsPromise().then((response) => {
        userService.model.targetLists = listsTransformerService.getV2ListsSummary(response, currentUserEmployeeID);
      });
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

    function getDistributorCustomerCode(distributorsSalesInfo) {
      return distributorsSalesInfo.reduce((customerCode, salesInfo) => {
        if (salesInfo.primaryFlag === 'Y') customerCode = salesInfo.distributorCustomerCd;
        if (filtersService.model.selected.distributor.length === 1) {
          let matchedIndex = getMatchedDistributorToSalesInfo(distributorsSalesInfo);
          return distributorsSalesInfo[matchedIndex].distributorCustomerCd;
        }
        return customerCode;
      }, '');
    }

    function getDistributorSalesRoute(distributorsSalesInfo) {
      return distributorsSalesInfo.reduce((salesRoute, salesInfo) => {
        if (salesInfo.primaryFlag === 'Y') {
          salesRoute = salesInfo.salespersonName.length ? salesInfo.salespersonName : 'Unknown';
        }
        if (filtersService.model.selected.distributor.length === 1) {
          let matchedIndex = getMatchedDistributorToSalesInfo(distributorsSalesInfo);
          return distributorsSalesInfo[matchedIndex].salespersonName.length ? distributorsSalesInfo[matchedIndex].salespersonName : 'Unknown';
        }
        return salesRoute;
      }, '');
    }

    function getMatchedDistributorToSalesInfo(distributorsSalesInfo) {
      let matchedIndex = findIndex(distributorsSalesInfo, (salesInfoObj) => {
        return salesInfoObj.distributorCd === filtersService.model.selected.distributor[0].id;
      });
      return matchedIndex;
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
      const totalOpps = usedOpps + (vm.isAllOpportunitiesSelected ? filtersService.model.appliedFilter.pagination.totalOpportunities : vm.selected.length);
      const hasRemainingOpps = totalOpps <= maxOpportunities;
      if (hasRemainingOpps) {
        // This logic is shared across multiple views so we have to detect where we are to fire the correct GA event.
        if ($state.current.name.includes('opportunities')) {
          analyticsService.trackEvent(
           'Opportunities',
            `${addAction ? 'Add' : 'Copy'} to List`,
            addAction ? targetList.id : vm.targetListService.model.currentList.id
          );
        } else {
          analyticsService.trackEvent(
            targetListService.getAnalyticsCategory(vm.targetListService.model.currentList.permissionLevel, targetListService.model.currentList.archived),
            `${addAction ? 'Add' : 'Copy'} to List`,
            addAction ? targetList.id : vm.targetListService.model.currentList.id
          );
        }
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
        premiseType: storeDetails.onPremise ? 'on' : 'off',
        versionedStoreID: storeDetails.versionedId,
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

    function retrieveStoreCountForSelectedOpportunities(selected) {
      if (selected === null) return 0;

      return this.isAllOpportunitiesSelected
        ? this.filtersService.model.appliedFilter.pagination.totalStores
        : new Set(selected.map(opportunity => opportunity.store.id)).size;
    }

    function retrieveOpportunityCountFromSelection(selected) {
      if (selected === null) return 0;

      return this.isAllOpportunitiesSelected
        ? this.filtersService.model.appliedFilter.pagination.totalOpportunities
        : selected.length;
    }

    function addToList(listId, listOptions) {
      const listSelectionType = listOptions.listSelectionType;
      const selectedStoreIds = listOptions.selectedStoreIds;
      const opportunities  = listOptions.opportunities;
      switch (listSelectionType) {
        case ListSelectionType.Stores:
          addStoresToList(listId, selectedStoreIds);
          break;
        case ListSelectionType.Opportunities:
        default:
          addOpportunitiesToList(listId, opportunities);
      }
    }

    function addStoresToList(listId, selectedStoreIds) {
      const addStoreToListPromises = selectedStoreIds.map(storeId => {
        return listsApiService.addStoresToListPromise(listId, { storeSourceCode: storeId });
      });
      $q.all(addStoreToListPromises)
        .then(() => {
          toastService.showToast('added');
          vm.toggleSelectAllStores(false);
          loaderService.closeLoader();
          vm.getTargetLists();
        }, () => {
          toastService.showToast('addedError');
          vm.toggleSelectAllStores(false);
          loaderService.closeLoader();
          vm.getTargetLists();
        });
    }

    function addOpportunitiesToList(listId, selectedOpportunities) {
      if (listId && selectedOpportunities.length) {
        loaderService.openLoader(true);

        const formattedOpportunities = selectedOpportunities.map(opportunity => { return { opportunityId: opportunity.id }; });
        updateCopiedOpportunities();
        updateTargetListOpportunityCountByListID(listId, selectedOpportunities.length);
        listsApiService.addOpportunitiesToListPromise(listId, formattedOpportunities)
          .then(() => {
            toastService.showToast('added');
            vm.toggleSelectAllStores(false);
            loaderService.closeLoader();
            vm.getTargetLists();
          }, () => {
            toastService.showToast('addedError');
            vm.toggleSelectAllStores(false);
            loaderService.closeLoader();
            vm.getTargetLists();
          });
      }
    }

    function sortAndFilterActiveLists(lists) {
      return lists
        .filter((list) => !list.deleted && !list.archived)
        .sort(sortListsByRecentlyUpdated);
    }

    function sortListsByRecentlyUpdated(listA, listB) {
      return listA.dateOpportunitiesUpdated < listB.dateOpportunitiesUpdated
        ? 1
        : listA.dateOpportunitiesUpdated > listB.dateOpportunitiesUpdated
          ? -1
          : 0;
    }
  };
