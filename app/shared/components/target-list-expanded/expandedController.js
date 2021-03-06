'use strict';

const CompassAlertModalEvents = require('../../../enums/compass-alert-modal-strings.enum').CompassAlertModalEvent;

module.exports = /*  @ngInject */
  function expandedController(analyticsService, $state, $scope, $filter, $mdDialog, $q, $timeout, userService, targetListService, loaderService, toastService, compassModalService, listsApiService, listsTransformerService) {

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
    vm.buttonDisabled = false;
    vm.buttonState = 'named';
    vm.closedOpportunitiesChevron = false;
    vm.collaboratorsChevron = false;
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
    vm.unarchiveTargetList = unarchiveTargetList;
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
    vm.checkAuthorPermissions = checkAuthorPermissions;

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
      loaderService.openLoader();
      var selectedTargetLists = vm.selected,
          archiveTargetListPromises = [];

      // get selected target list ids and their promises
      archiveTargetListPromises = selectedTargetLists.map(function(targetList) {
        let convertedList = listsTransformerService.formatNewList(targetList);
        convertedList.archived = true;
        return listsApiService.updateListPromise(convertedList, targetList.id);
      });

      // run all archive requests at the same time
      $q.all(archiveTargetListPromises).then(function(response) {
        angular.forEach(selectedTargetLists, function(item, key) {
          item.archived = true;

          userService.model.targetLists.archived.unshift(item);

          userService.model.targetLists.ownedArchived++;
          userService.model.targetLists.ownedNotArchived--;

          userService.model.targetLists.ownedNotArchivedTargetLists.splice(userService.model.targetLists.ownedNotArchivedTargetLists.indexOf(item), 1);
          const listPermissionLevel = userService.model.currentUser.employeeID === item.owner.employeeId ? 'author' : '';
          analyticsService.trackEvent(
            targetListService.getAnalyticsCategory(listPermissionLevel, false),
            'Archive List',
            'Selected List'
          );
        });
        loaderService.closeLoader();
        toastService.showToast('archived', selectedTargetLists);
        vm.selected = [];
      });
    }

    function checkAuthorPermissions() {
      // This check is only done to see if ALL selected items don't have author permissions, otherwise we will accept the action and purge in the unarchive method.
      let selectedTargetLists = vm.selected;
      let noOwnerPermissions = selectedTargetLists.filter((list) => {
        return list.owner.employeeId !== userService.model.currentUser.employeeID;
      });
      return (noOwnerPermissions.length === selectedTargetLists.length);
    }
    function unarchiveTargetList() {
      loaderService.openLoader();
      let selectedTargetLists = vm.selected,
          unarchiveTargetListPromises = [];
      let ownerPermissions = selectedTargetLists.filter((list) => {
        return list.owner.employeeId === userService.model.currentUser.employeeID;
      });

      // get selected target list ids and their promises
      unarchiveTargetListPromises = ownerPermissions.map((targetList) => {
        let convertedList = listsTransformerService.formatNewList(targetList);
        convertedList.archived = false;
        return listsApiService.updateListPromise(convertedList, targetList.id);
      });

      // run all archive requests at the same time
      $q.all(unarchiveTargetListPromises).then((response) => {
        angular.forEach(ownerPermissions, (listItem, key) => {
          listItem.archived = false;
          // Remove the item from the archived list me.
          userService.model.targetLists.archived.splice(userService.model.targetLists.archived.indexOf(listItem), 1);

          userService.model.targetLists.ownedArchived--;
          userService.model.targetLists.ownedNotArchived++;

          userService.model.targetLists.ownedNotArchivedTargetLists.unshift(listItem);
          const listPermissionLevel = userService.model.currentUser.employeeID === listItem.owner.employeeId ? 'author' : '';
          analyticsService.trackEvent(
            targetListService.getAnalyticsCategory(listPermissionLevel, true),
            'Unarchive List',
            listItem.id
          );
        });
        loaderService.closeLoader();
        if (selectedTargetLists.length !== ownerPermissions.length) {
          toastService.showToast('unarchivedNoAuthor', ownerPermissions);
        }
        toastService.showToast('unarchived', ownerPermissions);
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
      var selectedItems = vm.selected;

      const deleteTargetListPromises = selectedItems.map(function (targetList) {

        return listsApiService.deleteListPromise(targetList.id);
      });

      $q.all(deleteTargetListPromises).then(function (response) {
        angular.forEach(selectedItems, function (item, key) {
          if (item.archived) {
            userService.model.targetLists.ownedNotArchived--;
            userService.model.targetLists.archived.splice(userService.model.targetLists.archived.indexOf(item), 1);
          }
          userService.model.targetLists.ownedNotArchivedTargetLists.splice(userService.model.targetLists.ownedNotArchivedTargetLists.indexOf(item), 1);
          const listPermissionLevel = userService.model.currentUser.employeeID === item.owner.employeeId ? 'author' : '';
          analyticsService.trackEvent(
            targetListService.getAnalyticsCategory(listPermissionLevel, item.archived),
            'Delete List',
            'Selected List'
          );
        });
      }).then(() => {
        vm.selected = [];
        toastService.showToast('deleted', selectedItems);
      }).catch(() => {
        vm.selected = [];
        toastService.showToast('deletedArchivedListError');
      });
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

      const formattedList = listsTransformerService.formatNewList(vm.newList);
      listsApiService.createListPromise(formattedList)
        .then(v3List => {
          const newList = listsTransformerService.transformV3ToV2(v3List, true);
          userService.model.targetLists.ownedNotArchivedTargetLists.unshift(newList);
          userService.model.targetLists.ownedNotArchived++;

          closeModal();
          vm.buttonDisabled = false;

        analyticsService.trackEvent('Lists - My Lists', 'Create List', v3List.id);

          // reset model
          vm.newList = {
            name: '',
            description: '',
            opportunities: [],
            collaborators: [],
            collaborateAndInvite: false
          };
        }).catch(response => {
          console.log(response);
        });
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

      listsApiService.getListsPromise().then((response) =>  {
        loaderService.closeLoader();
        const currentUserEmployeeID = userService.model.currentUser.employeeID;
        const listsCollectionSummary = listsTransformerService.getV2ListsSummary(response, currentUserEmployeeID);
        userService.model.targetLists = listsCollectionSummary;
      });

      // reset after tabs are initialized
      $timeout(function() {
        vm.userSelectedTab = false;
      }, 0);
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
