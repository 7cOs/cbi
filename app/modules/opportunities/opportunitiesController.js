'use strict';

module.exports =
  function opportunitiesController($scope, $log, opportunitiesService) {

    // Map public methods to scope
    $scope.toggle = toggle;
    $scope.exists = exists;
    $scope.isChecked = isChecked;
    $scope.toggleAll = toggleAll;
    $scope.expandCallback = expandCallback;
    $scope.collapseCallback = collapseCallback;

    // Get opportunities and products data
    $scope.opportunities = opportunitiesService.get('opportunities');
    $scope.products = opportunitiesService.get('products');

    // Set up arrays for tracking selected and expanded list items
    $scope.selected = [];
    $scope.expandedOpportunities = [];

    $scope.activeFilters = ['Filter 1', 'Filter 2', 'Filter 3'];
    $scope.opportunityType = ['All Types', 'Non-buy', 'At Risk', 'Low Velocity', 'New Placement (Quality)', 'New Placement (No Rebuy)', 'Manual'];

    $scope.filter = {
      accountScope: '',
      premiseType: '',
      opportunityStatus: '',
      opportunity: '',
      skuBrand: '',
      accountStore: '',
      distributor: ''
    };

    // Add item to array of currently expanded list items
    function expandCallback(item) {
      $scope.expandedOpportunities.push(item);
    };

    // Remove item from array of currently expanded list items
    function collapseCallback(item) {
      var index = $scope.expandedOpportunities.indexOf(item);
      if (index > -1) {
        $scope.expandedOpportunities.splice(index, 1);
      };

    // Check if list item exists and is selected
    function exists(item, list) {
      return list.indexOf(item) > -1;
    };

    // Check if all items are selected
    function isChecked() {
      return $scope.selected.length === $scope.opportunities.length;
    };

    // Select or deselect all list items
    function toggleAll() {
      if ($scope.selected.length === $scope.opportunities.length) {
        $scope.selected = [];
      } else if ($scope.selected.length === 0 || $scope.selected.length > 0) {
        $scope.selected = $scope.opportunities.slice(0);
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

    // Set positive or negative label for trend values
    $scope.opportunities.forEach(function(item) {
      var trend = item.depletionTrendVsYA;
      if (trend > 0) {
        item.positiveValue = true;
      } else if (trend < 0) {
        item.negativeValue = true;
      }
    });
  };
