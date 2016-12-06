'use strict';

module.exports = /*  @ngInject */
  function styleGuideController($rootScope, $scope, $timeout, $state, $mdDialog, notesService) {

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

    // Defaults
    vm.inlineSearchResults = [
      'Result one',
      'Result two',
      'Result three',
      'Result four',
      'Result five',
      'Result six'
    ];

    // Expose public methods
    vm.showModal = showModal;
    vm.closeModal = closeModal;
    vm.openNotes = openNotes;
    vm.noteOpenState = false;
    vm.openNotes = openNotes;
    vm.showFlyout = showFlyout;
    vm.showSubMenu = false;

    // **************
    // PUBLIC METHODS
    // **************

    function showModal(ev) {
      var parentEl = angular.element(document.body);
      $mdDialog.show({
        clickOutsideToClose: false,
        parent: parentEl,
        scope: $scope.$new(),
        targetEvent: ev,
        templateUrl: './app/modules/style-guide/demo-modal.html'
      });
    };

    function showFlyout() {
      vm.showSubMenu = !vm.showSubMenu;
    }

    function closeModal() {
      $mdDialog.hide();
    }

    // ***************
    // PRIVATE METHODS
    // ***************

    // Make notes available to the page
    function openNotes(val) {
      $rootScope.$broadcast('notes:opened', val);
    }
  };
