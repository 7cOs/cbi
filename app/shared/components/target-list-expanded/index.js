'use strict';

function ExpandedTargetListController($state, $scope, $filter, $mdDialog, $q, userService, targetListService) {

  // ****************
  // CONTROLLER SETUP
  // ****************

  // Initial variables
  var vm = this;

  // Services
  vm.userService = userService;

  // Defaults
  vm.buttonState = 'named';
  vm.closedOpportunitiesChevron = false;
  vm.collaboratorsChevron = false;
  vm.depletionsChevron = true;
  vm.pageName = $state.current.name;
  vm.lastUpdatedChevron = false;
  vm.listChevron = true;
  vm.newList = {
    name: '',
    description: '',
    opportunities: [],
    collaborators: []
  };
  vm.totalOpportunitesChevron = true;
  vm.selected = [];
  vm.buttonDiabled = false;
  vm.selectedTab = 0;

  // Expose public methods
  vm.archiveTargetList = archiveTargetList;
  vm.createNewList = createNewList;
  vm.createTargetList = createTargetList;
  vm.closeModal = closeModal;
  vm.deleteTargetList = deleteTargetList;
  vm.exists = exists;
  vm.ratio = ratio;
  vm.saveNewList = saveNewList;
  vm.searchOpportunities = searchOpportunities;
  vm.selector = selector;
  vm.sortBy = sortBy;
  vm.toggle = toggle;
  vm.isChecked = isChecked;
  vm.toggleAll = toggleAll;
  vm.addCollaborator = addCollaborator;

  init();

  // **************
  // PUBLIC METHODS
  // **************

  function addCollaborator(e) {
    vm.newList.collaborators.push(e);
    console.log(vm.newList.collaborators);
  }

  function archiveTargetList() {
    var selectedTargetLists = $filter('filter')(userService.model.targetLists.owned, {selected: true}),
        archiveTargetListPromises = [];

    // get selected target list ids and their promises
    archiveTargetListPromises = selectedTargetLists.map(function(targetList) {
      return targetListService.updateTargetList(targetList.id, {archived: true});
    });

    // run all archive requests at the same time
    $q.all(archiveTargetListPromises).then(function(response) {
      angular.forEach(selectedTargetLists, function(item, key) {
        // this may work or i may need to do the object. cant test due to api issues.
        item.archived = true;

        userService.model.targetLists.ownedArchived++;
        userService.model.targetLists.ownedNotArchived--;
      });

      console.log(userService.model.targetLists);
    });
  }

  function createNewList(e) {
    var parentEl = angular.element(document.body);
    $mdDialog.show({
      clickOutsideToClose: true,
      parent: parentEl,
      scope: $scope.$new(),
      targetEvent: e,
      templateUrl: './app/shared/components/target-list-expanded/create-target-list-modal.html'
    });
  }

  function createTargetList(e) {
    var parentEl = angular.element(document.body);
    $mdDialog.show({
      clickOutsideToClose: true,
      parent: parentEl,
      scope: $scope.$new(),
      targetEvent: e,
      templateUrl: './app/shared/components/target-list-expanded/target-list-switch-modal.html'
    });
  }

  function closeModal() {
    $mdDialog.hide();
  }

  function deleteTargetList() {
    var deleteTargetListPromises = [],
        selectedItems = vm.selected;

    // get selected target list ids and their promises
    deleteTargetListPromises = selectedItems.map(function(targetList) {
      return targetListService.deleteTargetList(targetList.id);
    });

    // run all delete requests at the same time
    $q.all(deleteTargetListPromises).then(function(response) {
      // splice from list arr
      angular.forEach(selectedItems, function(item, key) {
        userService.model.targetLists.owned.splice(userService.model.targetLists.owned.indexOf(item), 1);
      });
    }).then(vm.selected = []);
  }

  function exists(item, list) {
    return list.indexOf(item) > -1;
  }

  function ratio(closed, total) {
    var result = closed / total * 100;
    return result;
  }

  function saveNewList(e) {
    vm.buttonDiabled = true;
    userService.addTargetList(vm.newList).then(function(response) {
      closeModal();
      vm.buttonDiabled = false;
      vm.newList = {
        name: '',
        description: '',
        opportunities: [],
        collaborators: []
      };
      userService.model.targetLists.owned.unshift(response);
      userService.model.targetLists.ownedArchived++;
      userService.model.targetLists.ownedNotArchived--;
    });
  }

  function searchOpportunities(e) {
    closeModal();
    $state.go('opportunities');
  }

  function selector(tab) {
    vm.buttonState = tab;
  }

  function sortBy(property) {
    vm.reverse = (vm.sortProperty === property) ? !vm.reverse : false;
    vm.sortProperty = property;

    vm.listChevron = (property === 'name') ? !vm.listChevron : vm.listChevron;
    vm.collaboratorsChevron = (property === 'members.length') ? !vm.collaboratorsChevron : vm.collaboratorsChevron;
    vm.lastUpdatedChevron = (property === 'created') ? !vm.lastUpdatedChevron : vm.lastUpdatedChevron;
    vm.closedOpportunitiesChevron = (property === 'closedOpportunities') ? !vm.closedOpportunitiesChevron : vm.closedOpportunitiesChevron;
    vm.totalOpportunitesChevron = (property === 'Opportunites') ? !vm.totalOpportunitesChevron : vm.totalOpportunitesChevron;
    vm.depletionsChevron = (property === 'depletions') ? !vm.depletionsChevron : vm.depletionsChevron;
  }

  function toggle(item, list) {
    var idx = list.indexOf(item);
    if (idx > -1) {
      list.splice(idx, 1);
    } else {
      list.push(item);
    }
  }

  // Check if all items are selected
  function isChecked() {
    // If the promise isn't resolved returns false
    if (vm.userService.model.targetLists) {
      return vm.selected.length === vm.userService.model.targetLists.owned.length;
    } else {
      return false;
    }
  };

  // Select or deselect all list items
  function toggleAll() {
    if (vm.selected.length === vm.userService.model.targetLists.owned.length) {
      vm.selected = [];
    } else if (vm.selected.length === 0 || vm.selected.length > 0) {
      vm.selected = vm.userService.model.targetLists.owned.slice(0);
    }
  };

  // ***************
  // PRIVATE METHODS
  // ***************

  function init() {

    vm.selectedTab = $state.params.obj.index;

    targetListService.model.currentList = {};
    userService.getTargetLists(userService.model.currentUser.employeeID, {'type': 'targetLists'}).then(function(data) {
      var ownedPromises = [],
          sharedPromises = [];

      userService.model.targetLists = data;

      // get collaborators for owned target lists
      ownedPromises = userService.model.targetLists.owned.map(function(targetList) {
        return targetListService.getTargetListShares(targetList.id);
      });

      $q.all(ownedPromises).then(function(response) {
        angular.forEach(userService.model.targetLists.owned, function(targetList, key) {
          targetList.collaborators = response[key].data;
        });
      });

      // get collaborators for shared target lists
      sharedPromises = userService.model.targetLists.sharedWithMe.map(function(targetList) {
        return targetListService.getTargetListShares(targetList.id);
      });

      $q.all(sharedPromises).then(function(response) {
        angular.forEach(userService.model.targetLists.sharedWithMe, function(targetList, key) {
          targetList.collaborators = response[key].data;
        });
      });
    });
  }

}

module.exports =
  angular.module('cf.common.components.expanded', [])
  .component('expanded', {
    templateUrl: './app/shared/components/target-list-expanded/expanded.html',
    controller: ExpandedTargetListController,
    controllerAs: 'expanded'
  });
