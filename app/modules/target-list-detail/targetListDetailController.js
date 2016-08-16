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

    // Set page title for head and nav
    $rootScope.pageTitle = $state.current.title;

    // Expose public methods
    vm.addCollaborators = addCollaborators;
    vm.closeModal = closeModal;
    vm.modalManageTargetList = modalManageTargetList;
    vm.modalManageCollaborators = modalManageCollaborators;
    vm.modalSendOpportunity = modalSendOpportunity;
    vm.navigateToTL = navigateToTL;

    init();

    // **************
    // PUBLIC METHODS
    // **************

    function addCollaborators() {
      targetListService.addTargetListShares(targetListService.model.currentList, vm.collaborator).then(function(response) {
        console.log('Collaborator Added!');
        // push to target list collaborator array
      });
    }

    function closeModal() {
      $mdDialog.hide();
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

    // **************
    // PRIVATE METHODS
    // **************

    function init() {
      targetListService.getTargetList(targetListService.model.currentList).then(function(response) {
        console.log('[targetListService.getTargetList]', response);
      });
    }
  };
