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
      var data = [];
      angular.forEach(success, function(arr) {
        data.push({
          title: arr.Title__c,
          body: arr.Comments_RTF__c,
          author: 'James Dean',
          date: 'Caturday August 13'
        });
      });

      console.log(data);

      vm.notes = data;
    });
  }

  // Mock Data for bindings
  vm.dead = [
    {
      'title': 'New Note About Beer',
      'text': 'Furthermore, a miserly ESB prays, and the Ballast Point related to an Ipswich Ale almost knows a Mango Beer behind a dude. An overpriced micro brew procrastinates, and a Modelo wastedly goes deep sea fishing with a King Henry. When you see a Corona Extra, it means that a bottle about a Fosters feels nagging remorse.',
      'author': 'Me',
      'date': '12 July, 2016 at 12:01 PM'
    },
    {
      'title': 'Another Not About This Account',
      'text': 'Not much to write',
      'author': 'RJ LaCount',
      'date': '13 August at 10:22 AM'
    }
  ];
}

module.exports =
  angular.module('orion.common.components.notes', [])
  .component('notes', {
    templateUrl: './app/shared/components/notes/notes.html',
    controller: NotesController,
    controllerAs: 'n'
  });
