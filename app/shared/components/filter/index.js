'use strict';

function FilterController($state, $scope, $mdSelect, chipsService, filtersService) {

  // ****************
  // CONTROLLER SETUP
  // ****************

  // Initial variables
  var vm = this;
  vm.opportunities = true;

  vm.chipsService = chipsService;
  vm.filtersService = filtersService;

  vm.appendDoneButton = appendDoneButton;
  vm.closeDoneButton = closeDoneButton;
  vm.expandDropdown = expandDropdown;

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

  function expandDropdown() {
    if ($state.current.name === 'target-list-detail') {
      vm.opportunities ? vm.opportunities = false : vm.opportunities = true;
    }

    filtersService.model.expanded ? filtersService.model.expanded = false : filtersService.model.expanded = true;
  }

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
