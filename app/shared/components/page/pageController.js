'use strict';

module.exports = /*  @ngInject */
  function pageController($scope, $state, filtersService, loaderService, opportunitiesService) {
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
      if ($state.current.name !== 'target-list-detail' && filtersService.model.appliedFilter.pagination.totalPages > 0) return true;

      return false;
    }

    function getNumber() {
      var start = 0,
          end = 0,
          currentPage = filtersService.model.appliedFilter.pagination.currentPage,
          totalPages = filtersService.model.appliedFilter.pagination.totalPages;

      if (totalPages < 20) {
        start = 0;
        end = totalPages;
      } else if (currentPage < 10) {
        start = 0;
        end = totalPages < 9 ? totalPages : 19;
      } else if (currentPage > totalPages - 10) {
        start = totalPages - 19;
        end = totalPages;
      } else {
        start = currentPage - 9;
        end = currentPage + 10;
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
