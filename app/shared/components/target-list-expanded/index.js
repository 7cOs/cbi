'use strict';

function ExpandedTargetListController($state, $q, userService, targetListService) {

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
  vm.totalOpportunitesChevron = true;

  // Expose public methods
  vm.ratio = ratio;
  vm.selector = selector;
  vm.sortBy = sortBy;

  init();

  // **************
  // PUBLIC METHODS
  // **************

  function ratio(closed, total) {
    var result = closed / total * 100;
    return result;
  };

  function selector(tab) {
    vm.buttonState = tab;
  };

  function sortBy(property) {
    vm.reverse = (vm.sortProperty === property) ? !vm.reverse : false;
    vm.sortProperty = property;

    vm.listChevron = (property === 'name') ? !vm.listChevron : vm.listChevron;
    vm.collaboratorsChevron = (property === 'members.length') ? !vm.collaboratorsChevron : vm.collaboratorsChevron;
    vm.lastUpdatedChevron = (property === 'created') ? !vm.lastUpdatedChevron : vm.lastUpdatedChevron;
    vm.closedOpportunitiesChevron = (property === 'closedOpportunities') ? !vm.closedOpportunitiesChevron : vm.closedOpportunitiesChevron;
    vm.totalOpportunitesChevron = (property === 'Opportunites') ? !vm.totalOpportunitesChevron : vm.totalOpportunitesChevron;
    vm.depletionsChevron = (property === 'depletions') ? !vm.depletionsChevron : vm.depletionsChevron;
  };

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
        console.log(response);
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
