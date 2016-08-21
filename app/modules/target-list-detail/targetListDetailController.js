'use strict';

module.exports =
  function targetListDetailController($rootScope, $scope, $state, $timeout, $filter, $mdDialog, targetListService, chipsService, filtersService, userService) {

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
    vm.confirmToast = false;
    vm.changed = false;
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
    vm.listChanged = listChanged;
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
        // push to target list collaborator array
        var collaboratorList = $filter('filter')(userService.model.targetLists.owned, {id: targetListService.model.currentList.id});
        collaboratorList[0].collaborators = response.data;

        closeModal();
      });
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
      targetListService.addTargetListShares(targetListService.model.currentList.id, {newCollaboratorId: collaboratorId, permissionLevel: 'author'}).then(function(response) {
        console.log('owner now w00t');
        // update in array
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

      targetListService.updateTargetList(targetListService.model.currentList.id, payload).then(function(response) {
        targetListService.model.currentList = response;

        removeFooterToast();

        closeModal();
      });
    }

    // **************
    // PRIVATE METHODS
    // **************

    // Add chip for inline search value watchers
    function addInlineSearchChip(val) {
      if (typeof val === 'string' && val !== '') {
        chipsService.addAutocompleteChip(val, 'searchText');
      }
    }

    // Watch for inline search value changes
    $scope.$watch('t.filtersService.model.brandSearchText', function (val) { addInlineSearchChip(val); });
    $scope.$watch('t.filtersService.model.accountSearchText', function (val) { addInlineSearchChip(val); });
    $scope.$watch('t.filtersService.model.distributorSearchText', function (val) { addInlineSearchChip(val); });

    function init() {
      targetListService.getTargetList(targetListService.model.currentList.id).then(function(response) {
        console.log('[targetListService.getTargetList]', response);
        targetListService.model.currentList = response;
      }, function(err) {
        console.log('[targetListController.init], Error: ' + err.statusText + '. Code: ' + err.status);
      });

      // reset all chips and filters on page init
      chipsService.model = chipsService.resetChipsFilters(chipsService.model);
    }
  };
