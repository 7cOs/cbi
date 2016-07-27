'use strict';

module.exports =
  function opportunitiesController($rootScope, $state, opportunitiesService, chipsService, filtersService, userService) {
    var vm = this;

    // Services available in View
    vm.chipsService = chipsService;
    vm.filtersService = filtersService;
    vm.userService = userService;

    // get saved filters
    userService.getOpportunityFilters('1').then(function(data) {
      vm.userService.model.opportunityFilters = data;
    });

    // Map public methods to scope
    vm.toggle = toggle;
    vm.exists = exists;
    vm.isChecked = isChecked;
    vm.toggleAll = toggleAll;
    vm.expandCallback = expandCallback;
    vm.collapseCallback = collapseCallback;
    vm.brandQuerySearch = brandQuerySearch;
    vm.accountQuerySearch = accountQuerySearch;
    vm.distributorQuerySearch = distributorQuerySearch;
    vm.addOpportunity = addOpportunity;

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

    function addOpportunity() {
      opportunitiesService.createOpportunity().then(function(response) {
        console.log('Thanks, Ratul.', response);
      }, function(reason) {
        console.log('Ratul. Plz.', reason);
      });
    }

    function brandQuerySearch(searchText) {
      var results = vm.filtersService.model.brands.filter(filterQuery(searchText, ['name', 'brand', 'quantity']));
      return results;
    }

    function accountQuerySearch(searchText) {
      // update to accounts
      var results = vm.filtersService.model.brands.filter(filterQuery(searchText, ['name', 'brand', 'quantity']));
      return results;
    }

    function distributorQuerySearch(searchText) {
      var results = vm.filtersService.model.distributors.filter(filterQuery(searchText, ['name', 'address', 'id']));
      return results;
    }

    /**
     * @name filterQuery
     * @desc filter data using query from md-autocomplete
     * @params {String} q - query string
     * @params {Array} properties - array of strings that are the properties to be searched in the object
     * @returns {String}
     * @memberOf andromeda.common.services
     */
    function filterQuery(q, properties) {
      var lowercaseQuery = angular.lowercase(q);
      return function filterFn(data) {

        for (var i = 0; i < properties.length; i++) {
          if ((angular.lowercase('' + data[properties[i]])).indexOf(lowercaseQuery) === 0) return (angular.lowercase('' + data[properties[i]])).indexOf(lowercaseQuery) === 0;
        }
      };
    }
  };
