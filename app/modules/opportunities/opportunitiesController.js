'use strict';

module.exports = /*  @ngInject */
  function opportunitiesController($rootScope, $scope, $state, $filter, $mdDialog, opportunitiesService, opportunityFiltersService, chipsService, filtersService, userService) {

    // ****************
    // CONTROLLER SETUP
    // ****************

    // Initial variables
    var vm = this;
    vm.currentFilter = {};
    vm.hintTextPlaceholder = 'Name, Address, TDLinkx, or Store#';
    vm.isHoveringSave = false;
    vm.isHoveringReset = false;

    // Set page title for head and nav
    $rootScope.pageTitle = $state.current.title;

    // Services
    vm.chipsService = chipsService;
    vm.filtersService = filtersService;
    vm.userService = userService;
    vm.opportunitiesService = opportunitiesService;

    // Expose public methods
    vm.applyFilter = applyFilter;
    vm.closeEditModal = closeEditModal;
    vm.closeModal = closeModal;
    vm.deleteSavedFilter = deleteSavedFilter;
    vm.editFilterModal = editFilterModal;
    vm.modalSaveOpportunityFilter = modalSaveOpportunityFilter;
    vm.saveFilter = saveFilter;
    vm.placeholderSelect = placeholderSelect;
    vm.hoverState = hoverState;

    init();

    // **************
    // PUBLIC METHODS
    // **************

    function hoverState(icon) {
      if (icon === 'reset') {
        vm.isHoveringReset = !vm.isHoveringReset;
      } else {
        vm.isHoveringSave = !vm.isHoveringSave;
      }
    }

    function placeholderSelect(data) {
      vm.hintTextPlaceholder = data;
    }

    function applyFilter(filterStr) {
      console.log('add filter');
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

    function saveFilter() {
      // get applied filters
      var filterPayload = filtersService.getAppliedFilters('opportunities');

      userService.saveOpportunityFilter(filterPayload).then(function(data) {
        // push new filter to filter dropdown
        userService.model.opportunityFilters.push(data);

        // close modal
        closeModal();
      });
    }

    // ***************
    // PRIVATE METHODS
    // ***************

    // Add chip for inline search value watchers
    function addInlineSearchChip(val) {
      if (typeof val === 'string' && val !== '') {
        vm.chipsService.addAutocompleteChip(val, 'searchText');
      }
    }

    // Watch for inline search value changes
    $scope.$watch('o.filtersService.model.brand', function (val) { addInlineSearchChip(val); });
    $scope.$watch('o.filtersService.model.store', function (val) { addInlineSearchChip(val); });
    $scope.$watch('o.filtersService.model.chain', function (val) { addInlineSearchChip(val); });

    function init() {
      // get saved filters -- this should be passed from user data when its ready
      userService.getOpportunityFilters(userService.model.currentUser.personID).then(function(data) {
        userService.model.opportunityFilters = data;
      });

      // reset all chips and filters on page init
      chipsService.model = chipsService.resetChipsFilters(chipsService.model);

      // go to a specific opportunity on load and then set to null if specified
      if (opportunitiesService.model.opportunityId !== null) {
        opportunitiesService.getOpportunities(opportunitiesService.model.opportunityId).then(function(data) {
          opportunitiesService.model.opportunities = data;
          opportunitiesService.model.opportunityId = null;
        });
      }

    } // end init

  }; // end controller
