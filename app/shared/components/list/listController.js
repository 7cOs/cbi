'use strict';

module.exports = /*  @ngInject */
  function listController($scope, $state, $q, $location, $anchorScroll, $mdDialog, filtersService, loaderService, opportunitiesService, targetListService, storesService, userService, closedOpportunitiesService) {

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
    vm.isSelectAllActivated = false;

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

    init();

    // **************
    // PUBLIC METHODS
    // **************
    //
    $scope.$on('$mdMenuClose', function() {
      vm.showSubMenu = false;
    });

    function addToSharedCollaborators(person) {
      vm.sharedCollaborators.push(person);
    }

    function getDate() {
      return new Date();
    }

    function addToTargetList(listId) {
      var opportunityIds = [];

      // add opportunity ids into array to be posted
      for (var i = 0; i < vm.selected.length; i++) {
        opportunityIds.push(vm.selected[i].id);
      }

      targetListService.addTargetListOpportunities(listId, opportunityIds).then(function(data) {
        console.log('Done Adding these ids: ', opportunityIds);
        // to do - update view and model
      }, function(err) {
        console.log('Error adding these ids: ', opportunityIds, ' Responded with error: ', err);
      });
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
      $mdDialog.hide();
      dismissOpportunity(opportunity, data);
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
    /* function sortBy(property) {
      vm.reverse = (vm.sortProperty === property) ? !vm.reverse : false;
      vm.sortProperty = property;

      vm.storeChevron = (property === 'opportunity.store.name') ? !vm.storeChevron : vm.storeChevron;
      vm.opportunitiesChevron = (property === 'groupedOpportunities.length') ? !vm.opportunitiesChevron : vm.opportunitiesChevron;
      vm.depletionsChevron = (property === 'depletionsCurrentYearToDate') ? !vm.depletionsChevron : vm.depletionsChevron;
      vm.segmentationChevron = (property === 'segmentation') ? !vm.segmentationChevron : vm.storeChevron;
    } */

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
        item.productName = item.product.name;
        item.TDLinx = item.product.id;
        item.segmentation = item.store.segmentation;
        item.velocity = item.store.velocity;
        item.velocityYA = item.store.velocityYA;
        item.storeName = item.store.name;
        item.storeAddress = item.store.address;
        delete item.brands;
        delete item.store;
        delete item.groupedOpportunities;
        delete item.product;
        data.push(item);
      });
      return data;
    }

    function getTargetLists() {
      if (userService.model.targetLists && userService.model.targetLists.owned.length < 1) {
         // get target lists
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
          vm.selected = [];
        } else {
          selectAllOpportunitiesInStore(store, vm.selected);
        }
        getTargetLists();
      });
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
      getTargetLists();
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
      opportunitiesService.createOpportunityFeedback(oId, payload).then(function(data) {
        /* angular.forEach(vm.opportunitiesService.model.opportunitiesDisplay[0], function(value, key) {
          if (value.id === oId) {
            vm.opportunitiesService.model.opportunities = vm.opportunitiesService.model.opportunitiesDisplay[0].splice(key, 1);
          }
        }); */
      });
    }

    function init() {
      // opportunitiesService.model.opportunitiesDisplay = [];
    }
  };
