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
    $scope.addChip = addChip;
    $scope.removeChip = removeChip;
    $scope.updateAccountScopeChip = updateAccountScopeChip;
    $scope.removeFromFilterObj = removeFromFilterObj;

    // Get opportunities and products data
    $scope.opportunities = opportunitiesService.get('opportunities');
    $scope.products = opportunitiesService.get('products');

    // Set up arrays for tracking selected and expanded list items
    $scope.selected = [];
    $scope.expandedOpportunities = [];

    // Static Models - Most are used for ng-repeats on md-components
    $scope.premises = [{name: 'On Premise'}, {name: 'Off Premise'}];
    $scope.opportunityStatus = [{name: 'Open'}, {name: 'Targeted'}];
    $scope.opportunityType = ['All Types', 'Non-buy', 'At Risk', 'Low Velocity', 'New Placement (Quality)', 'New Placement (No Rebuy)', 'Manual'];
    $scope.brands = [
      {name: 'Corona Extra', size: '12 ounce Bottle'},
      {name: 'Corona Extra', size: '12 ounce Can(s)'},
      {name: 'Corona Light', size: '12 ounce Bottle'},
      {name: 'Corona Light', size: '12 ounce Can(s)'}
    ];
    $scope.accounts = [
      {name: 'Walmart', subAccount: 'North East'},
      {name: 'Walmart', subAccount: 'West'},
      {name: 'Walmart', subAccount: 'South'},
      {name: 'Walmart', subAccount: 'East'}
    ];
    $scope.distributors = [
      {name: 'Famous James\'s House of Juniper'},
      {name: 'Famous Will\'s House of Whiskey'},
      {name: 'Famous Eric\'s House of Eggnog'},
      {name: 'Famous RJ\'s House of Beer'}
    ];

    // Simulated returned user data to show saved filters
    $scope.userData = {
      savedFilters: [{
        name: 'Saved Filter 1',
        filters: ['Filter 1', 'Filter 2', 'Filter 3', 'Filter 4']
      }, {
        name: 'Saved Filter 2',
        filters: ['Filter 1', 'Filter 2']
      }]
    };

    // Dynamic Models
    // Filter Model
    $scope.filter = {
      accountScope: false
    };
    // Chips model
    $scope.activeFilters = [];

    // Add item to array of currently expanded list items
    function expandCallback(item) {
      $scope.expandedOpportunities.push(item);
    }

    // Public
    function exists(item, list) {
      return list.indexOf(item) > -1;
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

    // Add a chip
    function addChip(chip, type, onlyOneAllowed) {
      if (chip.length > 0) {
        if (onlyOneAllowed) $scope.removeChip(type);
        $scope.activeFilters.push({
          name: chip,
          type: type
        });
      }
    };

    // Remove a chip
    function removeChip(type) {
      for (var i = 0; i < $scope.activeFilters.length; i++) {
        if ($scope.activeFilters[i].type === type) {
          $scope.activeFilters.splice(i, 1);
          break;
        }
      }
    };

    // Add or remove the account scope chip
    function updateAccountScopeChip() {
      $scope.filter.accountScope === true ? $scope.removeChip('accountScope') : $scope.addChip('My Accounts Only', 'accountScope', true);
    }

    // Update model when you click on the X on the chip
    function removeFromFilterObj(chip) {
      $scope.filter[chip.type] = false;
    }

    // To Do: Create a better filter for brands and accounts
    /* function querySearch(query) {
      var results = query ? $scope.brands.filter(createFilterFor(query)) : $scope.brands;
      return results;
    }

    // Private
    function createFilterFor(query) {
      var lowercaseQuery = angular.lowercase(query);
      return function filterFn(brand) {
        return (brand.name.indexOf(lowercaseQuery) === 0);
      };
    }*/
  };
