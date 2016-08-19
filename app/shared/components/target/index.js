'use strict';

function TargetListController($scope, $state, userService) {

  // ****************
  // CONTROLLER SETUP
  // ****************

  // Initial variables
  var vm = this;

  // Defaults
  vm.pageName = $state.current.name;

  // Expose public methods
  vm.ratio = ratio;

  // tab names
  vm.types = {
    'mine': {
      'name': 'My Target List',
      'records': [],
      'total': 0
    },
    'shared': {
      'name': 'Shared with Me',
      'records': [],
      'total': 0
    },
    'archived': {
      'name': 'Archived',
      'records': [],
      'total': 0
    }
  };

  userService.getTargetLists('1').then(function(data) {
    console.log('response', data);

    vm.types.mine.records = data.owned.slice(0, 4);
    vm.types.mine.total = data.owned.length;
    vm.types.shared.records = data.sharedWithMe.slice(0, 4);
    vm.types.shared.total = data.sharedWithMe.length;
  });

  // **************
  // PUBLIC METHODS
  // **************

  function ratio(closed, total) {
    var result = closed / total * 100;
    return result;
  };
}

module.exports =
  angular.module('orion.common.components.target', [])
  .component('target', {
    templateUrl: './app/shared/components/target/target.html',
    controller: TargetListController,
    controllerAs: 'target'
  });
