'use strict';

function PageController($scope, $state, filtersService, opportunitiesService) {
  // Initial variables
  var vm = this;

  // Services
  vm.filtersService = filtersService;

  // Methods
  vm.displayPagination = displayPagination;
  vm.getNumber = getNumber;
  vm.pageChanged = pageChanged;

  init();

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

    if (currentPage < 5) {
      start = 1;
      end = 10;
    } else if (currentPage > totalPages - 10) {
      start = totalPages - 9;
      end = totalPages;
    } else {
      start = currentPage - 4;
      end = currentPage + 5;
    }

    if (totalPages < 10) return new Array(totalPages);
    else {
      var arr = [];

      for (; start < end + 1; start++) {
        arr.push(start);
      }

      return arr;
    }
  }

  function pageChanged(pageNumber) {
    filtersService.model.appliedFilter.pagination.currentPage = pageNumber;

    // Add loader
    opportunitiesService.getOpportunities().then(function(data) {
      updatePaginationButtons();
      // Close loader
    });
  }

  // Private Methods
  function updatePaginationButtons() {
    console.log(filtersService.model.appliedFilter.pagination.currentPage);
  }

  function init() {
  }
}

module.exports =
  angular.module('cf.common.components.page', [])
  .component('page', {
    templateUrl: './app/shared/components/page/page.html',
    controller: PageController,
    controllerAs: 'page'
  });
