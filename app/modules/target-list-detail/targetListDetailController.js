'use strict';

module.exports =
  function targetListDetailController($rootScope, $scope, $state, $mdDialog, targetListService, chipsService, filtersService) {

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
    vm.collaboratorDropdown = [
      {
        name: 'Collaborator',
        value: 'collaborator'
      }, {
        name: 'Make Owner',
        value: 'owner'
      }, {
        name: 'remove',
        value: 'remove'
      }
    ];
    vm.targetListService = targetListService;

    // Set page title for head and nav
    $rootScope.pageTitle = $state.current.title;

    // Expose public methods
    vm.addCollaborators = addCollaborators;
    vm.changeCollaboratorLevel = changeCollaboratorLevel;
    vm.closeModal = closeModal;
    vm.makeOwner = makeOwner;
    vm.modalManageTargetList = modalManageTargetList;
    vm.modalManageCollaborators = modalManageCollaborators;
    vm.modalSendOpportunity = modalSendOpportunity;
    vm.navigateToTL = navigateToTL;
    vm.removeCollaborator = removeCollaborator;

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

    function makeOwner(collaboratorId) {
      targetListService.addTargetListShares(targetListService.model.currentList.id, {newCollaboratorId: collaboratorId, permissionLevel: 'author'}).then(function() {
        console.log('owner now w00t');
      });
      // update in array
    }

    function modalManageTargetList(ev) {
      var parentEl = angular.element(document.body);
      $mdDialog.show({
        clickOutsideToClose: true,
        parent: parentEl,
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
      });
    }

    // **************
    // PRIVATE METHODS
    // **************

    function init() {
      // targetListService.getTargetList(targetListService.model.currentList.id).then(function(response) {
      // TEMPORARY -- IF I LEAVE THIS IN, DECLINE THE PR OUTRIGHT
      targetListService.getTargetList('89bc8d73-ec67-4160-92c1-9210c610eca9').then(function(response) {
        console.log('[targetListService.getTargetList]', response);
        targetListService.model.currentList = response;
      });
    }
  };
