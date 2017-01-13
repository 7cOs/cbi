'use strict';

module.exports = /*  @ngInject */
  function notesController($scope, $state, $mdDialog, $timeout, $filter, $window, $location, notesService, userService, Upload, moment) {

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
    vm.notesOpen = false;
    vm.notesClose = notesClose;
    vm.fileUploadActive = true;
    vm.uploadFiles = uploadFiles;

    // Temp data
    vm.noteTopics = [
      'Distribution',
      'Display',
      'Space',
      'Price',
      'General / Account information'
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
    vm.openCreateNote = openCreateNote;
    vm.createNote = createNote;
    vm.deleteNote = deleteNote;
    vm.toggleDelete = toggleDelete;
    vm.cancelNewNote = cancelNewNote;
    vm.updateNote = updateNote;
    vm.showImage = showImage;
    vm.isAuthor = isAuthor;
    vm.mailNote = mailNote;
    vm.formatEmailString = formatEmailString;
    vm.saveEditedNote = saveEditedNote;

    init();

    // **************
    // PUBLIC METHODS
    // **************

    function notesClose() {
      $scope.notesOpen = false;
      vm.notes = [];
    }

    function isEditing(note, cancel) {
      note.editMode = !note.editMode;
      if (cancel) {
        note.body = vm.cachedNote.body;
        note.title = vm.cachedNote.title;
      } else {
        vm.cachedNote = angular.copy(note);
      }
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
      if (!vm.newNote.title || vm.newNote.title === '' || vm.newNote.title === null) {
        vm.invalidCreateNote = true;
        return;
      } else {
        vm.invalidCreateNote = false;
      }
      vm.loading = true;
      data.author = 'Me';
      var accountId = notesService.model.accountId;

      notesService.createNote(data, notesService.model.accountId).then(function(success) {
        var payload = {
          'action': '',
          'objectType': '',
          'objectID': '',
          'salesforceUserNoteID': ''
        };

        data.date = moment.utc().format();
        data.id = success.successReturnValue[0].id;
        vm.notes.push(data);
        jumpToNotesTop();
        setNoteAuthor();

        payload.action = 'ADDED_NOTE';
        payload.objectType = notesService.model.currentStoreProperty.toUpperCase();
        payload.objectId = accountId;
        payload.salesforceUserNoteID = success.successReturnValue[0].id;

        userService.createNotification(userService.model.currentUser.employeeID, payload);

        vm.newNote = null;
        vm.creatingNote = false;
        vm.loading = false;
      });
    }

    function saveEditedNote(note) {
      if (note.title === '' || note.title === null) {
        note.invalidNote = true;
        return;
      } else {
        note.invalidNote = false;
      }
      vm.loading = true;
      note.date = moment.utc().format();

      notesService.updateNote(note).then(function(success) {
        notesService.accountNotes().then(function(success) {
          vm.notes = success;
          jumpToNotesTop();
          setNoteAuthor();
          vm.loading = false;
        });
      });
    }

    function toggleDelete(note) {
      note.deleteConfirmation = !note.deleteConfirmation;
    }

    function deleteNote(data, accountId) {
      vm.loading = true;
      notesService.deleteNote(data.id).then(function(success) {
       var index = vm.notes.indexOf(data);
       vm.notes.splice(index, 1);
       setNoteAuthor();
       vm.loading = false;
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
      note.readMore = true;
    }

    // Upload files to Salesforce
    // This is a temporary function based on the plugin-demo
    // TODO make active with SF
    function uploadFiles(files) {
      // vm.fileUploading = true;
      vm.files = files;
      if (files && files.length) {
        Upload.upload({
          url: '/sfdc/createAttachment',
          data: {
            noteId: 'a2Xg0000000IhBtEAK',
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

    function isAuthor(authorId) {
      return userService.model.currentUser.employeeID === authorId;
    }

    function mailNote(note) {
      var emailString,
          currentAccount,
          updatedNoteBody;

      currentAccount = notesService.model;

      updatedNoteBody = formatEmailString(note.body);

      if (notesService.model.currentStoreProperty === 'subaccount' || notesService.model.currentStoreProperty === 'account') {
        emailString = 'mailto:';
        emailString += '?subject=' + currentAccount.currentStoreName + ': Note: ' + note.title;
        emailString += '&body=' + currentAccount.currentStoreName + '%0D%0A%0D%0A' + updatedNoteBody;
        $window.location = emailString;
      }

      if (notesService.model.currentStoreProperty === 'store') {
        emailString = 'mailto:';
        emailString += '?subject=' + currentAccount.currentStoreName + ': Note: ' + note.title;
        emailString += '&body=' + currentAccount.currentStoreName + '%0D%0A%0D%0A';
        emailString += currentAccount.address + '%0D%0A%0D%0A';
        emailString += 'TDLinx: ' + currentAccount.tdlinx + '%0D%0A%0D%0A';
        emailString += '%0D%0A%0D%0A' + updatedNoteBody;
        $window.location = emailString;
      }

      if (notesService.model.currentStoreProperty === 'distributor') {
        emailString = 'mailto:';
        emailString += '?subject=' + currentAccount.currentStoreName + ': Note: ' + note.title;
        emailString += '&body=' + currentAccount.currentStoreName + '%0D%0A%0D%0A';
        emailString += currentAccount.address + '%0D%0A%0D%0A';
        emailString += 'ID: ' + currentAccount.accountId + '%0D%0A%0D%0A';
        emailString += '%0D%0A%0D%0A' + updatedNoteBody;
        $window.location = emailString;
      }
    }

    function formatEmailString(note) {
      note = note.replace(/<\/?div[^>]*>/g, '');
      note = note.replace(/<\/?p[^>]*>|<\/?ul[^>]*>/g, '%0D%0A');
      note = note.replace(/<\/?br[^>]*>|<\/?li[^>]*>/g, ' ');
      note = note.replace(/<\/?b[^>]*>/g, '');
      note = note.replace(/<\/?[^>]+(>|$)/g, '');

      return note;
    }

    // ***************
    // PRIVATE METHODS
    // ***************

    function init() {
    }

    function jumpToNotesTop() {
      angular.element(document.querySelector('.note-container'))[0].scrollTop = 0;
    }

    function setNoteAuthor() {
      angular.forEach(vm.notes, function(note) {
        moment(note.date).format();
        if (isAuthor(note.authorId)) {
          note.author = 'Me';
        }
      });
    }

    $scope.$on('notes:opened', function(event, data, account) {
      var accountElement = '#' + account.noteId;

      vm.loading = true;

      notesService.model.accountId = account.id[0];

      notesService.accountNotes().then(function(success) {

        vm.notes = success;
        vm.loading = false;
        setNoteAuthor();

      if (vm.notes.length && account.noteId) {
        setTimeout(function() {
          var num = angular.element(document.querySelector(accountElement))[0].offsetTop;
          angular.element(document.querySelector('.note-container'))[0].scrollTop = num;
        });
      }
      });

      $scope.notesOpen = data;
      vm.storeName = notesService.model.currentStoreName;
      // vm.storeName = account.name;
      $location.hash(account.noteId);
    });
  };
