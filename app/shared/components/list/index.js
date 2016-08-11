'use strict';

function ListController($scope, $state, opportunitiesService, storesService, $mdDialog) {
  var vm = this;

  vm.pageName = $state.current.name;

  // Map public methods to scope
  vm.actionOverlay = actionOverlay;
  vm.displayBrandIcon = displayBrandIcon;
  vm.exists = exists;
  vm.isChecked = isChecked;
  vm.sortBy = sortBy;
  vm.toggle = toggle;
  vm.toggleAll = toggleAll;

  // Controller Variables for Sorting
  vm.depletionsChevron = false;
  vm.expandedOpportunities = [];
  vm.opportunitiesChevron = false;
  vm.reverse = false;
  vm.segmentationChevron = false;
  vm.selected = [];
  vm.stores = [];
  // sortProperty is set to default sort on page load
  vm.sortProperty = 'store.name';
  vm.storeChevron = true;

  // Services
  vm.opportunitiesService = opportunitiesService;
  // vm.storesService = storesService;

  init();

  // ///////////////////////////////////////////////////////// Public Methods

  // Overlay Controls
  function actionOverlay(opportunity) {
    opportunity.toggled = !opportunity.toggled;
  };

  function displayBrandIcon(haystack, needle) {
    return haystack.indexOf(needle) !== -1;
  }

  // Check if list item exists and is selected
  function exists(item, list) {
    return list.indexOf(item) > -1;
  };

  // Check if all items are selected
  function isChecked() {
    // return vm.selected.length === vm.opportunities.length;
    return vm.selected.length === vm.opportunitiesService.model.opportunities.length;
  };

  // Select or deselect all list items
  function toggleAll() {
    // if (vm.selected.length === vm.opportunities.length) {
    if (vm.selected.length === vm.opportunitiesService.model.opportunities.length) {
      vm.selected = [];
    } else if (vm.selected.length === 0 || vm.selected.length > 0) {
      // vm.selected = vm.opportunities.slice(0);
      vm.selected = vm.opportunitiesService.model.opportunities.slice(0);
    }
  };

  // Select or deselect individual list item
  function toggle(item, list) {
    var idx = list.indexOf(item);
    if (idx > -1) {
      list.splice(idx, 1);
    } else {
      list.push(item);
    }
  };

  // Sort by selected property
  function sortBy(property) {
    vm.reverse = (vm.sortProperty === property) ? !vm.reverse : false;
    vm.sortProperty = property;

    vm.storeChevron = (property === 'store.name') ? !vm.storeChevron : vm.storeChevron;
    vm.opportunitiesChevron = (property === 'opCount') ? !vm.opportunitiesChevron : vm.opportunitiesChevron;
    vm.depletionsChevron = (property === 'depletionsCYTD') ? !vm.depletionsChevron : vm.depletionsChevron;
    vm.segmentationChevron = (property === 'segmentation') ? !vm.segmentationChevron : vm.storeChevron;
  }

  function init() {
    // Get opportunities and products data
    /* opportunitiesService.getOpportunities().then(function(data) {
      opportunitiesService.model.opportunities = data;
    });*/
  }

  // Set positive or negative label for trend values
  /* Should be handled in factory
  vm.opportunities.forEach(function(item) {
  });*/
}

module.exports =
  angular.module('orion.common.components.list', [])
  .component('list', {
    templateUrl: './app/shared/components/list/list.html',
    controller: ListController,
    controllerAs: 'list'
  });
