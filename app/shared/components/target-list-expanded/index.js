'use strict';

function ExpandedTargetListController($state, $scope, $mdDialog, $q, userService, targetListService) {

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
  vm.newList = {};
  vm.totalOpportunitesChevron = true;

  // Expose public methods
  vm.createNewList = createNewList;
  vm.createTargetList = createTargetList;
  vm.closeModal = closeModal;
  vm.ratio = ratio;
  vm.saveNewList = saveNewList;
  vm.searchOpportunities = searchOpportunities;
  vm.selector = selector;
  vm.sortBy = sortBy;

  init();

  // **************
  // PUBLIC METHODS
  // **************

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

  function ratio(closed, total) {
    var result = closed / total * 100;
    return result;
  }

  function saveNewList(e) {
    userService.addTargetList(vm.newList).then(function(response) {
      console.log('happy happy');
    });
  }

  function searchOpportunities(e) {
    console.log('hi 2');
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

  // ***************
  // PRIVATE METHODS
  // ***************

  function init() {
    userService.getTargetLists('1').then(function(data) {
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
