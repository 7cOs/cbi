'use strict';

module.exports =
  function notesController($scope, $state, $mdDialog, $timeout, $filter, $window, notesService, userService, Upload, moment) {

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
      'Space',
      'General / Account information'
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
    vm.isAuthor = isAuthor;
    vm.mailNote = mailNote;
    vm.formatEmailString = formatEmailString;

    init();

    // **************
    // PUBLIC METHODS
    // **************

    function notesClose() {
      $scope.notesOpen = false;
      vm.notes = [];
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
        clickOutsideToClose: false,
        parent: parentEl,
        scope: $scope.$new(),
        targetEvent: ev
      });
    }

    function showImage (attachment) {
      attachment.visible = !attachment.visible;
    };

    function createNote(data) {
      data.author = 'Me';

      notesService.createNote(data, notesService.model.accountId).then(function(success) {
        data.date = moment.utc().format();
        vm.notes.push(data);

        vm.newNote = {};
        vm.creatingNote = false;
      });
    }

    function toggleDelete(note) {
      note.deleteConfirmation = !note.deleteConfirmation;
    }

    function deleteNote(data, accountId) {
      notesService.deleteNote(data.id).then(function(success) {
       var index = vm.notes.indexOf(data);
       vm.notes.splice(index, 1);
      });
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

    function isAuthor(author) {
      var authorFirstName,
          authorLastName,
          noteAuthor;

      authorFirstName = $filter('titlecase')(userService.model.currentUser.firstName);
      authorLastName = $filter('titlecase')(userService.model.currentUser.lastName);

      noteAuthor = authorFirstName + ' ' + authorLastName;

      if (noteAuthor === author) {
        return true;
      } else {
        return false;
      }
    }

    function mailNote(note) {
      var emailString,
          currentAccount,
          updatedNoteBody;

      currentAccount = notesService.model;

      updatedNoteBody = formatEmailString(note.body);
      console.log(updatedNoteBody);

      if (notesService.model.currentStoreProperty === 'subaccount' || notesService.model.currentStoreProperty === 'account') {
        emailString = 'mailto:';
        emailString += '?subject=Note: ' + note.title;
        emailString += '&body=' + currentAccount.currentStoreName + '%0D%0A%0D%0A' + updatedNoteBody;
        $window.location = emailString;
      }

      if (notesService.model.currentStoreProperty === 'store') {
        emailString = 'mailto:';
        emailString += '?subject=Note: ' + note.title;
        emailString += '&body=' + currentAccount.currentStoreName + '%0D%0A%0D%0A';
        emailString += 'here is where the STORE address would go%0D%0A';
        emailString += 'here would be the tdlinx code';
        emailString += '%0D%0A%0D%0A' + updatedNoteBody;
        $window.location = emailString;
      }

      if (notesService.model.currentStoreProperty === 'distributor') {
        emailString = 'mailto:';
        emailString += '?subject=Note: ' + note.title;
        emailString += '&body=' + currentAccount.currentStoreName + '%0D%0A%0D%0A';
        emailString += 'here is where the DISTRIBUTOR address would go%0D%0A';
        emailString += 'ID: ' + currentAccount.accountId + '%0D%0A%0D%0A';
        emailString += '%0D%0A%0D%0A' + updatedNoteBody;
        $window.location = emailString;
      }
    }

    function formatEmailString(note) {
      console.log(note, ' dirty');
      console.log('hit');
      // this does all tags
      note = note.replace(/<\/?div[^>]*>/g, '');
      note = note.replace(/<\/?p[^>]*>|<\/?ul[^>]*>/g, '%0D%0A');
      note = note.replace(/<\/?br[^>]*>|<\/?li[^>]*>/g, ' ');
      note = note.replace(/<\/?b[^>]*>/g, '');
      note = note.replace(/<\/?[^>]+(>|$)/g, '');

      console.log(note, ' clean');
      return note;
    }

    // ***************
    // PRIVATE METHODS
    // ***************

    function init() {
    }

    $scope.$on('notes:opened', function(event, data, account) {
      vm.loading = true;

      // this account id is hard coded as it is working
      // notesService.model.accountId = '7198554';
      notesService.model.accountId = account.id;

      notesService.accountNotes().then(function(success) {

        vm.notes = success;
        vm.loading = false;

        angular.forEach(vm.notes, function(note) {
          moment(note.date).format();
          console.log(note.author);

          if (isAuthor(note.author)) {
            note.author = 'Me';
          }
        });
      });
      $scope.notesOpen = data;
      vm.storeName = notesService.model.currentStoreName;
    });
  };
