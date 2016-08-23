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
    opportunities: []
  };
  vm.totalOpportunitesChevron = true;

  // Expose public methods
  vm.archiveTargetList = archiveTargetList;
  vm.createNewList = createNewList;
  vm.createTargetList = createTargetList;
  vm.closeModal = closeModal;
  vm.deleteTargetList = deleteTargetList;
  vm.exists = exists;
  vm.openTLDetails = openTLDetails;
  vm.ratio = ratio;
  vm.saveNewList = saveNewList;
  vm.searchOpportunities = searchOpportunities;
  vm.selector = selector;
  vm.sortBy = sortBy;
  vm.toggle = toggle;

  init();

  // **************
  // PUBLIC METHODS
  // **************

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
    var selectedItems = $filter('filter')(userService.model.targetLists.owned, {selected: true}),
        deleteTargetListPromises = [];

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
    });
  }

  function exists(item, list) {
    return list.indexOf(item) > -1;
  }

  function openTLDetails(listId) {
    targetListService.model.currentList.id = listId;
    $state.go('target-list-detail');
  }

  function ratio(closed, total) {
    var result = closed / total * 100;
    return result;
  }

  function saveNewList(e) {
    userService.addTargetList(vm.newList).then(function(response) {
      closeModal();
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

  // ***************
  // PRIVATE METHODS
  // ***************

  function init() {
    // userService.getTargetLists('1601', {'type': 'targetLists'}).then(function(data) {
    userService.getTargetLists(userService.model.currentUser.personID, {'type': 'targetLists'}).then(function(data) {
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
  angular.module('orion.common.components.expanded', [])
  .component('expanded', {
    templateUrl: './app/shared/components/target-list-expanded/expanded.html',
    controller: ExpandedTargetListController,
    controllerAs: 'expanded'
  });
