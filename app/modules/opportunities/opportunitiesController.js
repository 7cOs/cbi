'use strict';

module.exports =
  function opportunitiesController($rootScope, $scope, $state, $mdDialog, opportunitiesService, chipsService, filtersService, userService) {

    // ****************
    // CONTROLLER SETUP
    // ****************

    // Initial variables
    var vm = this;

    // Set page title for head and nav
    $rootScope.pageTitle = $state.current.title;

    // Services
    vm.chipsService = chipsService;
    vm.filtersService = filtersService;
    vm.userService = userService;
    vm.opportunitiesService = opportunitiesService;

    // Expose public methods
    vm.accountQuerySearch = accountQuerySearch;
    vm.addOpportunity = addOpportunity;
    vm.applyFilter = applyFilter;
    vm.brandQuerySearch = brandQuerySearch;
    vm.closeModal = closeModal;
    vm.distributorQuerySearch = distributorQuerySearch;
    vm.modalSaveOpportunityFilter = modalSaveOpportunityFilter;
    vm.saveFilter = saveFilter;

    init();

    // **************
    // PUBLIC METHODS
    // **************

    function modalSaveOpportunityFilter(ev) {
      var parentEl = angular.element(document.body);
      $mdDialog.show({
        clickOutsideToClose: false,
        parent: parentEl,
        scope: $scope.$new(),
        targetEvent: ev,
        templateUrl: './app/modules/opportunities/modal.html'
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

    function closeModal() {
      $mdDialog.hide();
    }

    function distributorQuerySearch(searchText) {
      var results = filtersService.model.distributors.filter(filterQuery(searchText, ['name', 'address', 'id']));
      return results;
    }

    function saveFilter() {
      // get applied filters
      var filterPayload = filtersService.getAppliedFilters('opportunities');

      userService.saveOpportunityFilter(filterPayload).then(function(data) {
        // push new filter to filter dropdown
        userService.model.opportunityFilters.push(data.dataContent);

        // close modal
        closeModal();
      });
    }

    // ***************
    // PRIVATE METHODS
    // ***************

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
      // get saved filters -- this should be passed from user data when its ready
      userService.getOpportunityFilters(userService.model.currentUser.id).then(function(data) {
        userService.model.opportunityFilters = data.dataContent;
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
