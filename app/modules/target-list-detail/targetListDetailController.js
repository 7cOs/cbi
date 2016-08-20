'use strict';

module.exports =
  function targetListDetailController($rootScope, $scope, $state, $timeout, $mdDialog, targetListService, chipsService, filtersService, userService) {

    // ****************
    // CONTROLLER SETUP
    // ****************

    // Initial variables
    var vm = this;
    vm.collaborator = {
      newCollaborator: '',
      newCollaboratorId: '2',
      permissionLevel: 'collaborate'
    };
    vm.deleting = false;
    vm.archiving = false;
    /* vm.manageTargetList = {
      name: '',
      description: '',
      collaborators: [],
      allowInvite: null,
      addRecipient: ''
    };*/
    vm.targetListService = targetListService;

    // Set page title for head and nav
    $rootScope.pageTitle = $state.current.title;

    // Expose public methods
    vm.addCollaborators = addCollaborators;
    vm.changeCollaboratorLevel = changeCollaboratorLevel;
    vm.closeModal = closeModal;
    vm.deleteList = deleteList;
    vm.footerToast = footerToast;
    vm.makeOwner = makeOwner;
    vm.modalManageTargetList = modalManageTargetList;
    vm.modalManageCollaborators = modalManageCollaborators;
    vm.modalSendOpportunity = modalSendOpportunity;
    vm.navigateToTL = navigateToTL;
    vm.removeCollaborator = removeCollaborator;
    vm.removeFooterToast = removeFooterToast;
    vm.updateList = updateList;

    init();

    // **************
    // PUBLIC METHODS
    // **************

    function addCollaborators() {
      targetListService.addTargetListShares(targetListService.model.currentList.id, vm.collaborator).then(function(response) {
        console.log('Collaborator Added!');

        // push to target list collaborator array
      });
    }

    function changeCollaboratorLevel() {
      targetListService.updateTargetListShares(targetListService.model.currentList.id, vm.collaborator).then(function(response) {
        console.log('Collaborator Permissions Updated!');
      });
    }

    function closeModal() {
      $mdDialog.hide();
    }

    function deleteList() {
      targetListService.deleteTargetList(targetListService.model.currentList.id).then(function(response) {
        console.log('Target list deleted!');

        // TO DO
        // userService.model.targetLists.splice(,1)
      });
    }

    function footerToast(method) {
      vm.showToast = true;

      if (method === 'delete') vm.deleting = true;
      else if (method === 'archive') vm.archiving = true;
    }

    function makeOwner(collaboratorId) {
      /* targetListService.addTargetListShares(targetListService.model.currentList.id, {newCollaboratorId: collaboratorId, permissionLevel: 'author'}).then(function() {
        console.log('owner now w00t');
      });*/
      console.log('sup');
      // update in array
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
        console.log('done');

        // TO DO
        // remove from collaborators list in model
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

      /* targetListService.updateTargetList(targetListService.model.currentList.id, payload).then(function(response) {
        console.log('Target List Updated: ', response);
      });*/
      $timeout(function() {

      }, 2000);
    }

    // **************
    // PRIVATE METHODS
    // **************

    function init() {
      targetListService.getTargetList(targetListService.model.currentList.id).then(function(response) {
        console.log('[targetListService.getTargetList]', response);
        targetListService.model.currentList = response;
      }, function(err) {
        console.log('[targetListController.init], Error: ' + err.statusText + '. Code: ' + err.status);
      });
    }
  };
