'use strict';

module.exports =
  function landingController($rootScope, $state, filtersService, chipsService, myperformanceService, userService) {

    // ****************
    // CONTROLLER SETUP
    // ****************

    // Initial variables
    var vm = this;

    // Set page title for head and nav
    $rootScope.pageTitle = $state.current.title;

    // Expose public methods
    vm.isPositive = isPositive;
    vm.filter = filtersService.model;
    vm.chipsService = chipsService;
    vm.filtersService = filtersService;
    vm.performanceData = myperformanceService.model();
    vm.brandQuerySearch = brandQuerySearch;
    vm.accountQuerySearch = accountQuerySearch;
    vm.distributorQuerySearch = distributorQuerySearch;

    // Set values
    vm.greeting = getGreeting();

    /* userService.getPerformanceSummary('A1B2').then(function(data) {
      console.log(data.performance);
    });*/

    // **************
    // PUBLIC METHODS
    // **************

    function isPositive(salesData) {
      if (salesData >= 0) {
        return true;
      }
      return false;
    };

    function brandQuerySearch(searchText) {
      var results = filtersService.model.brands.filter(filterQuery(searchText, ['name', 'brand', 'quantity']));
      return results;
    }

    function accountQuerySearch(searchText) {
      // update to accounts
      var results = filtersService.model.stores.filter(filterQuery(searchText, ['account', 'sub_account', 'store_name']));
      return results;
    }

    function distributorQuerySearch(searchText) {
      var results = filtersService.model.distributors.filter(filterQuery(searchText, ['name', 'address', 'id']));
      return results;
    }

    // ***************
    // PRIVATE METHODS
    // ***************

    function getGreeting() {
      var myDate = new Date(),
          hrs = myDate.getHours(),
          greet;

      if (hrs < 12) {
        greet = 'Good morning';
      } else if (hrs >= 12 && hrs <= 17) {
        greet = 'Good afternoon';
      } else if (hrs >= 17 && hrs <= 24) {
        greet = 'Good evening';
      }

      return greet;
    }

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
  };
