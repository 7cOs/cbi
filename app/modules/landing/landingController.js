'use strict';

module.exports =
  function landingController($rootScope, $state, filtersService, chipsService, myperformanceService, userService) {
    var vm = this;

    // Map public methods to scope
    vm.isNegative = isNegative;
    vm.isPositive = isPositive;
    vm.filter = filtersService.model;
    vm.chipsService = chipsService;
    vm.filtersService = filtersService;
    vm.performanceData = myperformanceService.model();
    vm.brandQuerySearch = brandQuerySearch;
    vm.accountQuerySearch = accountQuerySearch;
    vm.distributorQuerySearch = distributorQuerySearch;

    /* userService.getPerformanceSummary('A1B2').then(function(data) {
      console.log(data.performance);
    });*/

    // Broadcast current page name for other scopes
    $rootScope.$broadcast('page:loaded', $state.current.name);
    $rootScope.pageTitle = $state.current.title;

    /* commenting out until API is better
    userService.getTargetLists('A1B2C3').then(function(data) {
      vm.namedFilters = data.owned;
      console.log(vm.namedFilters);
      console.log('shared with me response', data.owned);

      vm.sharedFilters = data.sharedWithMe;
      console.log(vm.sharedFilters);
      console.log('shared with me response', data.sharedWithMe);
    });*/

    function isNegative(salesData) {
      if (salesData >= 0) {
        return false;
      }
      return true;
    };

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
