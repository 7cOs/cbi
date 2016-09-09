'use strict';

module.exports = /*  @ngInject */
  function opportunitiesController($rootScope, $scope, $state, $filter, $mdDialog, $mdSelect, opportunitiesService, opportunityFiltersService, chipsService, filtersService, userService) {

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
    vm.applyFilterArr = applyFilterArr;
    vm.applyFilterMulti = applyFilterMulti;
    vm.closeEditModal = closeEditModal;
    vm.closeModal = closeModal;
    vm.deleteSavedFilter = deleteSavedFilter;
    vm.editFilterModal = editFilterModal;
    vm.modalSaveOpportunityFilter = modalSaveOpportunityFilter;
    vm.saveFilter = saveFilter;
    vm.placeholderSelect = placeholderSelect;
    vm.hoverState = hoverState;
    vm.resetFilters = resetFilters;
    vm.closeSelect = closeSelect;
    vm.resetTradeChannels = resetTradeChannels;
    vm.appendDoneButton = appendDoneButton;
    vm.closeDoneButton = closeDoneButton;

    init();

    // **************
    // PUBLIC METHODS
    // **************

    function appendDoneButton() {
      // We have to do this so the done button is a sibling of md-select-menu
      angular.element(document.getElementsByClassName('md-select-menu-container'))
        .append('<div class="done-btn">Done</div>').bind('click', function(e) {
          $mdSelect.hide();
        });
    }

    function closeDoneButton() {
      angular.element(document.getElementsByClassName('done-btn')).remove();
    }

    function closeSelect() {
      $mdSelect.hide();
    }

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

    function applyFilterMulti(model, result, filter) {
      vm.chipsService.removeChip('opportunitiesTypes');
      if (result.length === 0 || result[0] === 'All Types' && result.length === 1) {
        vm.chipsService.addChip('All Types', 'opportunitiesTypes', false, false);
        vm.filtersService.model.selected[filter] = ['All Types'];
        vm.filtersService.model.selected.opportunityTypes = ['All Types'];

      } else {
        var chips = [];
        for (var i = 0; i < result.length; i++) {
          if (result[i] !== 'All Types') {
            vm.chipsService.addChip(result[i], 'opportunitiesTypes', false);
            chips.push(result[i]);
          }
        }
        vm.filtersService.model.selected[filter] = chips;
        vm.filtersService.model.selected.opportunityTypes = chips;
      }

    }
    function applyFilterArr(model, result, filter) {
      if (model.indexOf(result) > -1) {
        vm.filtersService.model[filter] = '';
      } else {
        result = $filter('lowercase')(result);
        vm.chipsService.addAutocompleteChip(result, filter);
        vm.filtersService.model[filter] = '';
        model.push(result);
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

    function resetFilters() {
      // reset all chips and filters
      chipsService.resetChipsFilters(chipsService.model);
      filtersService.resetFilters();
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
      chipsService.resetChipsFilters(chipsService.model);

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
