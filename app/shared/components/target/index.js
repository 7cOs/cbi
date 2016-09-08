'use strict';

function TargetListController($scope, $state, targetListService, userService) {

  // ****************
  // CONTROLLER SETUP
  // ****************

  // Initial variables
  var vm = this;

  // Defaults
  vm.pageName = $state.current.name;

  // Expose public methods
  vm.ratio = ratio;
  vm.tabFilter = tabFilter;

  // tab names
  vm.types = {
    'mine': {
      'name': 'My Target Lists',
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

  init();

  // **************
  // PUBLIC METHODS
  // **************

  // Only shows Target List tabs needed on the page
  function tabFilter(tab) {
    if (tab.name === 'Archived') {
      return false;
    }
    return true;
  }

  function ratio(closed, total) {
    var result = closed / total * 100;
    return result;
  };

  // **************
  // PRIVATE METHODS
  // **************

  function curriedFilterByArchived(yes) {
    return function(item) {
      /* eslint eqeqeq: 0 */
      /* needed this so as to allow coercion */
      return item.archived == yes;
    };
  }

  function init() {
    userService.getTargetLists(userService.model.currentUser.personID).then(function(data) {
      // split things into categories, but ignore archived
      var mine = data.owned.filter(curriedFilterByArchived(false));
      var shared = data.sharedWithMe.filter(curriedFilterByArchived(false));

      // Get archived
      var archived = data.owned.filter(curriedFilterByArchived(true));

      // Uncomment this if we want shared archived included with my archived
      // archived = archived.concat(
      //   data.sharedWithMe.filter(curriedFilterByArchived(true))
      // );

      // Send to model
      vm.types.mine.records = mine.slice(0, 5);
      vm.types.mine.total = mine.length;
      vm.types.shared.records = shared.slice(0, 5);
      vm.types.shared.total = shared.length;
      vm.types.archived.records = archived.slice(0, 5);
      vm.types.archived.total = archived.length;
    });
  }
}

module.exports =
  angular.module('cf.common.components.target', [])
  .component('target', {
    templateUrl: './app/shared/components/target/target.html',
    controller: TargetListController,
    controllerAs: 'target'
  });
