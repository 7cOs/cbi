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
    // Chip Model
    $scope.chip = {
      methods: {
        addChip: addChip,
        addAutocompleteChip: addAutocompleteChip,
        removeChip: removeChip,
        updateChip: updateChip,
        removeFromFilterObj: removeFromFilterObj
      },
      model: []
    };
    // Filter Model
    $scope.filter = {
      opportunitiesTypes: opportunitiesService.get('opportunitiesTypes'),
      opportunitiesStatus: opportunitiesService.get('opportunitiesStatus'),
      brands: opportunitiesService.get('brands'),
      accounts: opportunitiesService.get('accounts'),
      distributors: opportunitiesService.get('distributors'),
      premises: opportunitiesService.get('premises'),
      selected: {
        accountScope: false,
        opportunitiesTypes: ''
      },
      expanded: false
    };

    // Get opportunities and products data
    $scope.opportunities = opportunitiesService.get('opportunities');
    $scope.products = opportunitiesService.get('products');

    // Set up arrays for tracking selected and expanded list items
    $scope.selected = [];
    $scope.expandedOpportunities = [];

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

    // ///////////////////////////////////////////////////////// Public Methods
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

    // ///////////////////////////////////////////////////////// Chip Methods
    // Add a chip
    function addChip(chip, type, onlyOneAllowed) {
      if (chip) {
        if (onlyOneAllowed) $scope.chip.methods.removeChip(type);

        // Add to Chip Model
        $scope.chip.model.push({
          name: chip,
          type: type
        });
      }
    };

    // Add Autocomplete Chip
    function addAutocompleteChip(chip, filter) {
      if (chip) {

        // Add to Chip Model
        $scope.chip.model.push({
          name: chip
        });

        // Empty Input
        if (filter) $scope.filter[filter] = '';
      }
    };

    // Remove a chip
    function removeChip(type) {
      for (var i = 0; i < $scope.chip.model.length; i++) {
        if ($scope.chip.model[i].type === type) {
          $scope.chip.model.splice(i, 1);
          break;
        }
      }
    };

    // Add or remove a checkbox chip
    function updateChip(chip, displayName) {
      $scope.filter.selected[chip] === true ? $scope.chip.methods.removeChip(chip) : $scope.chip.methods.addChip(displayName, chip, true);
    };

    // Update model when you click on the X on the chip
    function removeFromFilterObj(chip) {
      if (chip.type) $scope.filter.selected[chip.type] = false;
    };
    // ///////////////////////////////////////////////////////// End Chip Methods

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
