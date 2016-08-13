'use strict';

function NotesController($scope, $state, $mdDialog, notesService) {
  var vm = this;

  vm.pageName = $state.current.name;

  // Map public methods to scope
  vm.isEditing = isEditing;
  vm.openNotes = openNotes;
  vm.editMode = false;
  vm.numLimit = 150;
  vm.readMore = readMore;
  vm.readLess = readLess;
  vm.openCreateNote = openCreateNote;
  vm.creatingNote = false;

  init();

  // ///////////////////////////////////////////////////////// Public Methods
  function isEditing(note) {
    note.editMode = !note.editMode;
    console.log(vm.editMode);
  }

  function openCreateNote() {
    vm.creatingNote = !vm.creatingNote;
    console.log(vm.creatingNote);
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

  function readMore() {
    vm.numLimit = 9999;
  }

  function readLess() {
    vm.numLimit = 150;
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
