'use strict';

function ListController($scope, $state, opportunitiesService) {
  var vm = this;

  vm.pageName = $state.current.name;

  // Map public methods to scope
  vm.toggle = toggle;
  vm.exists = exists;
  vm.isChecked = isChecked;
  vm.toggleAll = toggleAll;
  vm.sortBy = sortBy;
  vm.actionOverlay = actionOverlay;

  // Services
  vm.opportunitiesService = opportunitiesService;

  // Controller Variables for Sorting
  vm.depletionsChevron = false;
  vm.expandedOpportunities = [];
  vm.opportunitiesChevron = false;
  vm.reverse = false;
  vm.segmentationChevron = false;
  vm.selected = [];

  // sortProperty is set to default sort on page load
  vm.sortProperty = 'store.name';
  vm.storeChevron = true;

  // Get opportunities and products data
  opportunitiesService.getOpportunities().then(function(data) {
    opportunitiesService.model.opportunities = data;
  });

  // This needs to be replaced when we get live data
  // Get opportunities and products data
  vm.opportunities = opportunitiesService.get('opportunities');
  vm.products = opportunitiesService.get('products');

  // Set up arrays for tracking selected and expanded list items
  vm.selected = [];
  vm.expandedOpportunities = [];

  // ///////////////////////////////////////////////////////// Public Methods

  // Overlay Controls
  function actionOverlay(opportunity) {
    opportunity.toggled = !opportunity.toggled;
  };

  // Check if list item exists and is selected
  function exists(item, list) {
    return list.indexOf(item) > -1;
  };

  // Check if all items are selected
  function isChecked() {
    return vm.selected.length === vm.opportunities.length;
  };

  // Select or deselect all list items
  function toggleAll() {
    if (vm.selected.length === vm.opportunities.length) {
      vm.selected = [];
    } else if (vm.selected.length === 0 || vm.selected.length > 0) {
      vm.selected = vm.opportunities.slice(0);
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

  // Set positive or negative label for trend values
  vm.opportunities.forEach(function(item) {
    var trend = item.depletionTrendVsYA;
    if (trend > 0) {
      item.positiveValue = true;
    } else if (trend < 0) {
      item.negativeValue = true;
    }
  });
}

module.exports =
  angular.module('andromeda.common.components.list', [])
  .component('list', {
    templateUrl: './app/shared/components/list/list.html',
    controller: ListController,
    controllerAs: 'list'
  });
