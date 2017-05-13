'use strict';

module.exports = /*  @ngInject */
  function pageController($scope, $state, filtersService, loaderService, opportunitiesService, targetListService) {
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
      return filtersService.model.appliedFilter.pagination.totalPages;
    }

    function getNumber() {
      var start = 0,
          end = 0,
          currentPage = filtersService.model.appliedFilter.pagination.currentPage,
          totalPages = filtersService.model.appliedFilter.pagination.totalPages;

      if (totalPages < 10) {
        start = 0;
        end = totalPages;
      } else if (currentPage < 5) {
        start = 0;
        end = totalPages < 9 ? totalPages : 9;
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
      const tl = $state.current.name === 'target-list-detail';
      filtersService.model.appliedFilter.pagination.currentPage = pageNumber;

      loaderService.openLoader(true);
      if (tl) {
        console.log('tl');
        targetListService.getTargetListOpportunities(targetListService.model.currentList.id, {type: 'opportunities'}).then(response => {
          loaderService.closeLoader();
        });
      } else {
        opportunitiesService.getOpportunities().then(data => {
          loaderService.closeLoader();
        });
      }
    }
  };
