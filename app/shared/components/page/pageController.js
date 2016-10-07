'use strict';

module.exports = /*  @ngInject */
  function pageController($scope, filtersService, loaderService, opportunitiesService) {
    // Initial variables
    var vm = this;

    // Services
    vm.filtersService = filtersService;

    // Methods
    vm.displayPagination = displayPagination;
    vm.getNumber = getNumber;
    vm.pageChanged = pageChanged;

    // Public Methods
    function displayPagination() {
      if (opportunitiesService.model.opportunities.length > 0) return true;

      return false;
    }

    function getNumber() {
      var start = 1,
          end = 1,
          currentPage = filtersService.model.appliedFilter.pagination.currentPage,
          totalPages = filtersService.model.appliedFilter.pagination.totalPages;

      if (totalPages < 10) {
        start = 1;
        end = totalPages;
      } else if (currentPage < 5) {
        start = 1;
        end = totalPages < 10 ? totalPages : 10;
      } else if (currentPage > totalPages - 5) {
        start = totalPages - 9;
        end = totalPages;
      } else {
        start = currentPage - 4;
        end = currentPage + 5;
      }

      var arr = [];

      for (; start < end + 1; start++) {
        arr.push(start);
      }

      return arr;
    }

    function pageChanged(pageNumber) {
      filtersService.model.appliedFilter.pagination.currentPage = pageNumber;

      loaderService.openLoader(true);
      opportunitiesService.getOpportunities().then(function(data) {
        loaderService.closeLoader();
      });
    }
  };
