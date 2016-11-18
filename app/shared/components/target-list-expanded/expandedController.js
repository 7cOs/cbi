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
    vm.allowDelete = true;
    vm.buttonDisabled = false;
    vm.buttonState = 'named';
    vm.closedOpportunitiesChevron = false;
    vm.collaboratorsChevron = false;
    vm.deleteError = false;
    vm.depletionsChevron = true;
    vm.lastUpdatedChevron = false;
    vm.listChevron = true;
    vm.newList = {
      name: '',
      description: '',
      opportunities: [],
      collaborators: [],
      targetListShares: [],
      collaborateAndInvite: false
    };
    vm.pageName = $state.current.name;
    vm.selected = [];
    vm.selectedTab = 0;
    vm.targetListAuthor = '';
    vm.totalOpportunitesChevron = true;

    // Expose public methods
    vm.addCollaborator = addCollaborator;
    vm.archiveTargetList = archiveTargetList;
    vm.closeModal = closeModal;
    vm.createNewList = createNewList;
    vm.createTargetList = createTargetList;
    vm.deleteTargetList = deleteTargetList;
    vm.exists = exists;
    vm.findTargetListAuthor = findTargetListAuthor;
    vm.isChecked = isChecked;
    vm.isCheckedArchived = isCheckedArchived;
    vm.ratio = ratio;
    vm.saveNewList = saveNewList;
    vm.searchOpportunities = searchOpportunities;
    vm.selector = selector;
    vm.sortBy = sortBy;
    vm.toggle = toggle;
    vm.toggleAll = toggleAll;

    init();

    // **************
    // PUBLIC METHODS
    // **************

    function addCollaborator(e) {
      vm.newList.collaborators.push(e);
      var share = {
        employeeId: e.employeeId
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

          userService.model.targetLists.archived.unshift(item);

          userService.model.targetLists.ownedArchived++;
          userService.model.targetLists.ownedNotArchived--;
        });

        toastService.showToast('archived', selectedTargetLists);
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
      vm.newList = {
        name: '',
        description: '',
        opportunities: [],
        collaborators: [],
        targetListShares: [],
        collaborateAndInvite: false
      };
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
        collaborators: [],
        collaborateAndInvite: false
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
              userService.model.targetLists.archived.splice(userService.model.targetLists.archived.indexOf(item), 1);
            }
            userService.model.targetLists.owned.splice(userService.model.targetLists.owned.indexOf(item), 1);
          });
        }).then(vm.selected = []);

        toastService.showToast('deleted', selectedItems);
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

      if (vm.newList.name.length > 40) return;

      vm.buttonDisabled = true;

      // create collaborator payload
      var newPayload = [];
      for (var i = 0; i < vm.newList.collaborators.length; i++) {
        newPayload.push({
          employeeId: vm.newList.collaborators[i].employeeId
        });
      }

      // Create target list
      userService.addTargetList(vm.newList).then(function(response) {
        closeModal();
        vm.buttonDisabled = false;

        // add collaborators to newly created target list
        return targetListService.addTargetListShares(response.id, newPayload);
      })
      .then(function(addCollaboratorResponse) {
        userService.model.targetLists.owned[0].collaborators = addCollaboratorResponse.data;

        // reset model
        vm.newList = {
          name: '',
          description: '',
          opportunities: [],
          collaborators: [],
          collaborateAndInvite: false
        };
      });
    }

    function searchOpportunities(e) {
      closeModal();
      $state.go('opportunities');
    }

    function selector(tab) {
      vm.selected = [];
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
        return vm.selected.length === vm.userService.model.targetLists.ownedNotArchivedTargetLists.length;
      } else {
        return false;
      }
    };

    function isCheckedArchived() {
      // If the promise isn't resolved returns false
      if (vm.userService.model.targetLists) {
        return vm.selected.length === vm.userService.model.targetLists.archived.length;
      } else {
        return false;
      }
    };

    // Select or deselect all list items
    function toggleAll(tab) {
      if (tab === 'named') {
        if (vm.selected.length === vm.userService.model.targetLists.ownedNotArchivedTargetLists.length) {
          vm.selected = [];
        } else if (vm.selected.length === 0 || vm.selected.length > 0) {
          vm.selected = vm.userService.model.targetLists.ownedNotArchivedTargetLists.slice(0);
        }
      }

      if (tab === 'archived') {
        if (vm.selected.length === vm.userService.model.targetLists.archived.length) {
          vm.selected = [];
        } else if (vm.selected.length === 0 || vm.selected.length > 0) {
          vm.selected = vm.userService.model.targetLists.archived.slice(0);
        };
      }
    };

    function findTargetListAuthor(collaborators) {
      var author;
      angular.forEach(collaborators, function(value, key) {
        if (value.permissionLevel === 'author') {
          author = value.user.firstName + ' ' + value.user.lastName;
        }
      });

      return author;
    }

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
          'archived': [],
          'owned': [],
          'ownedNotArchivedTargetLists': [],
          'sharedWithMe': [],
          'sharedArchivedCount': 0,
          'sharedNotArchivedCount': 0,
          'ownedNotArchived': 0,
          'ownedArchived': 0
        };

        for (var i = 0; i < data.length; i++) {
          for (var j = 0; j < data[i].owned.length; j++) {

            data[i].owned[j].targetListAuthor = 'current user';

            if (data[i].owned[j].archived) {
              combinedTargetList.ownedArchived++;
              combinedTargetList.archived.push(data[i].owned[j]);

            } else {
              combinedTargetList.ownedNotArchived++;
              combinedTargetList.ownedNotArchivedTargetLists.push(data[i].owned[j]);
            }
          }

          for (j = 0; j < data[i].sharedWithMe.length; j++) {
            vm.targetListAuthor = findTargetListAuthor(data[i].sharedWithMe[j].collaborators);

            data[i].sharedWithMe[j].targetListAuthor = vm.targetListAuthor;

            combinedTargetList.sharedWithMe.push(data[i].sharedWithMe[j]);

            if (data[i].sharedWithMe[j].archived) {
              combinedTargetList.sharedArchivedCount++;
              combinedTargetList.archived.push(data[i].sharedWithMe[j]);

            } else {
              combinedTargetList.sharedNotArchivedCount++;
            }
          };
        }

        userService.model.targetLists = combinedTargetList;
        console.log(userService.model.targetLists);
      });
    }

    function checkDelete() {
      var keepGoing = true;

      vm.selected.forEach(function(item, key) {
        if (keepGoing) {
          if (item.collaborators && item.collaborators.length > 1) {
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
