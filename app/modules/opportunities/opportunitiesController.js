'use strict';

module.exports =
  function opportunitiesController($scope, $log, opportunitiesService) {
    var vm = this;

    // Map public methods to scope
    vm.toggle = toggle;
    vm.exists = exists;
    vm.isChecked = isChecked;
    vm.toggleAll = toggleAll;
    vm.expandCallback = expandCallback;
    vm.collapseCallback = collapseCallback;
    // Chip Model
    vm.chip = {
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
    vm.filter = opportunitiesService.model();

    // Get opportunities and products data
    vm.opportunities = opportunitiesService.get('opportunities');
    vm.products = opportunitiesService.get('products');

    // Set up arrays for tracking selected and expanded list items
    vm.selected = [];
    vm.expandedOpportunities = [];

    // Simulated returned user data to show saved filters
    vm.userData = {
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

    // Set positive or negative label for trend values
    vm.opportunities.forEach(function(item) {
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
        if (onlyOneAllowed) vm.chip.methods.removeChip(type);

        // Add to Chip Model
        vm.chip.model.push({
          name: chip,
          type: type
        });
      }
    };

    // Add Autocomplete Chip
    function addAutocompleteChip(chip, filter) {
      if (chip) {

        // Add to Chip Model
        vm.chip.model.push({
          name: chip
        });

        // Empty Input
        if (filter) vm.filter[filter] = '';
      }
    };

    // Remove a chip
    function removeChip(type) {
      for (var i = 0; i < vm.chip.model.length; i++) {
        if (vm.chip.model[i].type === type) {
          vm.chip.model.splice(i, 1);
          break;
        }
      }
    };

    // Add or remove a checkbox chip
    function updateChip(chip, displayName) {
      vm.filter.selected[chip] === true ? vm.chip.methods.removeChip(chip) : vm.chip.methods.addChip(displayName, chip, true);
    };

    // Update model when you click on the X on the chip
    function removeFromFilterObj(chip) {
      if (chip.type) vm.filter.selected[chip.type] = false;
    };
    // ///////////////////////////////////////////////////////// End Chip Methods

    // To Do: Create a better filter for brands and accounts
    /* function querySearch(query) {
      var results = query ? vm.brands.filter(createFilterFor(query)) : vm.brands;
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
