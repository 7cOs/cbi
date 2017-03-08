'use strict';

module.exports =
  angular.module('cf.common.components.notes', [])
  .component('notes', {
    template: require('./notes.pug'),
    controller: 'notesController',
    controllerAs: 'n'
  })
  .controller('notesController', require('./notesController'));
