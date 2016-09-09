'use strict';

function ListController($scope, $state, $q, $location, $anchorScroll, $mdDialog, opportunitiesService, targetListService, storesService, userService, closedOpportunitiesService) {

  // ****************
  // CONTROLLER SETUP
  // ****************

  // Initial variables
  var vm = this;

  // Services
  vm.opportunitiesService = opportunitiesService;
  vm.userService = userService;

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
  vm.sortProperty = 'store.name';
  vm.storeChevron = true;
  vm.showSubMenu = false;
  vm.disabledMessage = '';

  // Expose public methods
  vm.addToSharedCollaborators = addToSharedCollaborators;
  vm.addToTargetList = addToTargetList;
  vm.closeModal = closeModal;
  vm.displayBrandIcon = displayBrandIcon;
  vm.displayPagination = displayPagination;
  vm.exists = exists;
  vm.isChecked = isChecked;
  vm.openShareModal = openShareModal;
  vm.openDismissModal = openDismissModal;
  vm.pageName = pageName;
  vm.removeOpportunity = removeOpportunity;
  vm.shareOpportunity = shareOpportunity;
  vm.sortBy = sortBy;
  vm.selectOpportunity = selectOpportunity;
  vm.selectAllParents = selectAllParents;
  vm.showCorporateMemoModal = showCorporateMemoModal;
  vm.submitFeedback = submitFeedback;
  vm.cancelFeedback = cancelFeedback;
  vm.pageChanged = pageChanged;
  vm.allOpportunitiesExpanded = allOpportunitiesExpanded;
  vm.noOpportunitiesExpanded = noOpportunitiesExpanded;
  vm.showDisabled = showDisabled;
  vm.selectAllOpportunities = selectAllOpportunities;
  vm.flattenOpportunity = flattenOpportunity;

  vm.expandCallback = expandCallback;
  vm.collapseCallback = collapseCallback;

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

  function addToSharedCollaborators() {
    vm.sharedCollaborators.push(vm.collaborator);
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

  function displayPagination() {
    if (opportunitiesService.model.opportunitiesDisplay.length > 1) return true;

    return false;
  }

  // Check if list item exists and is selected
  function exists(item, list) {
    return list.indexOf(item) > -1;
  };

  // Check if all items are selected
  function isChecked() {
    return vm.selected.length === opportunitiesService.model.opportunities.length;
  }

  function openShareModal(oId, ev) {
    vm.currentOpportunityId = oId;
    vm.sharedCollaborators = [];

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
    userService.sendOpportunity(vm.collaborator.id, vm.currentOpportunityId).then(function(data) {
      console.log('shared');
    });
  }

  function openDismissModal(oId, ev) {
    vm.currentOpportunityId = oId;
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

  function submitFeedback(opportunity) {
    $mdDialog.hide();
    dismissOpportunity(opportunity);
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
  function sortBy(property) {
    vm.reverse = (vm.sortProperty === property) ? !vm.reverse : false;
    vm.sortProperty = property;

    vm.storeChevron = (property === 'store.name') ? !vm.storeChevron : vm.storeChevron;
    vm.opportunitiesChevron = (property === 'opCount') ? !vm.opportunitiesChevron : vm.opportunitiesChevron;
    vm.depletionsChevron = (property === 'depletionsCYTD') ? !vm.depletionsChevron : vm.depletionsChevron;
    vm.segmentationChevron = (property === 'segmentation') ? !vm.segmentationChevron : vm.storeChevron;
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
  }

  // Parent-level select to select all children opportunities
  function selectAllOpportunities(parent, list) {

    if (parent.selectedOpportunities === parent.groupedOpportunities.length) {
      var allOpportunitiesSelected = true;
    }

    for (var key in parent.groupedOpportunities) {
      var obj = parent.groupedOpportunities[key],
          idx = list.indexOf(obj);
      if (allOpportunitiesSelected) {
        removeItem(obj, list, idx);
      } else if (!obj.selected) {
        addItem(obj, list);
      }
    }
    parent.selectedOpportunities = allOpportunitiesSelected ? 0 : parent.groupedOpportunities.length;
  }

  // Select or deselect all opportunity parents
  function selectAllParents() {
    angular.forEach(opportunitiesService.model.opportunities, function(value, key) {
      selectAllOpportunities(value, vm.selected);
    });
  }

  function expandCallback(item) {
    vm.expandedOpportunities++;
  }

  function collapseCallback(item) {
    vm.expandedOpportunities--;
  }

  function pageChanged() {
    // $location.hash('opportunities');

    // $anchorScroll();
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

  function removeItem(item, list, idx) {
    item.selected = false;
    list.splice(idx, 1);
  }

  function addItem(item, list) {
    item.selected = true;
    list.push(item);
  }

  function dismissOpportunity(oId) {
    closedOpportunitiesService.closeOpportunity(oId).then(function(data) {
      angular.forEach(vm.opportunitiesService.model.opportunitiesDisplay[0], function(value, key) {
        if (value.id === oId) {
          vm.opportunitiesService.model.opportunities = vm.opportunitiesService.model.opportunitiesDisplay[0].splice(key, 1);
        }
      });
    });
  }

  function init() {
    // get target lists
    userService.getTargetLists(userService.model.currentUser.personID, {'type': 'targetLists'}).then(function(data) {
      userService.model.targetLists = data;
    });

    opportunitiesService.model.opportunitiesDisplay = [];
  }
}

module.exports =
  angular.module('cf.common.components.list', [])
  .component('list', {
    templateUrl: './app/shared/components/list/list.html',
    controller: ListController,
    controllerAs: 'list'
  });
