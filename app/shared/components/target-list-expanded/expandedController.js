'use strict';

module.exports = /*  @ngInject */
  function expandedController($state, $scope, $filter, $mdDialog, $q, $timeout, userService, targetListService, loaderService, toastService) {

    // ****************
    // CONTROLLER SETUP
    // ****************

    // Initial variables
    var vm = this;

    // Services
    vm.userService = userService;
    vm.targetListService = targetListService;
    vm.loaderService = loaderService;

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
      collaborators: [],
      targetListShares: []
    };
    vm.totalOpportunitesChevron = true;
    vm.selected = [];
    vm.buttonDisabled = false;
    vm.selectedTab = 0;
    vm.allowDelete = true;
    vm.deleteError = false;

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
      var share = {
        employeeId: e.employeeId,
        permissionLevel: 'Collaborate'
      };
      vm.newList.targetListShares.push(share);
    }

    function archiveTargetList() {
      var selectedTargetLists = vm.selected,
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

        toastService.showToast('archive', selectedTargetLists);
        vm.selected = [];
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
      vm.newList = {
        name: '',
        description: '',
        opportunities: [],
        collaborators: []
      };
      $mdDialog.hide();
    }

    function deleteTargetList() {
      var deleteTargetListPromises = [],
          selectedItems = vm.selected;

      checkDelete();

      if (vm.allowDelete) {
        // get selected target list ids and their promises
        deleteTargetListPromises = selectedItems.map(function(targetList) {
          return targetListService.deleteTargetList(targetList.id);
        });

        // run all delete requests at the same time
        $q.all(deleteTargetListPromises).then(function(response) {
          // splice from list arr
          angular.forEach(selectedItems, function(item, key) {
            if (item.archived) {
              userService.model.targetLists.ownedNotArchived--;
            }
            userService.model.targetLists.owned.splice(userService.model.targetLists.owned.indexOf(item), 1);
          });
        }).then(vm.selected = []);

        toastService.showToast('delete', selectedItems);
      }
    }

    function exists(item, list) {
      return list.indexOf(item) > -1;
    }

    function ratio(closed, total) {
      var result = closed / total * 100;
      return result;
    }

    function saveNewList(e) {
      vm.buttonDisabled = true;
      userService.addTargetList(vm.newList).then(function(response) {
        targetListService.addTargetListShares(response.id, vm.newList.targetListShares);
        closeModal();
        vm.buttonDisabled = false;
        vm.newList = {
          name: '',
          description: '',
          opportunities: [],
          collaborators: []
        };

        // We should be getting these values in the response
        response.createdAt = response.dateCreated;
        response.opportunitiesSummary = {};
        response.opportunitiesSummary.closedOpportunitiesCount = 0;
        response.opportunitiesSummary.opportunitiesCount = 0;
        response.opportunitiesSummary.totalClosedDepletions = 0;

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
      userService.model.targetLists = null;
      loaderService.openLoader();
      vm.allowDelete = true;
      vm.deleteError = false;

      var promise1 = userService.getTargetLists(userService.model.currentUser.employeeID);
      var promise2 = userService.getTargetLists(userService.model.currentUser.employeeID, '?archived=true');

      var promiseArray = [promise1, promise2];

      $q.all(promiseArray).then(function(data) {
        loaderService.closeLoader();

        var combinedTargetList = {
          'owned': [],
          'sharedWithMe': [],
          'sharedArchivedCount': 0,
          'sharedNotArchivedCount': 0,
          'ownedNotArchived': 0,
          'ownedArchived': 0
        };

        for (var i = 0; i < data.length; i++) {
          for (var j = 0; j < data[i].owned.length; j++) {

            combinedTargetList.owned.push(data[i].owned[j]);

            if (data[i].owned[j].archived) {
              combinedTargetList.ownedArchived++;
            } else {
              combinedTargetList.ownedNotArchived++;
            }
          }

          for (j = 0; j < data[i].sharedWithMe.length; j++) {
            combinedTargetList.sharedWithMe.push(data[i].sharedWithMe[j]);

            if (data[i].sharedWithMe[j].archived) {
              combinedTargetList.sharedArchivedCount++;
            } else {
              combinedTargetList.sharedNotArchivedCount++;
            }
          };
        }

        userService.model.targetLists = combinedTargetList;
      });
    }

    function checkDelete() {
      var keepGoing = true;

      vm.selected.forEach(function(item, key) {
        if (keepGoing) {
          if (item.collaborators.length > 1) {
            vm.allowDelete = false;
            vm.keepGoing = false;
            vm.deleteError = true;
            toastService.showToast('deleteError');
            $timeout(function() {
              vm.allowDelete = true;
              vm.deleteError = false;
            }, 3500);
          } else {
            vm.allowDelete = true;
          }
        }
      });
    }
  };
