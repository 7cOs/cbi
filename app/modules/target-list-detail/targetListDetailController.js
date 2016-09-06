'use strict';

module.exports = /*  @ngInject */
  function targetListDetailController($rootScope, $scope, $state, $timeout, $filter, $mdDialog, targetListService, chipsService, filtersService, opportunitiesService, userService) {

    // ****************
    // CONTROLLER SETUP
    // ****************

    // Initial variables
    var vm = this;
    vm.collaborator = {};
    vm.collaboratorName = '';
    vm.permissionLevel = 'collaborate';
    vm.deleting = false;
    vm.archiving = false;
    vm.confirmToast = false;
    vm.changed = false;

    // Services
    vm.targetListService = targetListService;
    vm.filtersService = filtersService;
    vm.chipsService = chipsService;

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
    vm.modalSendOpportunity = modalSendOpportunity;
    vm.navigateToTL = navigateToTL;
    vm.removeCollaborator = removeCollaborator;
    vm.removeFooterToast = removeFooterToast;
    vm.updateList = updateList;
    vm.resetFilters = resetFilters;

    init();

    // **************
    // PUBLIC METHODS
    // **************

    function addCollaborators() {
      vm.collaborator.permissionLevel = vm.permissionLevel;
      targetListService.addTargetListShares(targetListService.model.currentList.id, vm.collaborator).then(function(response) {
        // push to target list collaborator array
        var collaboratorList = $filter('filter')(userService.model.targetLists.owned, {id: targetListService.model.currentList.id});
        collaboratorList[0].collaborators = targetListService.model.currentList.collaborators = response.data;

        closeModal();
      });
    }

    function addCollaboratorClick(result) {
      vm.collaborator = result;
    }

    function changeCollaboratorLevel() {
      targetListService.updateTargetListShares(targetListService.model.currentList.id, vm.collaborator).then();
    }

    function resetFilters() {
      // reset all chips and filters
      chipsService.resetChipsFilters(chipsService.model);

      // userService.model.opportunityFilters = null;
      filtersService.resetFilters();
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
      targetListService.addTargetListShares(targetListService.model.currentList.id, {id: collaboratorId, permissionLevel: 'author'}).then(function(response) {
        console.log('new owner specified');

        // change permission in targetListService.model.currentList so reflected in ui
        angular.forEach(targetListService.model.currentList.collaborators, function(item, key) {
          if (item.user.id === collaboratorId) item.permissionLevel = 'author';
        });

        // change permission in userService.model.targetLists.owned so reflected in ui
        var keepGoing = true,
            list = $filter('filter')(userService.model.targetLists.owned, {id: targetListService.model.currentList.id});
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
        var collaboratorList = $filter('filter')(userService.model.targetLists.owned, {id: targetListService.model.currentList.id});
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
      $mdDialog.show({
        clickOutsideToClose: true,
        parent: parentEl,
        scope: $scope.$new(),
        targetEvent: ev,
        templateUrl: './app/modules/target-list-detail/modal-manage-collaborators.html'
      });
    }

    function modalSendOpportunity(ev) {
      var parentEl = angular.element(document.body);
      $mdDialog.show({
        clickOutsideToClose: true,
        parent: parentEl,
        targetEvent: ev,
        templateUrl: './app/modules/target-list-detail/modal-send-opportunity.html'
      });
    }

    function navigateToTL() {
      $state.go('target-lists');
    }

    function removeCollaborator(collaboratorId) {
      targetListService.deleteTargetListShares(targetListService.model.currentList.id, collaboratorId).then(function(response) {
        console.log('collaborator removed');

        // remove from user model and UI - target list service
        angular.forEach(targetListService.model.currentList.collaborators, function(item, key) {
          if (item.user.id === collaboratorId) targetListService.model.currentList.collaborators.splice(targetListService.model.currentList.collaborators.indexOf(item), 1);
        });

        // remove from user model and UI - user service
        var keepGoing = true,
            list = $filter('filter')(userService.model.targetLists.owned, {id: targetListService.model.currentList.id});
        angular.forEach(list.collaborators, function(item, key) {
          if (keepGoing) {
            if (item.user.id === collaboratorId) {
              list.collaborators.splice(list.collaborators.indexOf(item), 1);
              keepGoing = false;
            }
          }
        });

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
        targetListService.model.currentList = response;

        removeFooterToast();

        closeModal();
      });
    }

    // **************
    // PRIVATE METHODS
    // **************

    /*
      // Add chip for inline search value watchers
      function addInlineSearchChip(val) {
        if (typeof val === 'string' && val !== '') {
          chipsService.addAutocompleteChip(val, 'searchText');
        }
      }

      // Watch for inline search value changes
      $scope.$watch('tld.filtersService.model.brands', function (val) { addInlineSearchChip(val); });
      $scope.$watch('tld.filtersService.model.chains', function (val) { addInlineSearchChip(val); });
      $scope.$watch('tld.filtersService.model.stores', function (val) { addInlineSearchChip(val); });
    */

    function init() {
      targetListService.model.currentList.id = $state.params.id;

      targetListService.getTargetList(targetListService.model.currentList.id).then(function(response) {
        targetListService.model.currentList = response;
        targetListService.model.currentList.loading = false;
      }, function(err) {
        console.log('[targetListController.init], Error: ' + err.statusText + '. Code: ' + err.status);
      });

      // get opportunities
      targetListService.getTargetListOpportunities(targetListService.model.currentList.id).then(function(data) {
        // opportunitiesService.model.opportunities = data;
      });

      opportunitiesService.model.filterApplied = true;

      // reset all chips and filters on page init
      chipsService.resetChipsFilters(chipsService.model);
    }
  };
