'use strict';

module.exports =
  function opportunitiesController($rootScope, $state, $mdDialog, opportunitiesService, chipsService, filtersService, userService) {
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
    vm.modalForm = modalForm;
    vm.modalAddOpportunityForm = modalAddOpportunityForm;

    // Broadcast current page name for other scopes
    $rootScope.$broadcast('page:loaded', $state.current.name);

    init();

    // ///////////////////////////////////////////////////////// Public Methods
    function modalForm(ev) {
      var parentEl = angular.element(document.body);
      $mdDialog.show({
        clickOutsideToClose: true,
        parent: parentEl,
        targetEvent: ev,
        templateUrl: './app/modules/opportunities/modal.html'
      });
    }

    function modalAddOpportunityForm(ev) {
      var parentEl = angular.element(document.body);
      $mdDialog.show({
        clickOutsideToClose: true,
        parent: parentEl,
        targetEvent: ev,
        templateUrl: './app/modules/opportunities/modal-add-opportunity-form.html'
      });
    }

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

    // ///////////////////////////////////////////////////////// Private Methods
    /**
     * @name filterQuery
     * @desc filter data using query from md-autocomplete
     * @params {String} q - query string
     * @params {Array} properties - array of strings that are the properties to be searched in the object
     * @returns {String}
     * @memberOf orion.common.services
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
      // set user model
      userService.getUsers('A1B2').then(function(data) {
        userService.model = data;

        // get saved filters
        userService.getOpportunityFilters(userService.model.id).then(function(data) {
          userService.model.opportunityFilters = data.filters;
        });
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
