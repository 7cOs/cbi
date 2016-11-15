'use strict';

module.exports = /*  @ngInject */
  function targetListDetailController($rootScope, $scope, $state, $timeout, $filter, $mdDialog, $mdSelect, $window, targetListService, chipsService, filtersService, opportunitiesService, userService) {

    // ****************
    // CONTROLLER SETUP
    // ****************

    // Initial variables
    var vm = this;
    vm.collaborator = {};
    vm.collaboratorName = '';
    vm.permissionLevel = 'Collaborate';
    vm.deleting = false;
    vm.archiving = false;
    vm.confirmToast = false;
    vm.changed = false;
    vm.targetListShares = [];
    vm.pendingShares = [];
    vm.pendingRemovals = [];
    vm.editable = false;
    vm.leave = false;
    vm.selectedCollaboratorId = '';
    vm.targetListAuthor = '';
    vm.originalList = {};

    // Services
    vm.targetListService = targetListService;
    vm.userService = userService;

    // Set page title for head and nav
    $rootScope.pageTitle = $state.current.title;

    // Expose public methods
    vm.addCollaboratorClick = addCollaboratorClick;
    vm.changePermissionClick = changePermissionClick;
    vm.closeModal = closeModal;
    vm.deleteList = deleteList;
    vm.findTargetListAuthor = findTargetListAuthor;
    vm.footerToast = footerToast;
    vm.initTargetLists = initTargetLists;
    vm.isAuthor = isAuthor;
    vm.listChanged = listChanged;
    vm.makeOwner = makeOwner;
    vm.modalManageTargetList = modalManageTargetList;
    vm.navigateToTL = navigateToTL;
    vm.permissionLabel = permissionLabel;
    vm.removeCollaborator = removeCollaborator;
    vm.removeCollaboratorClick = removeCollaboratorClick;
    vm.removeFooterToast = removeFooterToast;
    vm.updateList = updateList;

    init();

    function addCollaboratorClick(result) {
      vm.collaborator = {
        employeeId: result.employeeId
      };

      vm.targetListShares.push(vm.collaborator);

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
    }

    function permissionLabel(permissionLevel) {
      if (permissionLevel === 'author') {
        return 'owner';
      } else {
        return 'collaborator';
      }
    }

    function changePermissionClick() {
      listChanged();
      if (targetListService.model.currentList.collaboratorPermissionLevel === 'collaborateandinvite') {
        return true;
      } else {
        return false;
      }
    }

    function closeModal(revert) {
      if (revert) {
        targetListService.model.currentList.name = vm.originalList.name;
        targetListService.model.currentList.description = vm.originalList.description;
      }
      $mdDialog.hide();
      vm.changed = false;
    }

    function deleteList() {
      if (vm.pendingRemovals) removeCollaborator(vm.pendingRemovals);
      targetListService.deleteTargetList(targetListService.model.currentList.id).then(function(response) {

        vm.confirmToast = true;
        removeFooterToast();

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
      vm.originalList = targetListService.model.currentList;

      $mdDialog.show({
        clickOutsideToClose: true,
        parent: parentEl,
        scope: $scope.$new(),
        targetEvent: ev,
        templateUrl: './app/modules/target-list-detail/modal-manage-target-list.html'
      });
    }

    function isAuthor() {
      targetListService.model.currentList.permissionLevel === 'author' ? vm.editable = true : vm.editable = false;
    }

    function navigateToTL() {
      $window.location.href = '/target-lists';
    }

    function removeCollaborator(collaboratorIds) {
      angular.forEach(collaboratorIds, function(collaboratorId, key) {
        targetListService.deleteTargetListShares(targetListService.model.currentList.id, collaboratorId).then(function(response) {
          angular.forEach(targetListService.model.currentList.collaborators, function(item, key) {
            if (item.user.employeeId === collaboratorId) targetListService.model.currentList.collaborators.splice(key, 1);
          });
          angular.forEach(vm.pendingShares, function(item, key) {
            if (item.employee.employeeId === collaboratorId) vm.pendingShares.splice(key, 1);
          });
        });
      });

      listChanged();
      vm.leave = true;
    }

    function removeFooterToast() {
      vm.showToast = vm.deleting = vm.archiving = false;
    }

    function updateList(method) {
      var payload = {
        archived: method === 'archive',
        description: targetListService.model.currentList.description,
        name: targetListService.model.currentList.name,
        collaborateAndInvite: changePermissionClick()
      };

      targetListService.updateTargetList(targetListService.model.currentList.id, payload).then(function(response) {
        targetListService.model.currentList = response;

        if (vm.pendingShares.length > 0) {
          addCollaborators();
        }

        if (vm.pendingRemovals.length > 0) {
          removeCollaborator(vm.pendingRemovals);
        }

        removeFooterToast();
        closeModal();
      });
    }

    function initTargetLists() {
      targetListService.getTargetList(targetListService.model.currentList.id).then(function(response) {
        targetListService.model.currentList = response;
        targetListService.model.currentList.loading = false;

        if (response.permissionLevel === 'author') {
          vm.targetListAuthor = 'current user';
        } else {
          vm.targetListAuthor = findTargetListAuthor(response.collaborators);
        }
        targetListService.model.currentList.archived = response.archived;

        // Binding to rootscope to use on the outer shell
        $rootScope.isGrayedOut = response.archived;

        targetListService.updateTargetListShares(targetListService.model.currentList.id, userService.model.currentUser.employeeID, true, false);
      }, function(err) {
        console.log('[targetListController.init], Error: ' + err.statusText + '. Code: ' + err.status);
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

    // **************
    // PRIVATE METHODS
    // **************

    function init() {
      targetListService.model.currentList.id = $state.params.id;

      initTargetLists();

      // get opportunities
      targetListService.getTargetListOpportunities(targetListService.model.currentList.id).then(function(data) {
        // opportunitiesService.model.opportunities = data;
      });

      opportunitiesService.model.filterApplied = true;

      // closes filter box
      filtersService.model.expanded = false;

      // reset all chips and filters on page init
      chipsService.resetChipsFilters(chipsService.model);

    }

    function addCollaborators() {
      targetListService.addTargetListShares(targetListService.model.currentList.id, vm.targetListShares).then(function(response) {
        var collaboratorList = targetListService.model.currentList;
        if (collaboratorList.length) {
          collaboratorList[0].collaborators = targetListService.model.currentList.collaborators = response.data;
        }
        closeModal();
      });
    }
  };
