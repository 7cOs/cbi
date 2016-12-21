'use strict';

module.exports =
  angular.module('cf.common.components.notes', [])
  .component('notes', {
    templateUrl: './app/shared/components/notes/notes.html',
    controller: 'notesController',
    controllerAs: 'n'
  })
  .controller('notesController', require('./notesController'));
