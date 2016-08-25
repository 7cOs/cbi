'use strict';

function ListController($scope, $state, $q, $mdDialog, opportunitiesService, targetListService, storesService, userService) {

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
  vm.expandedOpportunities = [];
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

  // Expose public methods
  vm.addToSharedCollaborators = addToSharedCollaborators;
  vm.addToTargetList = addToTargetList;
  vm.closeModal = closeModal;
  vm.dismissOpportunity = dismissOpportunity;
  vm.displayBrandIcon = displayBrandIcon;
  vm.exists = exists;
  vm.isChecked = isChecked;
  vm.openShareModal = openShareModal;
  vm.pageName = pageName;
  vm.removeOpportunity = removeOpportunity;
  vm.shareOpportunity = shareOpportunity;
  vm.sortBy = sortBy;
  vm.toggle = toggle;
  vm.toggleAll = toggleAll;
  vm.showCorporateMemoModal = showCorporateMemoModal;
  vm.showFlyout = showFlyout;
  vm.submitFeedback = submitFeedback;
  vm.cancelFeedback = cancelFeedback;

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

  // Show Flyout Menu
  function showFlyout(opportunity, action) {
    vm.showSubMenu = true;
    actionOverlay(opportunity, action);
  }

  function submitFeedback(opportunity) {
    vm.showSubMenu = false;
  }

  function cancelFeedback(opportunity) {
    vm.showSubMenu = false;
  }

  // Overlay Controls
  function actionOverlay(method, opportunityId) {
    console.log(opportunityId);
    if (method === 'send') {
      console.log('send');
    } else if (method === 'dismiss') {
      console.log('dismiss');
    }
  }

  function addToTargetList(listId) {
    var opportunityIds = [];

    // add opportunity ids into array to be posted
    for (var i = 0; i < vm.selected.length; i++) {
      for (var j = 0; j < vm.selected[i].groupedOpportunities.length; j++) {
        opportunityIds.push(vm.selected[i].groupedOpportunities[j].id);
      }
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

  function dismissOpportunity(oId) {
    console.log(oId);
    // no route for this in API yet
  }

  function displayBrandIcon(haystack, needle) {
    return haystack.indexOf(needle) !== -1;
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
  function toggle(item, list) {
    var idx = list.indexOf(item);
    if (idx > -1) {
      list.splice(idx, 1);
    } else {
      list.push(item);
    }
  }

  // Select or deselect all list items
  function toggleAll() {
    if (vm.selected.length === opportunitiesService.model.opportunities.length) {
      vm.selected = [];
    } else if (vm.selected.length === 0 || vm.selected.length > 0) {
      vm.selected = opportunitiesService.model.opportunities.slice(0);
    }
  }

  // **************
  // PRIVATE METHODS
  // **************

  function init() {
    // get target lists
    userService.getTargetLists(userService.model.currentUser.personID, {'type': 'targetLists'}).then(function(data) {
      userService.model.targetLists = data;
    });
  }

  // Set positive or negative label for trend values
  /* Should be handled in factory
  vm.opportunities.forEach(function(item) {
  });*/
}

module.exports =
  angular.module('cf.common.components.list', [])
  .component('list', {
    templateUrl: './app/shared/components/list/list.html',
    controller: ListController,
    controllerAs: 'list'
  });
