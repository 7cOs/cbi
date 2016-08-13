'use strict';

function NotesController($scope, $state, $mdDialog, notesService) {
  var vm = this;

  vm.pageName = $state.current.name;

  // Map public methods to scope
  vm.isEditing = isEditing;
  vm.openNotes = openNotes;

  init();

  // ///////////////////////////////////////////////////////// Public Methods
  function isEditing() {
    return true;
  }

  function openNotes(ev) {
    var parentEl = angular.element(document.body);
    $mdDialog.show({
      clickOutsideToClose: true,
      parent: parentEl,
      scope: $scope.$new(),
      targetEvent: ev
    });
  }

  function init() {
    notesService.accountNotes().then(function(success) {
      vm.notes = success;
    });
  }
}

module.exports =
  angular.module('orion.common.components.notes', [])
  .component('notes', {
    templateUrl: './app/shared/components/notes/notes.html',
    controller: NotesController,
    controllerAs: 'n'
  });
