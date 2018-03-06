'use strict';

module.exports = /*  @ngInject */
  function targetListController($scope, $state, targetListService, userService, loaderService) {

    // ****************
    // CONTROLLER SETUP
    // ****************

    // Initial variables
    var vm = this;

    // Services
    vm.loaderService = loaderService;

    // Defaults
    vm.pageName = $state.current.name;
    vm.nameLengthForTooltip = 34;

    // Expose public methods
    vm.ratio = ratio;
    vm.tabFilter = tabFilter;
    vm.goToTab = goToTab;
    vm.recordsShownLength = recordsShownLength;
    vm.analyticsActionForType = analyticsActionForType;

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
      $state.go('lists', {
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

    function recordsShownLength (length) {
      if (length > 5) {
        return 5;
      } else {
        return length;
      }
    }

    function analyticsActionForType(type) {
      if (type === 'Shared with Me') {
        return 'Shared List';
      } else {
        return 'My List';
      }
    }

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
      if (userService.model.targetLists) {
        userService.model.targetLists = null;
      }

      loaderService.openLoader();
      userService.getTargetLists(userService.model.currentUser.employeeID).then(function(data) {
        loaderService.closeLoader();
        userService.model.targetLists = data;
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
        vm.types.mine.records = filterTargetLists(mine);
        vm.types.mine.total = mine.length;
        userService.model.targetLists.owned = mine;

        vm.types.shared.records = filterTargetLists(shared);
        vm.types.shared.total = shared.length;
        vm.types.archived.records = filterTargetLists(archived);
        vm.types.archived.total = archived.length;
      }, function(reason) {
        console.log('Error: ' + reason);
        loaderService.closeLoader();
      });

    }
  };
