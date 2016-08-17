'use strict';

function NotesController($scope, $state, $mdDialog, $timeout, notesService, Upload) {

  // ****************
  // CONTROLLER SETUP
  // ****************

  // Initial variables
  var vm = this;

  // Defaults
  vm.loading = true;
  vm.editMode = false;
  vm.numLimit = 150;
  vm.creatingNote = false;
  vm.deleteConfirmation = false;
  vm.inputToggle = false;
  vm.notesOpen = false;
  vm.notesClose = notesClose;
  vm.fileUploadActive = true;
  vm.uploadFiles = uploadFiles;

  // Temp data
  vm.noteTopics = [
    'Distribution',
    'Display',
    'Cold box / shelf',
    'Price',
    'Account information',
    'General visit'
  ];
  vm.attachments = [
    {
      name: 'IMG1009.PNG',
      fileType: 'PNG',
      fileSize: '3.4 MB',
      thumbnail: 'https://scontent.xx.fbcdn.net/t31.0-8/13653130_733144425894_7777495390696756765_o.jpg',
      url: 'https://scontent.xx.fbcdn.net/t31.0-8/13653130_733144425894_7777495390696756765_o.jpg'
    },
    {
      name: 'IMG1008.PNG',
      fileType: 'PNG',
      fileSize: '2.3 MB',
      thumbnail: 'http://r.ddmcdn.com/s_f/o_1/APL/uploads/2015/04/150896.001.01.197_20150429_121257.jpg',
      url: 'http://r.ddmcdn.com/s_f/o_1/APL/uploads/2015/04/150896.001.01.197_20150429_121257.jpg'
    },
    {
      name: 'DOC1976.DOC',
      fileType: 'DOC',
      fileSize: '1.4 KB',
      url: ''
    },
    {
      name: 'DOC5150.XLS',
      fileType: 'XLS',
      fileSize: '9.6 KB',
      url: ''
    },
    {
      name: 'DOC1980.MP4',
      fileType: 'MP4',
      fileSize: '12.4 KB',
      url: ''
    },
    {
      name: 'DOC5150.MP3',
      fileType: 'MP3',
      fileSize: '9.6 KB',
      url: ''
    },
    {
      name: 'DOC5150.TXT',
      fileType: 'OTHER',
      fileSize: '9.6 KB',
      url: ''
    },
    {
      name: 'DOC5150.PDF',
      fileType: 'PDF',
      fileSize: '9.6 KB',
      url: ''
    },
    {
      name: 'DOC5150.PPT',
      fileType: 'PPT',
      fileSize: '9.6 KB',
      url: ''
    },
    {
      name: 'DOC5150.ZIP',
      fileType: 'ZIP',
      fileSize: '9.6 KB',
      url: ''
    }
  ];

  // Expose public methods
  vm.isEditing = isEditing;
  vm.openNotes = openNotes;
  vm.readMore = readMore;
  vm.readLess = readLess;
  vm.openCreateNote = openCreateNote;
  vm.createNote = createNote;
  vm.deleteNote = deleteNote;
  vm.toggleDelete = toggleDelete;
  vm.cancelNewNote = cancelNewNote;
  vm.updateNote = updateNote;
  vm.showInput = showInput;
  vm.showImage = showImage;

  init();

  // **************
  // PUBLIC METHODS
  // **************

  function notesClose() {
    $scope.notesOpen = false;
  }

  function showInput() {
    vm.inputToggle = !vm.inputToggle;
  }

  function isEditing(note) {
    note.editMode = !note.editMode;
  }

  function openCreateNote() {
    vm.creatingNote = !vm.creatingNote;
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

  function showImage (attachment) {
    attachment.visible = !attachment.visible;
  };

  function createNote(data, accountId) {
    data.author = 'Me';
    data.date = Date.now();
    notesService.createNote().then(function(success) {
      vm.notes.push(data);
      vm.newNote = {};
      vm.creatingNote = false;
    });
  }

  function toggleDelete(note) {
    note.deleteConfirmation = !note.deleteConfirmation;
  }

  function deleteNote(data, accountId) {
    // TODO implement real functionality
    // notesService.deleteNote().then(function(success) {
    //  var index = vm.notes.indexOf(data);
    //  vm.notes.splice(index, 1);
    // });
    var index = vm.notes.indexOf(data);
    vm.notes.splice(index, 1);
  }

  function updateNote (note) {
    // TODO real functionality, update to DB
    // add a cancel build out a temp buffer
    note.editMode = false;
  }

  function cancelNewNote(note) {
    vm.newNote = {};
    vm.creatingNote = false;
  }

  function readMore(note) {
    note.numLimit = 9999;
    note.noteDetails = true;
  }

  function readLess(note) {
    note.numLimit = 150;
    note.noteDetails = false;
  }

  // Upload files to Salesforce
  // This is a temporary function based on the plugin-demo
  // TODO make active with SF
  function uploadFiles(files) {
    vm.fileUploading = true;
    vm.files = files;
    if (files && files.length) {
      Upload.upload({
        url: 'https://angular-file-upload-cors-srv.appspot.com/upload',
        data: {
          files: files
        }
      }).then(function(response) {
        $timeout(function() {
          vm.result = response.data;
        });
      }, function(response) {
        if (response.status > 0) {
          vm.errorMsg = response.status + ': ' + response.data;
        }
      });
    }

    // Needs to flip after success or failure
    // vm.fileUploading = false;
  }

  // ***************
  // PRIVATE METHODS
  // ***************

  function init() {
    notesService.accountNotes().then(function(success) {
      vm.notes = success;
      vm.loading = false;
    });
  }

  $scope.$on('notes:opened', function(event, data) {
    $scope.notesOpen = data;
  });
}

module.exports =
  angular.module('orion.common.components.notes', [])
  .component('notes', {
    templateUrl: './app/shared/components/notes/notes.html',
    controller: NotesController,
    controllerAs: 'n'
  });
