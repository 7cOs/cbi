'use strict';

module.exports = /*  @ngInject */
  function opportunitiesController($rootScope, $scope, $state, $filter, $mdDialog, $mdSelect, opportunitiesService, opportunityFiltersService, chipsService, filtersService, userService) {

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

    // Expose public methods
    vm.closeEditModal = closeEditModal;
    vm.closeModal = closeModal;
    vm.deleteSavedFilter = deleteSavedFilter;
    vm.editFilterModal = editFilterModal;
    vm.placeholderSelect = placeholderSelect;
    vm.resetTradeChannels = resetTradeChannels;

    init();

    // **************
    // PUBLIC METHODS
    // **************

    function placeholderSelect(data) {
      vm.hintTextPlaceholder = data;
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

    function resetTradeChannels() {
      var arr = vm.filtersService.model.tradeChannels[vm.filtersService.model.selected.premiseType];
      for (var i = 0; i < arr.length; i++) {
        var name =  'tradeChannel' + arr[i].name;
        vm.filtersService.model.selected[name] = false;
        vm.chipsService.removeChip(name);
      }
    }

    // ***************
    // PRIVATE METHODS
    // ***************

    /* Not longer necesary?
      // Add chip for inline search vaaddAutocompleteChiplue watchers
      function addInlineSearchChip(val) {
        if (typeof val === 'string' && val !== '') {
          vm.chipsService.addAutocompleteChip(val, 'searchText');
        }
      }

      // Watch for inline search value changes
      $scope.$watch('o.filtersService.model.selected.brand', function (val) { addInlineSearchChip(val); });
      $scope.$watch('o.filtersService.model.store', function (val) { addInlineSearchChip(val); });
      $scope.$watch('o.filtersService.model.chain', function (val) { addInlineSearchChip(val); });
    */

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
