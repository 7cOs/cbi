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
    vm.editable = false;

    // Services
    vm.targetListService = targetListService;
    vm.userService = userService;

    // Set page title for head and nav
    $rootScope.pageTitle = $state.current.title;

    // Expose public methods
    vm.addCollaborators = addCollaborators;
    vm.addCollaboratorClick = addCollaboratorClick;
    vm.changeCollaboratorLevel = changeCollaboratorLevel;
    vm.closeModal = closeModal;
    vm.deleteList = deleteList;
    vm.footerToast = footerToast;
    vm.listChanged = listChanged;
    vm.makeOwner = makeOwner;
    vm.manageCollaborators = manageCollaborators;
    vm.modalManageTargetList = modalManageTargetList;
    vm.modalManageCollaborators = modalManageCollaborators;
    vm.navigateToTL = navigateToTL;
    vm.removeCollaborator = removeCollaborator;
    vm.removeFooterToast = removeFooterToast;
    vm.updateList = updateList;
    vm.initTargetLists = initTargetLists;
    vm.isAuthor = isAuthor;

    init();

    function addCollaborators() {
      targetListService.addTargetListShares(targetListService.model.currentList.id, vm.targetListShares).then(function(response) {
        // push to target list collaborator array
        // var collaboratorList = $filter('filter')(userService.model.targetListArray.owned, {id: targetListService.model.currentList.id});
        var collaboratorList = targetListService.model.currentList;
        if (collaboratorList.length) {
          collaboratorList[0].collaborators = targetListService.model.currentList.collaborators = response.data;
        }

        closeModal();
      });
    }

    function addCollaboratorClick(result) {
      vm.collaborator = {
        employeeId: result.employeeId,
        permissionLevel: vm.permissionLevel
      };

      vm.targetListShares.push(vm.collaborator);

      vm.pendingShares.push({
        employee: result,
        permissionLevel: 'Collaborate'
      });

      listChanged();
    }

    function changeCollaboratorLevel() {
      targetListService.updateTargetListShares(targetListService.model.currentList.id, vm.collaborator).then();
    }

    function closeModal() {
      $mdDialog.hide();
    }

    function deleteList() {
      targetListService.deleteTargetList(targetListService.model.currentList.id).then(function(response) {
        console.log('Target List Deleted: ', response);

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
    }

    function listChanged() {
      vm.changed = true;
    }

    function makeOwner(collaboratorId) {
      targetListService.addTargetListShares(targetListService.model.currentList.id, {employeeId: collaboratorId, permissionLevel: 'Author'}).then(function(response) {
        console.log('new owner specified');

        // change permission in targetListService.model.currentList so reflected in ui
        angular.forEach(targetListService.model.currentList.collaborators, function(item, key) {
          if (item.user.id === collaboratorId) item.permissionLevel = 'author';
        });

        // change permission in userService.model.targetLists.owned so reflected in ui
        var keepGoing = true,
            list = $filter('filter')(userService.model.targetListArray.owned, {id: targetListService.model.currentList.id});
        angular.forEach(list.collaborators, function(item, key) {
          if (keepGoing) {
            if (item.user.id === collaboratorId) {
              item.permissionLevel = 'author';
              keepGoing = false;
            }
          }
        });

      });
    }

    // inline adding of collaborator
    function manageCollaborators(result) {
      // add loader
      console.log('Pls add Ratul to the target list.');
      targetListService.model.currentList.loading = true;

      result.permissionLevel = vm.permissionLevel;
      targetListService.addTargetListShares(targetListService.model.currentList.id, result).then(function(response) {
        // push to target list collaborator array
        var collaboratorList = $filter('filter')(userService.model.targetListArray.owned, {id: targetListService.model.currentList.id});
        collaboratorList[0].collaborators = targetListService.model.currentList.collaborators = response.data;

        // clear name from inline search
        vm.manageListCollaboratorName = '';

        // remove loader
        console.log('Ratul has been added to the target list.');
        targetListService.model.currentList.loading = false;
      }, function(err) {
        console.log('Ratul has gone on paternity leave. Sry.', err);
        targetListService.model.currentList.loading = false;
      });
    }

    function modalManageTargetList(ev) {
      var parentEl = angular.element(document.body);

      vm.pendingShares = [];
      initTargetLists();
      isAuthor();

      $mdDialog.show({
        clickOutsideToClose: true,
        parent: parentEl,
        scope: $scope.$new(),
        targetEvent: ev,
        templateUrl: './app/modules/target-list-detail/modal-manage-target-list.html'
      });
    }

    function modalManageCollaborators(ev) {
      var parentEl = angular.element(document.body);

      vm.pendingShares = [];
      initTargetLists();
      isAuthor();

      $mdDialog.show({
        clickOutsideToClose: true,
        parent: parentEl,
        scope: $scope.$new(),
        targetEvent: ev,
        templateUrl: './app/modules/target-list-detail/modal-manage-collaborators.html'
      });
    }

    function isAuthor() {
      angular.forEach(targetListService.model.currentList.collaborators, function(value, key) {
        if (vm.editable === false) {
          if (value.user.employeeId === userService.model.currentUser.employeeID && value.permissionLevel === 'author') {
            vm.editable = true;
          } else {
            vm.editable = false;
          }
        }
      });
    }

    function navigateToTL() {
      $window.location.href = '/target-lists';
    }

    function removeCollaborator(collaboratorId) {
      targetListService.deleteTargetListShares(targetListService.model.currentList.id, collaboratorId).then(function(response) {
        console.log('collaborator removed');

        // remove from user model and UI - target list service
        angular.forEach(targetListService.model.currentList.collaborators, function(item, key) {
          if (item.user.employeeId === collaboratorId) targetListService.model.currentList.collaborators.splice(targetListService.model.currentList.collaborators.indexOf(item), 1);
        });

        // remove from user model and UI - user service
        /* Doesnt look like we're using this anymore
        var keepGoing = true,
            list = $filter('filter')(userService.model.targetListArray.owned, {id: targetListService.model.currentList.id});
        angular.forEach(list.collaborators, function(item, key) {
          if (keepGoing) {
            if (item.user.employeeId === collaboratorId) {
              list.collaborators.splice(list.collaborators.indexOf(item), 1);
              keepGoing = false;
            }
          }
        }); */

      });
    }

    function removeFooterToast() {
      vm.showToast = vm.deleting = vm.archiving = false;
    }

    function updateList(method) {
      var payload = {
        archived: method === 'archive',
        description: targetListService.model.currentList.description,
        name: targetListService.model.currentList.name
      };

      targetListService.updateTargetList(targetListService.model.currentList.id, payload).then(function(response) {
        console.log('[targetListDetailController.updateList.response', response);
        targetListService.model.currentList = response;

        if (vm.pendingShares.length > 0) {
          addCollaborators();
        }

        removeFooterToast();

        closeModal();
      });
    }

    function initTargetLists() {
      targetListService.getTargetList(targetListService.model.currentList.id).then(function(response) {
        targetListService.model.currentList = response;
        targetListService.model.currentList.loading = false;
      }, function(err) {
        console.log('[targetListController.init], Error: ' + err.statusText + '. Code: ' + err.status);
      });
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
  };
