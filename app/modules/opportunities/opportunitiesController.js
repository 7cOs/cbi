'use strict';

module.exports =
  function opportunitiesController($rootScope, $scope, $state, $log, opportunitiesService, chipsService, filtersService, userService) {
    var vm = this;

    // Services available in View
    vm.chipsService = chipsService;
    vm.filtersService = filtersService;

    // Map public methods to scope
    vm.toggle = toggle;
    vm.exists = exists;
    vm.isChecked = isChecked;
    vm.toggleAll = toggleAll;
    vm.expandCallback = expandCallback;
    vm.collapseCallback = collapseCallback;
    vm.querySearch = querySearch;

    // Broadcast current page name for other scopes
    $rootScope.$broadcast('page:loaded', $state.current.name);

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

    function querySearch(searchText) {
      // To Do: Send new request for data with search params - we could split this into the each respective service, or build the query here and send to the service
      // Change autocomplete to md-items="brand in o.querySearch(searchText)" to apply filters
      // Add loading spinner while we wait for request
    }

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
