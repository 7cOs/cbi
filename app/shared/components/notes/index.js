'use strict';

function NotesController($scope, $state, $mdDialog) {
  var vm = this;

  vm.pageName = $state.current.name;

  // Map public methods to scope
  // vm.actionOverlay = actionOverlay;

  init();

  // ///////////////////////////////////////////////////////// Public Methods

  /*
  function isChecked() {
    return ...
  };
  */

  function init() {
  }
}

module.exports =
  angular.module('orion.common.components.notes', [])
  .component('notes', {
    templateUrl: './app/shared/components/notes/notes.html',
    controller: NotesController,
    controllerAs: 'notes'
  });
