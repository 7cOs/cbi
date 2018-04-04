'use strict';

const CompassAlertModalEvents = require('../../../enums/compass-alert-modal-strings.enum').CompassAlertModalEvent;

module.exports = /*  @ngInject */
  function expandedController(analyticsService, $state, $scope, $filter, $mdDialog, $q, $timeout, userService, targetListService, loaderService, toastService, compassModalService) {

    // ****************
    // CONTROLLER SETUP
    // ****************

    // Initial variables
    var vm = this;

    // Services
    vm.userService = userService;
    vm.targetListService = targetListService;
    vm.loaderService = loaderService;
    vm.compassModalService = compassModalService;

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
    vm.selectedTab = 0; // updated by md-tabs directive
    vm.userSelectedTab = false;
    vm.sortProperty = 'dateOpportunitiesUpdated';
    vm.reverse = true;
    vm.targetListAuthor = '';
    vm.totalOpportunitesChevron = true;
    vm.archiveModalStringInputs = {
      'title': 'Are you sure?',
      'body': 'By archiving this list, only limited set functionality will remain available.',
      'rejectLabel': 'Cancel',
      'acceptLabel': 'Archive'};
    vm.deleteModalStringInputs =  {
      'title': 'Are you sure?',
      'body': 'Deleting a list cannot be undone. You\'ll lose all list store performance and opportunity progress.',
      'rejectLabel': 'Cancel',
      'acceptLabel': 'Delete'
    };
    vm.compassAlertModalAccept = CompassAlertModalEvents.Accept;

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
    vm.showArchiveModal = showArchiveModal;
    vm.showDeleteModal = showDeleteModal;

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
        analyticsService.trackEvent(
          targetListService.getAnalyticsCategory(targetList.permissionLevel, targetList.archived),
          'Archive Target List',
          targetList.id
        );
        return targetListService.updateTargetList(targetList.id, {archived: true});
      });

      // run all archive requests at the same time
      $q.all(archiveTargetListPromises).then(function(response) {
        angular.forEach(selectedTargetLists, function(item, key) {
          item.archived = true;

          userService.model.targetLists.archived.unshift(item);

          userService.model.targetLists.ownedArchived++;
          userService.model.targetLists.ownedNotArchived--;

          userService.model.targetLists.ownedNotArchivedTargetLists.splice(userService.model.targetLists.ownedNotArchivedTargetLists.indexOf(item), 1);
        });

        toastService.showToast('archived', selectedTargetLists);
        vm.selected = [];
      });
    }

    function createNewList(e) {
      var parentEl = angular.element(document.body);
      $mdDialog.show({
        clickOutsideToClose: false,
        parent: parentEl,
        scope: $scope.$new(),
        targetEvent: e,
        template: require('./create-target-list-modal.pug')
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
        clickOutsideToClose: false,
        parent: parentEl,
        scope: $scope.$new(),
        targetEvent: e,
        template: require('./target-list-switch-modal.pug')
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
          analyticsService.trackEvent(
            targetListService.getAnalyticsCategory(targetList.permissionLevel, targetList.archived),
            'Delete Target List',
            targetList.id
          );

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
            userService.model.targetLists.ownedNotArchivedTargetLists.splice(userService.model.targetLists.ownedNotArchivedTargetLists.indexOf(item), 1);
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

        analyticsService.trackEvent('Target Lists - My Target Lists', 'Create Target List', response.id);

        // add collaborators to newly created target list
        return targetListService.addTargetListShares(response.id, newPayload);
      })
      .then(function(addCollaboratorResponse) {
        userService.model.targetLists.ownedNotArchivedTargetLists[0].collaborators = addCollaboratorResponse.data;

        // reset model
        vm.newList = {
          name: '',
          description: '',
          opportunities: [],
          collaborators: [],
          collaborateAndInvite: false
        };
      }).catch(function(response) { console.log(response); });
    }

    function searchOpportunities(e) {
      closeModal();
      $state.go('opportunities');
    }

    function selector(tab) {
      vm.selected = [];
      vm.buttonState = tab;
      vm.userSelectedTab = true;
    }

    function sortBy(property) {
      vm.reverse = (vm.sortProperty === property) ? !vm.reverse : false;
      vm.sortProperty = property;

      vm.listChevron = (property === 'name') ? !vm.listChevron : vm.listChevron;
      vm.collaboratorsChevron = (property === 'collaborators.length') ? !vm.collaboratorsChevron : vm.collaboratorsChevron;
      vm.lastUpdatedChevron = (property === 'dateOpportunitiesUpdated') ? !vm.lastUpdatedChevron : vm.lastUpdatedChevron;
      vm.closedOpportunitiesChevron = (property === 'opportunitiesSummary.closedOpportunitiesCount') ? !vm.closedOpportunitiesChevron : vm.closedOpportunitiesChevron;
      vm.totalOpportunitesChevron = (property === 'opportunitiesSummary.opportunitiesCount') ? !vm.totalOpportunitesChevron : vm.totalOpportunitesChevron;
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
        return vm.selected && vm.userService.model.targetLists.ownedNotArchivedTargetLists && vm.selected.length === vm.userService.model.targetLists.ownedNotArchivedTargetLists.length;
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
            if (data[i].owned[j].dateOpportunitiesUpdated === null) {
              data[i].owned[j].dateOpportunitiesUpdated = data[i].owned[j].createdAt;
            }

            data[i].owned[j].targetListAuthor = 'current user';

            if (data[i].owned[j].archived) {
              combinedTargetList.ownedArchived++;
              combinedTargetList.owned.push(data[i].owned[j]);
              combinedTargetList.archived.push(data[i].owned[j]);

            } else {
              combinedTargetList.ownedNotArchived++;
              combinedTargetList.owned.push(data[i].owned[j]);
              combinedTargetList.ownedNotArchivedTargetLists.push(data[i].owned[j]);
            }
          }

          for (j = 0; j < data[i].sharedWithMe.length; j++) {

            if (data[i].sharedWithMe[j].dateOpportunitiesUpdated === null) {
              data[i].sharedWithMe[j].dateOpportunitiesUpdated = data[i].sharedWithMe[j].createdAt;
            }

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
      });

      // reset after tabs are initialized
      $timeout(function() {
        vm.userSelectedTab = false;
      }, 0);
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

    function showArchiveModal() {
      let compassModalOverlayRef = compassModalService.showAlertModalDialog(vm.archiveModalStringInputs);
      compassModalService.modalActionBtnContainerEvent(compassModalOverlayRef.modalInstance).then((value) => {
          if (value === vm.compassAlertModalAccept) {
            archiveTargetList();
          }
        });
    }

    function showDeleteModal() {
      let compassModalOverlayRef = compassModalService.showAlertModalDialog(vm.deleteModalStringInputs);
      compassModalService.modalActionBtnContainerEvent(compassModalOverlayRef.modalInstance).then((value) => {
          if (value === vm.compassAlertModalAccept) {
            deleteTargetList();
          }
        });
    }
  };
