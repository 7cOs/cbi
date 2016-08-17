'use strict';

module.exports =
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
    vm.inlineSearchInput = '';
    vm.inlineSearchShowResults = false;
    vm.inlineSearchLoading = false;
    vm.inlineSearchResults = [
      'Result one',
      'Result two',
      'Result three',
      'Result four',
      'Result five',
      'Result six'
    ];
    vm.inlineSearchChosenResult = '';

    // Expose public methods
    vm.showModal = showModal;
    vm.closeModal = closeModal;
    vm.openNotes = openNotes;
    vm.noteOpenState = false;
    vm.openNotes = openNotes;
    vm.inlineSearchAction = inlineSearchAction;
    vm.inlineSearchResultChosen = inlineSearchResultChosen;
    vm.inlineSearchClose = inlineSearchClose;

    // **************
    // PUBLIC METHODS
    // **************

    function inlineSearchAction() {
      vm.inlineSearchLoading = true;
      vm.inlineSearchShowResults = true;
      $timeout(function() {
        vm.inlineSearchLoading = false;
      }, 2000);
    }

    function inlineSearchResultChosen(result) {
      vm.inlineSearchChosenResult = result;
      vm.inlineSearchInput = '';
      inlineSearchClose();
    }

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

    // ***************
    // PRIVATE METHODS
    // ***************

    // Make notes available to the page
    function openNotes(val) {
      $rootScope.$broadcast('notes:opened', val);
    }

    function inlineSearchClose() {
      vm.inlineSearchShowResults = false;
    }
  };
