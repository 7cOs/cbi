'use strict';

module.exports = /*  @ngInject */
  function pageController($scope, filtersService, opportunitiesService, targetListService) {
    // Initial variables
    let vm = this;

    vm.loadingList = false;
    vm.firstPage   = 0;
    vm.currentPage = 0;

    vm.pageNumbers;
    vm.lastPage;

    // Methods
    vm.pageChanged = pageChanged;

    // Public Methods

    function pageChanged(pageNumber) {
      const isTargetList = vm.pageName === 'target-list-detail';
      filtersService.model.appliedFilter.pagination.currentPage = pageNumber;
      vm.loadingList = true;
      if (isTargetList) {
        targetListService.getTargetListOpportunities(targetListService.model.currentList.id, {type: 'targetListOpportunities'}).then(response => {
          vm.loadingList = false;
        });
      } else {
        opportunitiesService.getOpportunities().then(data => {
          vm.loadingList = false;
        });
      }
    }

    // Private Methods

    $scope.$watch(() => { return filtersService.model.appliedFilter.pagination.totalPages; }, newVal => {
      vm.lastPage    = newVal;
      vm.pageNumbers = getPageNumbers();
    });

    $scope.$watch(() => { return filtersService.model.appliedFilter.pagination.currentPage; }, newVal => {
      vm.currentPage = newVal;
      vm.pageNumbers = getPageNumbers();
    });

    function getPageNumbers() {
      let _start, _end;

      if (vm.lastPage < 10) {
        _start = 0;
        _end = vm.lastPage;
      } else if (vm.currentPage < 5) {
        _start = 0;
        _end = vm.lastPage < 9 ? vm.lastPage : 9;
      } else if (vm.currentPage > vm.lastPage - 5) {
        _start = vm.lastPage - 9;
        _end = vm.lastPage;
      } else {
        _start = vm.currentPage - 4;
        _end = vm.currentPage + 5;
      }

      return Array(_end - _start + 1)
             .fill()
             .map((val, idx) => idx + _start);
    }
  };
