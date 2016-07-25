'use strict';

function ListController($scope, opportunitiesService) {
  var vm = this;

  // Map public methods to scope
  vm.toggle = toggle;
  vm.exists = exists;
  vm.isChecked = isChecked;
  vm.toggleAll = toggleAll;
  vm.expandCallback = expandCallback;
  vm.collapseCallback = collapseCallback;

  // Get opportunities and products data
  // vm.opportunities = opportunitiesService.get('opportunities');
  // vm.products = opportunitiesService.get('products');

  vm.opportunitiesService = opportunitiesService;

  // Set up arrays for tracking selected and expanded list items
  vm.selected = [];
  vm.expandedOpportunities = [];

  // ///////////////////////////////////////////////////////// Public Methods
  // Add item to array of currently expanded list items
  function expandCallback(item) {
    vm.expandedOpportunities.push(item);
  };

  // Remove item from array of currently expanded list items
  function collapseCallback(item) {
    var index = vm.expandedOpportunities.indexOf(item);
    if (index > -1) {
      vm.expandedOpportunities.splice(index, 1);
    };
  };

  // Check if list item exists and is selected
  function exists(item, list) {
    return list.indexOf(item) > -1;
  };

  // Check if all items are selected
  function isChecked() {
    return vm.selected.length === vm.opportunitiesService.model.opportunities.length;
  };

  // Select or deselect all list items
  function toggleAll() {
    if (vm.selected.length === vm.opportunitiesService.model.opportunities.length) {
      vm.selected = [];
    } else if (vm.selected.length === 0 || vm.selected.length > 0) {
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
}

module.exports =
  angular.module('andromeda.common.components.list', [])
  .component('list', {
    templateUrl: './app/shared/components/list/list.html',
    controller: ListController,
    controllerAs: 'list'
  });
