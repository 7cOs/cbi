'use strict';

function TargetListController($scope, $state, targetListService, userService, loaderService) {

  // ****************
  // CONTROLLER SETUP
  // ****************

  // Initial variables
  var vm = this;

  // Services
  vm.loaderService = loaderService;

  // Defaults
  vm.pageName = $state.current.name;

  // Expose public methods
  vm.ratio = ratio;
  vm.tabFilter = tabFilter;
  vm.goToTab = goToTab;

  // tab names
  vm.types = {
    'mine': {
      'name': 'My Target Lists',
      'records': [],
      'total': 0,
      'index': 0
    },
    'shared': {
      'name': 'Shared with Me',
      'records': [],
      'total': 0,
      'index': 1
    },
    'archived': {
      'name': 'Archived',
      'records': [],
      'total': 0,
      'index': 2
    }
  };

  init();

  // **************
  // PUBLIC METHODS
  // **************

  // Link to a specific tab in target list pageName
  function goToTab(tab) {
    $state.go('target-lists', {
      obj: {
        index: tab
      }
    });
  }

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

  // Filter archived or deleted target lists
  function filterTargetLists(list) {
    var filteredList = [];
    angular.forEach(list, function(value, key) {
      if (!(value.deleted || value.archived)) {
        filteredList.push(value);
      }
    });
    return filteredList;
  }

  function init() {
    loaderService.openLoader();
    userService.getTargetLists(userService.model.currentUser.employeeID).then(function(data) {
      loaderService.closeLoader();
      // split things into categories, but ignore archived
      var mine = data.owned.filter(curriedFilterByArchived(false));
      if (data.sharedWithMe) var shared = data.sharedWithMe.filter(curriedFilterByArchived(false));

      // Get archived
      var archived = data.owned.filter(curriedFilterByArchived(true));

      // Uncomment this if we want shared archived included with my archived
      // archived = archived.concat(
      //   data.sharedWithMe.filter(curriedFilterByArchived(true))
      // );

      // Send to model
      vm.types.mine.records = filterTargetLists(mine).slice(0, 5);
      vm.types.mine.total = mine.length;
      vm.types.shared.records = filterTargetLists(shared).slice(0, 5);
      vm.types.shared.total = shared.length;
      vm.types.archived.records = filterTargetLists(archived).slice(0, 5);
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
