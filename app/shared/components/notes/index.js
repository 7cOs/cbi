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

  init();

  // ///////////////////////////////////////////////////////// Public Methods
  function isEditing(note) {
    note.editMode = !note.editMode;
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
<<<<<<< HEAD

  // Mock Data for bindings
  vm.notes = [
    {
      'Title__c': 'New Note About Beer',
      'Comments_RTF__c': 'Furthermore, a miserly ESB prays, and the Ballast Point related to an Ipswich Ale almost knows a Mango Beer behind a dude. An overpriced micro brew procrastinates, and a Modelo wastedly goes deep sea fishing with a King Henry. When you see a Corona Extra, it means that a bottle about a Fosters feels nagging remorse.',
      'author': 'Me',
      'date': '12 July, 2016 at 12:01 PM'
    },
    {
      'Title__c': 'Another Not About This Account',
      'Comments_RTF__c': 'Not much to write',
      'author': 'RJ LaCount',
      'date': '13 August at 10:22 AM'
    },
    {
      'Title__c': 'New Note About Beer',
      'Comments_RTF__c': 'Furthermore, a miserly ESB prays, and the Ballast Point related to an Ipswich Ale almost knows a Mango Beer behind a dude. An overpriced micro brew procrastinates, and a Modelo wastedly goes deep sea fishing with a King Henry. When you see a Corona Extra, it means that a bottle about a Fosters feels nagging remorse.',
      'author': 'Me',
      'date': '12 July, 2016 at 12:01 PM'
    },
    {
      'Title__c': 'New Note About Beer',
      'Comments_RTF__c': 'Furthermore, a miserly ESB prays, and the Ballast Point related to an Ipswich Ale almost knows a Mango Beer behind a dude. An overpriced micro brew procrastinates, and a Modelo wastedly goes deep sea fishing with a King Henry. When you see a Corona Extra, it means that a bottle about a Fosters feels nagging remorse.',
      'author': 'Me',
      'date': '12 July, 2016 at 12:01 PM'
    }
  ];
=======
>>>>>>> origin/develop
}

module.exports =
  angular.module('orion.common.components.notes', [])
  .component('notes', {
    templateUrl: './app/shared/components/notes/notes.html',
    controller: NotesController,
    controllerAs: 'n'
  });
