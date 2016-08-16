'use strict';

module.exports =
  function styleGuideController($rootScope, $scope, $state, $mdDialog, notesService) {

    // ****************
    // CONTROLLER SETUP
    // ****************

    // Initial variables
    var vm = this;

    // Set page title for head and nav
    $rootScope.pageTitle = $state.current.title;

    // Services
    notesService.accountNotes().then(function(success) {
      vm.notes = success;
    });

    // Expose public methods
    vm.showModal = showModal;
    vm.closeModal = closeModal;
    vm.openNotes = openNotes;
    vm.noteOpenState = false;
    vm.openNotes = openNotes;

    // **************
    // PUBLIC METHODS
    // **************

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

    // Make notes available to the page
    function openNotes(val) {
      $rootScope.$broadcast('notes:opened', val);
    }
  };
