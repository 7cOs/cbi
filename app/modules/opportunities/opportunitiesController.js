'use strict';

module.exports = /*  @ngInject */
  function opportunitiesController($rootScope, $scope, $state, $filter, $mdDialog, $mdSelect, opportunitiesService, opportunityFiltersService, chipsService, filtersService, userService, loaderService) {

    // ****************
    // CONTROLLER SETUP
    // ****************

    // Initial variables
    var vm = this;
    vm.currentFilter = {};
    vm.hintTextPlaceholder = 'Account or Subaccount Name';
    vm.isHoveringSave = false;
    vm.isHoveringReset = false;
    vm.resetFiltersOnLoad = $state.params.resetFiltersOnLoad;

    // Set page title for head and nav
    $rootScope.pageTitle = $state.current.title;

    // Services
    vm.chipsService = chipsService;
    vm.filtersService = filtersService;
    vm.userService = userService;
    vm.opportunitiesService = opportunitiesService;
    vm.loaderService = loaderService;

    // Expose public methods
    vm.applySavedFilter = applySavedFilter;
    vm.closeEditModal = closeEditModal;
    vm.closeModal = closeModal;
    vm.deleteSavedFilter = deleteSavedFilter;
    vm.editFilterModal = editFilterModal;
    vm.placeholderSelect = placeholderSelect;

    init();

    // **************
    // PUBLIC METHODS
    // **************

    function applySavedFilter(ev, filter) {
      if (ev.srcElement.nodeName === 'SPAN') {
        ev.preventDefault();
      } else {
        // set filters based on query string
        var arr = decodeURIComponent(filter.filterString).split(',');

        for (var i = 0; i < arr.length; i++) {
          if (arr[i].length > 0) {
            var prop = arr[i].split(':');

            filtersService.model.selected[prop[0]] = prop[1];
          }
        }

        chipsService.applyFilters();
      }
    }

    function closeModal() {
      $mdDialog.hide();
    }

    function closeEditModal() {
      vm.currentFilter = {};
      closeModal();
    }

    function editFilterModal(filterId, ev) {
      vm.currentFilter = $filter('filter')(userService.model.opportunityFilters, {id: filterId});

      var parentEl = angular.element(document.body);
      $mdDialog.show({
        clickOutsideToClose: true,
        parent: parentEl,
        scope: $scope.$new(),
        targetEvent: ev,
        templateUrl: './app/modules/opportunities/modal-edit-filter.html'
      });
    }

    function deleteSavedFilter(filterId) {
      opportunityFiltersService.deleteOpportunityFilter(filterId).then(function(data) {
        // remove from user model and UI
        angular.forEach(userService.model.opportunityFilters, function(item, key) {
          if (item.id === filterId) userService.model.opportunityFilters.splice(userService.model.opportunityFilters.indexOf(item), 1);
        });

        closeModal();
      });
    }

    function placeholderSelect(data) {
      vm.hintTextPlaceholder = data;
    }

    // ***************
    // PRIVATE METHODS
    // ***************

    function init() {
      // get saved filters -- this should be passed from user data when its ready
      userService.getOpportunityFilters(userService.model.currentUser.employeeID).then(function(data) {
        userService.model.opportunityFilters = data;
      });

      // reset all chips and filters on page init
      if (vm.resetFiltersOnLoad) {
        chipsService.resetChipsFilters(chipsService.model);
      } else {
        chipsService.applyFilters();
      }
      $state.params.resetFiltersOnLoad = true;

      // closes filter box
      filtersService.model.expanded = false;

      if (filtersService.model.selected.currentFilter) {
        console.log('win');
        var filter = filtersService.model.selected.currentFilter;
        var ev = filter.ev;

        applySavedFilter(ev, filter);
      }

      console.log(filtersService.model.selected.currentFilter.ev);

      // Set this to have a list load with the page
      // chipsService.applyFilters();

      // go to a specific opportunity on load and then set to null if specified
      if (opportunitiesService.model.opportunityId !== null) {
        opportunitiesService.getOpportunities(opportunitiesService.model.opportunityId).then(function(data) {
          opportunitiesService.model.opportunities = data;
          opportunitiesService.model.opportunityId = null;
        });
      }
    } // end init

  }; // end controller
