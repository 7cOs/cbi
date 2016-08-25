'use strict';

function ListDemoController($rootScope, $scope, $mdToast) {

  // ****************
  // CONTROLLER SETUP
  // ****************

  // Initial variables
  var vm = this,
      isDlgOpen;

  // Defaults
  vm.actionUndone = false;

  // Temp data
  vm.demoOpps = [{
    'id': '123',
    'store': {
      'id': 'dsd82',
      'name': 'Walmart',
      'address': '123 Elm St., San Jose, CA - 88779',
      'segmentation': 'A'
    },
    'impact': 3,
    'opCount': 4,
    'depletionsCYTD': 12657,
    'depletionTrendVsYA': 0.3
  }, {
    'id': '123',
    'store': {
      'id': 'dsd82',
      'name': 'Walgreens',
      'address': '9 Jones st., San Francisco, CA - 98989',
      'segmentation': 'A'
    },
    'impact': 5,
    'opCount': 9,
    'depletionsCYTD': 1002,
    'depletionTrendVsYA': -5
  }];

  // Expose public methods
  vm.actionOverlay = actionOverlay;
  vm.displayBrandIcon = displayBrandIcon;
  vm.exists = exists;
  vm.isChecked = isChecked;
  vm.toggle = toggle;
  vm.selected = [];
  vm.topLevelToast = topLevelToast;
  vm.undoAction = undoAction;
  vm.closeToast = closeToast;
  vm.multiFailState = true;

  // **************
  // PUBLIC METHODS
  // **************

  // Trigger top-level toast notification
  function topLevelToast(state) {
    if (state === 'fail') { vm.multiFailState = true; } else { vm.multiFailState = false; }
    $mdToast.show({
      hideDelay: 0,
      position: 'top left',
      scope: $scope.$new(),
      templateUrl: './app/shared/components/list-demo/toast.html'
    });
  };

  // Trigger action undo and close top-level toast
  function undoAction() {
    vm.selected = [];
    vm.actionUndone = true;
    if (isDlgOpen) return;
    $mdToast
      .hide()
      .then(function() {
        isDlgOpen = false;
      });
  }

  // Close top-level toast
  function closeToast() {
    if (isDlgOpen) return;
    $mdToast
      .hide()
      .then(function() {
        isDlgOpen = false;
      });
  };

  // Overlay Controls
  function actionOverlay(opportunity, state) {
    if (state === 'fail') { opportunity.failState = true; } else { opportunity.failState = false; }
    opportunity.toggled = !opportunity.toggled;
  };

  function displayBrandIcon(haystack, needle) {
    return haystack.indexOf(needle) !== -1;
  }

  // Check if list item exists and is selected
  function exists(item, list) {
    return list.indexOf(item) > -1;
  };

  // Check if all items are selected
  function isChecked() {
    return vm.selected.length === vm.demoOpps.length;
  };

  // Select or deselect individual list item
  function toggle(item, list) {
    var idx = list.indexOf(item);
    if (idx > -1) {
      list.splice(idx, 1);
    } else {
      list.push(item);
    }
  };
}

module.exports =
  angular.module('cf.common.components.list-demo', [])
  .component('listdemo', {
    templateUrl: './app/shared/components/list-demo/list-demo.html',
    controller: ListDemoController,
    controllerAs: 'listdemo'
  });
