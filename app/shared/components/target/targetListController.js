'use strict';

module.exports = /*  @ngInject */
  function targetListController($scope, $state, targetListService, listsApiService, listsTransformerService, userService, loaderService) {

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
        'name': 'My Lists',
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

    function init() {
      if (userService.model.targetLists) {
        userService.model.targetLists = null;
      }

      loaderService.openLoader();
      const currentUserEmployeeID = userService.model.currentUser.employeeID;
      listsApiService.getLists().toPromise().then((response) => {
        let lists = userService.model.targetLists = listsTransformerService.getV2ListsSummary(response, currentUserEmployeeID);
        userService.model.targetLists = lists;

        vm.types.mine.records = lists.ownedNotArchivedTargetLists;
        vm.types.mine.total = lists.ownedNotArchived;
        vm.types.shared.records = lists.sharedWithMe;
        vm.types.shared.total = lists.sharedNotArchivedCount;
        vm.types.archived.records = lists.archived;
        vm.types.archived.total = lists.archived.length;
        loaderService.closeLoader();
      }, (error) => {
        console.log('Error: ' + error);
        loaderService.closeLoader();
      });
    }
  };
