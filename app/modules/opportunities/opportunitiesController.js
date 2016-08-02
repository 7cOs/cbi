'use strict';

module.exports =
  function opportunitiesController($rootScope, $state, opportunitiesService, chipsService, filtersService, userService) {
    var vm = this;

    // Services exposed in View
    vm.chipsService = chipsService;
    vm.filtersService = filtersService;
    vm.userService = userService;
    vm.opportunitiesService = opportunitiesService;

    // Controller Methods
    vm.accountQuerySearch = accountQuerySearch;
    vm.addOpportunity = addOpportunity;
    vm.applyFilter = applyFilter;
    vm.brandQuerySearch = brandQuerySearch;
    vm.distributorQuerySearch = distributorQuerySearch;
    vm.saveFilter = saveFilter;

    // Broadcast current page name for other scopes
    $rootScope.$broadcast('page:loaded', $state.current.name);

    init();

    // ///////////////////////////////////////////////////////// Public Methods
    function accountQuerySearch(searchText) {
      // update to accounts
      var results = filtersService.model.stores.filter(filterQuery(searchText, ['account', 'sub_account', 'store_name']));
      return results;
    }

    function addOpportunity() {
      opportunitiesService.createOpportunity().then(function(response) {
        console.log('Thanks, Ratul.', response);
      }, function(reason) {
        console.log('Ratul. Plz.', reason);
      });
    }

    function applyFilter(filterStr) {
      console.log('add filter');
    }

    function brandQuerySearch(searchText) {
      var results = filtersService.model.brands.filter(filterQuery(searchText, ['name', 'brand', 'quantity']));
      return results;
    }

    function distributorQuerySearch(searchText) {
      var results = filtersService.model.distributors.filter(filterQuery(searchText, ['name', 'address', 'id']));
      return results;
    }

    function saveFilter() {
      // web service
      // var payload = parseFilterObj();
      // userService.saveOpportunityFilter(payload);
    }

    // Private Methods
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

    function init() {
      // Data Init
      userService.getTargetLists().then(function(data) {
        console.log(data);
      });

      userService.getPerformanceDepletion().then(function(data) {
        console.log(data);
      });

      // get saved filters
      userService.getOpportunityFilters('A1B2').then(function(response) {
        userService.model.opportunityFilters = response.filters;
      });

      // Get opportunities and products data
      opportunitiesService.getOpportunities().then(function(data) {
        opportunitiesService.model.opportunities = data;
      });
    }

    /* function parseFilterObj() {
      var prettyPayload = {
        key: 'value'
      };
      // iterate through chipsService.model and get it formatted correctly
      // probably should move to chipsService
      return prettyPayload;
    }*/
  };
