'use strict';

module.exports = /*  @ngInject */
  function targetListDetailController($rootScope, $scope, $state, $timeout, $filter, $mdDialog, $mdSelect, $window, $q, targetListService, chipsService, filtersService, opportunitiesService, userService, ieHackService, analyticsService, title, compassModalService) {

    // ****************
    // CONTROLLER SETUP
    // ****************

    // Initial variables
    var vm = this;
    vm.loadingList = true;
    vm.analyticsCategory = '';
    vm.archiving = false;
    vm.changed = false;
    vm.closeButton = false;
    vm.collaboratorName = '';
    vm.confirmToast = false;
    vm.deleting = false;
    vm.editable = false;
    vm.leave = false;
    vm.listID;
    vm.originalList = {};
    vm.pendingShares = [];
    vm.pendingSharesPayload = [];
    vm.pendingRemovals = [];
    vm.saveButton = false;
    vm.selectedCollaboratorId = '';
    vm.stayOnPage = true;
    vm.targetListAuthor = '';
    vm.archiveModalStringInputs = {
      'title': 'Are you sure?',
      'body': 'By archiving this list, only limited set functionality will remain available.',
      'rejectLabel': 'Cancel',
      'acceptLabel': 'Archive'
    };
    vm.deleteModalStringInputs =  {
      'title': 'Are you sure?',
      'body': 'Deleting a list cannot be undone. You\'ll lose all list store performance and opportunity progress.',
      'rejectLabel': 'Cancel',
      'acceptLabel': 'Delete'
    };

    // Services
    vm.targetListService = targetListService;
    vm.userService = userService;

    // Set page title for head and nav
    title.setTitle($state.current.title);

  // Expose public methods
    vm.addCollaboratorClick = addCollaboratorClick;
    vm.changePermissionClick = changePermissionClick;
    vm.closeModal = closeModal;
    vm.deleteList = deleteList;
    vm.enableButton = enableButton;
    vm.findTargetListAuthor = findTargetListAuthor;
    vm.footerToast = footerToast;
    vm.initTargetLists = initTargetLists;
    vm.isAuthor = isAuthor;
    vm.listChanged = listChanged;
    vm.makeOwner = makeOwner;
    vm.modalManageTargetList = modalManageTargetList;
    vm.modalUnauthorizedAccess = modalUnauthorizedAccess;
    vm.navigateToTL = navigateToTL;
    vm.pendingCheck = pendingCheck;
    vm.permissionLabel = permissionLabel;
    vm.removeCollaborator = removeCollaborator;
    vm.removeCollaboratorClick = removeCollaboratorClick;
    vm.removeFooterToast = removeFooterToast;
    vm.updateList = updateList;
    vm.sendGoogleAnalytics = sendGoogleAnalytics;
    vm.showArchiveModal = showArchiveModal;
    vm.showDeleteModal = showDeleteModal;

    init();

    function addCollaboratorClick(result) {
      vm.pendingShares.push({
        employee: result
      });

      listChanged();
    }

    function removeCollaboratorClick(result) {
      vm.pendingRemovals.push(result);
      angular.forEach(vm.targetListService.model.currentList.collaborators, function(item, key) {
        if (item.user.employeeId === result) {
          vm.targetListService.model.currentList.collaborators.splice(key, 1);
        }
      });
      listChanged();
      ieHackService.forceRepaint();
    }

    function permissionLabel(permissionLevel) {
      return permissionLevel === 'author' ? 'owner' : 'collaborator';
    }

    function enableButton() {
      targetListService.model.currentList.permissionLevel === 'collaborate' ? vm.closeButton = true : vm.saveButton = true;
    };

    function changePermissionClick() {
      listChanged();
      return targetListService.model.currentList.collaboratorPermissionLevel === 'collaborateandinvite';
    }

    function closeModal(revert) {
      if (revert) {
        targetListService.model.currentList.name = vm.originalList.name;
        targetListService.model.currentList.description = vm.originalList.description;
      }

      vm.keepGoing = true;
      targetListService.model.currentList.collaborators.forEach(function(value, key) {
        if (vm.keepGoing) {
          if (userService.model.currentUser.employeeID === value.user.employeeId) {
            vm.stayOnPage = true;
            vm.keepGoing = false;
          } else {
            vm.stayOnPage = false;
          }
        }
      });

      vm.stayOnPage ? $mdDialog.hide() : vm.navigateToTL();

      vm.changed = false;
    }

    function pendingCheck() {
      vm.pendingCheckInProgress = true;
      vm.pendingRemovals.length ? vm.removeCollaborator(vm.pendingRemovals) : vm.deleteList();
    }

    function deleteList() {
      targetListService.deleteTargetList(targetListService.model.currentList.id).then(function(response) {
        vm.confirmToast = true;
        removeFooterToast();
        sendGoogleAnalytics('Delete');

        $timeout(function() {
          vm.confirmToast = false;
          navigateToTL();
        }, 2000);

        // TO DO
        // userService.model.targetLists.splice(,1)
      });
    }

    function footerToast(method) {
      vm.showToast = true;

      if (method === 'delete') vm.deleting = true;
      else if (method === 'archive') vm.archiving = true;
      else if (method === 'leave') vm.leave = true;
    }

    function listChanged() {
      vm.changed = true;
    }

    function makeOwner(collaboratorId) {
      targetListService.updateTargetList(targetListService.model.currentList.id, {'newOwnerUserId': collaboratorId}).then(function(response) {

        // change permission in targetListService.model.currentList so reflected in ui
        angular.forEach(targetListService.model.currentList.collaborators, function(item, key) {
          if (item.user.employeeId === collaboratorId) item.permissionLevel = 'author';
          if (item.user.employeeId === userService.model.currentUser.employeeID) {
            item.permissionLevel = 'collaborate';
            targetListService.model.currentList.permissionLevel = item.permissionLevel;
            vm.editable = false;
          }
        });

        // change permission in userService.model.targetLists.owned so reflected in ui
        var keepGoing = true,
            list = $filter('filter')(userService.model.targetLists.owned, {id: targetListService.model.currentList.id});
        angular.forEach(list.collaborators, function(item, key) {
          if (keepGoing) {
            if (item.user.employeeId === collaboratorId) {
              item.permissionLevel = 'author';
              keepGoing = false;
            }
          }
        });
      });
      vm.selectedCollaboratorId = '';
    }

    function modalManageTargetList(ev) {
      var parentEl = angular.element(document.body);
      vm.pendingShares = [];
      vm.pendingRemovals = [];
      initTargetLists();
      isAuthor();
      removeFooterToast();
      enableButton();
      vm.originalList = targetListService.model.currentList;

      $mdDialog.show({
        clickOutsideToClose: false,
        parent: parentEl,
        scope: $scope.$new(),
        targetEvent: ev,
        template: require('./modal-manage-target-list.pug')
      });
    }

    function isAuthor() {
      targetListService.model.currentList.permissionLevel === 'author' ? vm.editable = true : vm.editable = false;
    }

    function navigateToTL() {
      $window.location.href = '/lists';
    }

    function removeCollaborator(collaboratorIds) {
      angular.forEach(collaboratorIds, function(collaboratorId, key) {
        var listLength = collaboratorIds.length;
        var collabKey = key;
        targetListService.deleteTargetListShares(targetListService.model.currentList.id, collaboratorId).then(function(response) {
          angular.forEach(targetListService.model.currentList.collaborators, function(item, key) {
            if (item.user.employeeId === collaboratorId) targetListService.model.currentList.collaborators.splice(key, 1);
          });
          angular.forEach(vm.pendingShares, function(item, key) {
            if (item.employee.employeeId === collaboratorId) vm.pendingShares.splice(key, 1);
          });
          angular.forEach(vm.pendingRemovals, function(item, key) {
            if (item === collaboratorId) vm.pendingRemovals.splice(key, 1);
          });
          if (listLength - 1 === collabKey && vm.pendingCheckInProgress) {
            vm.deleteList();
            vm.pendingCheckInProgress = false;
          }
        });
        if (userService.model.currentUser.employeeID === collaboratorId) {
          vm.closeButton = true;
          vm.saveButton = false;
        }
      });

      vm.listChanged();
    }

    function removeFooterToast() {
      vm.showToast = vm.deleting = vm.archiving = false;
    }

    function updateList(method) {
      var payload = {
        archived: method === 'archive',
        description: targetListService.model.currentList.description,
        name: targetListService.model.currentList.name,
        collaborateAndInvite: vm.changePermissionClick()
      };

      if (vm.targetListAuthor === 'current user') {
        targetListService.updateTargetList(targetListService.model.currentList.id, payload).then(function (response) {
          targetListService.model.currentList = response;

          if (vm.pendingShares.length) {
            addCollaborators();
          }

          if (vm.pendingRemovals.length) {
            vm.removeCollaborator(vm.pendingRemovals);
          }

          vm.removeFooterToast();
          vm.sendGoogleAnalytics('Archive');
          vm.closeModal();
        });
      } else {
        // if not the owner, don't update list first (it will fail) - just add collaborators if necessary
        if (vm.pendingShares.length) {
          addCollaborators();
        }

        vm.removeFooterToast();
        vm.sendGoogleAnalytics('Archive');
        vm.closeModal();
      }
    }

    function initTargetLists() {
      targetListService.getTargetList(targetListService.model.currentList.id).then(function(response) {
        handleListResponse(response);
        targetListService.updateTargetListShares(targetListService.model.currentList.id, userService.model.currentUser.employeeID, true);
      }, function() {
        vm.modalUnauthorizedAccess();
      });
    }

    function findTargetListAuthor(collaborators) {
      var author;

      angular.forEach(collaborators, function(value, key) {
        if (value.permissionLevel === 'author') {
          author = value.user.firstName + ' ' + value.user.lastName;
        }
      });

      return author;
    }

    function modalUnauthorizedAccess() {
      $mdDialog.show({
        clickOutsideToClose: false,
        scope: $scope.$new(),
        template: require('./modal-unauthorized-access.pug')
      });

      $timeout(function() {
        $mdDialog.hide();
        vm.navigateToTL();
      }, 3500);
    }

    function sendGoogleAnalytics(event) {
      analyticsService.trackEvent(
        'Target Lists - My Target Lists',
        event + ' Target List',
        vm.listID
      );
    }

    function showArchiveModal() {
      let compassModalOverlayRef = compassModalService.showAlertModalDialog(vm.archiveModalStringInputs);
      compassModalService.modalActionBtnContainerEvent(compassModalOverlayRef.modalInstance).then((value) => {
          if (value === 'Accept') {
            updateList('archive');
          }
        });
    }

    function showDeleteModal() {
      let compassModalOverlayRef = compassModalService.showAlertModalDialog(vm.deleteModalStringInputs);
      compassModalService.modalActionBtnContainerEvent(compassModalOverlayRef.modalInstance).then((value) => {
          if (value === 'Accept') {
            pendingCheck();
          }
        });
    }

    // **************
    // PRIVATE METHODS
    // **************

    function init() {
      vm.listID = $state.params.id;
      targetListService.model.currentList.id = $state.params.id;

      // reset all chips and filters on page init
      chipsService.resetChipsFilters(chipsService.model);

      $q.all([
        targetListService.getTargetList(targetListService.model.currentList.id),
        // Allow chipsService handle applying pagination and sort parameters, parsing
        // of response data, and updating the opportunities & filters models (the
        // same way opportunities searches are handled)
        // TODO: abstract this logic away from the chipsService
        chipsService.applyFilters(true)
      ]).then((response) => {
        const targetList = response[0];
        handleListResponse(targetList);
        const numberOfOpps = targetList.opportunitiesSummary.opportunitiesCount;
        const numberOfStores = targetList.opportunitiesSummary.storesCount;
        opportunitiesService.setPaginationModel(numberOfOpps, numberOfStores);
        vm.loadingList = false;
        setAnalyticsCategory(targetList);
      }).catch(() => {
        vm.modalUnauthorizedAccess();
        vm.loadingList = false;
      });

      // we don't care about when this finishes, no UI updates
      targetListService.updateTargetListShares(targetListService.model.currentList.id, userService.model.currentUser.employeeID, true);

      opportunitiesService.model.filterApplied = true;

      // closes filter box
      filtersService.model.expanded = false;

      // disable my accounts only for pass-through to accounts dashboard
      chipsService.removeFromFilterService({type: 'myAccountsOnly'});
    }

    function handleListResponse(targetList) {
      targetListService.model.currentList = targetList;

      if (targetList.permissionLevel === 'author') {
        vm.targetListAuthor = 'current user';
      } else if (targetList.permissionLevel === null) {
        vm.modalUnauthorizedAccess();
      } else {
        vm.targetListAuthor = findTargetListAuthor(targetList.collaborators);
      }

      // Binding to rootscope to use on the outer shell
      $rootScope.isGrayedOut = targetList.archived;
    }

    function addCollaborators() {
      vm.pendingShares.forEach(function(item, key) {
        vm.pendingSharesPayload.push(item.employee.employeeId);
      });

      targetListService.addTargetListShares(targetListService.model.currentList.id, vm.pendingSharesPayload).then(function(response) {
        targetListService.model.currentList.collaborators = response.data;
      });

      vm.pendingSharesPayload = [];

      closeModal();
    }

    function setAnalyticsCategory(targetList) {
      vm.analyticsCategory = targetListService.getAnalyticsCategory(targetList.permissionLevel, targetList.archived);
    }
  };
