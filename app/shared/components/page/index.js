'use strict';

function PageController($scope, $state, filtersService, opportunitiesService) {
  // Initial variables
  var vm = this;

  // Services
  vm.filtersService = filtersService;

  // Methods
  vm.displayPagination = displayPagination;
  vm.pageChanged = pageChanged;

  // Public Methods
  function displayPagination() {
    if (opportunitiesService.model.opportunities.length > 0) return true;

    return false;
  }

  function pageChanged(pageNumber) {
    filtersService.model.appliedFilter.pagination.currentPage = pageNumber;

    opportunitiesService.getOpportunities().then(function(data) {
    });
  }
}

module.exports =
  angular.module('cf.common.components.page', [])
  .component('page', {
    templateUrl: './app/shared/components/page/page.html',
    controller: PageController,
    controllerAs: 'page'
  });
