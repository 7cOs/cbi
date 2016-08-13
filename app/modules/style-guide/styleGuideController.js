'use strict';

module.exports =
  function styleGuideController($rootScope, $scope, $state, $mdDialog, notesService) {
    var vm = this;

    // Set page title for head and nav
    $rootScope.pageTitle = $state.current.title;

    // Map public methods to scope
    vm.showModal = showModal;
    vm.closeModal = closeModal;

    notesService.accountNotes().then(function(success) {
      vm.notes = success;
    });
    function showModal(ev) {
      var parentEl = angular.element(document.body);
      $mdDialog.show({
        clickOutsideToClose: true,
        parent: parentEl,
        scope: $scope.$new(),
        targetEvent: ev,
        templateUrl: './app/modules/style-guide/demo-modal.html'
      });
    };

    function closeModal() {
      $mdDialog.hide();
    }
  };
