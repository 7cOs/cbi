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
}

module.exports =
  angular.module('cf.common.components.filter', [])
  .component('filter', {
    templateUrl: './app/shared/components/filter/filter.html',
    controller: FilterController,
    controllerAs: 'filter'
  });
