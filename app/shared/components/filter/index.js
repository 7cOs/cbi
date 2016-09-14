'use strict';

function FilterController($state, $scope, $mdDialog, $mdSelect, chipsService, filtersService, userService) {

  // ****************
  // CONTROLLER SETUP
  // ****************

  // Initial variables
  var vm = this;
  vm.opportunities = true;

  vm.chipsService = chipsService;
  vm.filtersService = filtersService;

  vm.appendDoneButton = appendDoneButton;
  vm.applyFilterArr = applyFilterArr;
  vm.applyFilterMulti = applyFilterMulti;
  vm.closeDoneButton = closeDoneButton;
  vm.closeModal = closeModal;
  vm.expandDropdown = expandDropdown;
  vm.hoverState = hoverState;
  vm.modalSaveOpportunityFilter = modalSaveOpportunityFilter;
  vm.resetFilters = resetFilters;
  vm.saveFilter = saveFilter;

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

  function applyFilterArr(model, result, filter) {
    if (model.indexOf(result) > -1) {
      vm.filtersService.model[filter] = '';
    } else {
      vm.chipsService.addAutocompleteChip(result, filter);
      vm.filtersService.model[filter] = '';
      model.push(result);
    }
  }

  function applyFilterMulti(model, result, filter) {
    vm.chipsService.removeChip('opportunitiesTypes');
    if (result.length === 0) {
      vm.chipsService.addChip('All Types', 'opportunitiesTypes', false);
      vm.filtersService.model.selected[filter] = ['All Types'];
      vm.filtersService.model.opportunityTypes = ['All Types'];

    } else {
      for (var i = 0; i < result.length; i++) {
        vm.chipsService.addChip(result[i], 'opportunitiesTypes', false);
      }
      vm.filtersService.model.selected[filter] = result;
    }

  }

  function closeDoneButton() {
    angular.element(document.getElementsByClassName('done-btn')).remove();
  }

  function closeModal() {
    $mdDialog.hide();
  }

  function expandDropdown() {
    if ($state.current.name === 'target-list-detail') {
      vm.opportunities ? vm.opportunities = false : vm.opportunities = true;
    }

    filtersService.model.expanded ? filtersService.model.expanded = false : filtersService.model.expanded = true;
  }

  function hoverState(icon) {
    if (icon === 'reset') {
      vm.isHoveringReset = !vm.isHoveringReset;
    } else {
      vm.isHoveringSave = !vm.isHoveringSave;
    }
  }

  function modalSaveOpportunityFilter(ev) {
    var parentEl = angular.element(document.body);
    $mdDialog.show({
      clickOutsideToClose: false,
      parent: parentEl,
      scope: $scope.$new(),
      targetEvent: ev,
      templateUrl: './app/shared/components/filter/modal.html'
    });
  }

  function resetFilters() {
    // reset all chips and filters
    chipsService.resetChipsFilters(chipsService.model);

    // userService.model.opportunityFilters = null;
    filtersService.resetFilters();
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

  // **************
  // PRIVATE METHODS
  // **************

  function init() {
    if ($state.current.name === 'target-list-detail') {
      vm.opportunities = true;
    } else {
      vm.opportunities = false;
    }
  }
}

module.exports =
  angular.module('cf.common.components.filter', [])
  .component('filter', {
    templateUrl: './app/shared/components/filter/filter.html',
    controller: FilterController,
    controllerAs: 'filter'
  });
