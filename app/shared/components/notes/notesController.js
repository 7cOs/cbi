'use strict';

module.exports = /*  @ngInject */
  function notesController($scope, $state, $mdDialog, $timeout, $filter, $window, $location, $analytics, notesService, userService, Upload, moment) {

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
    vm.noteHasBeenDeleted = false;

    // Temp data
    vm.noteTopics = [
      'Distribution',
      'Display',
      'Space',
      'Price',
      'General / Account information'
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
    vm.uploadFiles = uploadFiles;
    vm.deleteAttachment = deleteAttachment;
    vm.getMaxFileSize = getMaxFileSize;

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
      vm.newNote = {};
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
      vm.newNoteFiles ? vm.fileUploading = true : vm.loading = true;
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

        if (vm.newNoteFiles) {
          uploadFiles(vm.newNoteFiles, data.id);
        }
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
    function uploadFiles(files, noteId) {
      if (!noteId) {
        vm.newNoteFiles = files;
        if (vm.newNote.attachments) {
          angular.forEach(files, function(file) {
            file.parsedSize = parseFileSize(file.size);
            vm.newNote.attachments.push(file);
          });
        } else {
          files[0].parsedSize = parseFileSize(files[0].size);
          vm.newNote.attachments = files;
        }
        return;
      }

      vm.errorMsg = '';
      vm.fileUploading = true;
      vm.files = files;
      if (files && files.length) {
        Upload.upload({
          url: '/sfdc/createAttachment',
          data: {
            noteId: noteId,
            files: files
          }
        }).then(function(response) {
          $timeout(function() {
            vm.result = response.data;
            vm.loading = true;
            vm.fileUploading = false;

            notesService.accountNotes().then(function(success) {
              vm.notes = success;
              vm.loading = false;
              setNoteAuthor();
            });
          });
        }, function(response) {
          if (response.status > 0) {
            vm.errorMsg = response.status + ': ' + response.data;
            vm.fileUploading = false;
          }
        });
      } else {
        vm.errorMsg = 'Please ensure you\'re using a supported file type (.doc, .ppt, .xls, .gif, .jpg, .png, .pdf) and your total attachments are under 10MB.';
        vm.fileUploading = false;
      }

    }

    function deleteAttachment(data) {
      vm.loading = true;
      notesService.deleteAttach(data.attachId).then(function(success) {
        notesService.accountNotes().then(function(success) {
          vm.notes = success;
          vm.loading = false;
          setNoteAuthor();
        });
      });
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
        if (currentAccount.currentStoreName) emailString += '?subject=' + currentAccount.currentStoreName + ': Note: ' + note.title;
        if (currentAccount.currentStoreName) emailString += '&body=' + currentAccount.currentStoreName + '%0D%0A%0D%0A';
        if (currentAccount.address) emailString += currentAccount.address + '%0D%0A';
        if (currentAccount.city) emailString += currentAccount.city + ', ';
        if (currentAccount.state) emailString += currentAccount.state + ' ';
        if (currentAccount.zipCode) emailString += currentAccount.zipCode + '%0D%0A%0D%0A';
        if (currentAccount.tdlinx) emailString += 'TDLinx: ' + currentAccount.tdlinx + '%0D%0A%0D%0A';
        emailString += updatedNoteBody;
        $window.location = emailString;
      }

      if (notesService.model.currentStoreProperty === 'distributor') {
        emailString = 'mailto:';
        if (currentAccount.currentStoreName) emailString += '?subject=' + currentAccount.currentStoreName + ': Note: ' + note.title;
        if (currentAccount.currentStoreName) emailString += '&body=' + currentAccount.currentStoreName + '%0D%0A%0D%0A';
        if (currentAccount.address) emailString += currentAccount.address + '%0D%0A';
        if (currentAccount.city) emailString += currentAccount.city + ', ';
        if (currentAccount.state) emailString += currentAccount.state + ' ';
        if (currentAccount.zipCode) emailString += currentAccount.zipCode + '%0D%0A%0D%0A';
        if (currentAccount.accountId) emailString += 'ID: ' + currentAccount.accountId + '%0D%0A%0D%0A';
        emailString += updatedNoteBody;
        $window.location = emailString;
      }
    }

    function formatEmailString(note) {
      note = note.replace(/&#39;/g, '\'');
      note = note.replace(/&quot;/g, '"');
      note = note.replace(/<\/?div[^>]*>/g, '');
      note = note.replace(/<\/?p[^>]*>|<\/?ul[^>]*>/g, '%0D%0A');
      note = note.replace(/<\/?br[^>]*>|<\/?li[^>]*>/g, ' ');
      note = note.replace(/<\/?b[^>]*>/g, '');
      note = note.replace(/<\/?[^>]+(>|$)/g, '');

      return note;
    }

    function getMaxFileSize(note) {
      var maxSize = 10000, // Max upload total in KB
          totalSize = 0;

      if (!note.attachments) { return (maxSize).toString() + 'KB'; }

      angular.forEach(note.attachments, function(attachment) {
        var fileSize = attachment.bodyLength;
        if (totalSize + fileSize <= maxSize) {
          totalSize += fileSize;
        } else {
          totalSize = 10000;
        }
      });
      return (Math.round(10000 - totalSize)).toString() + 'KB';
    }

    // ***************
    // PRIVATE METHODS
    // ***************

    function init() {
    }

    function parseFileSize(s) {
      if ((s / 1000) < 1000) {
        return Math.round(s / 1000).toString() + 'KB';
      } else {
        return Math.round((s / 1000) / 1000).toString() + 'MB';
      }
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
            if (num) {
              angular.element(document.querySelector('.note-container'))[0].scrollTop = num;
            } else {
              jumpToNotesTop();
              vm.noteHasBeenDeleted = true;
            }
          });
        }
      });

      $scope.notesOpen = data;
      vm.storeName = notesService.model.currentStoreName;
      // vm.storeName = account.name;

      switch (notesService.model.currentStoreProperty) {
        case 'account':
          vm.analyticsCategory = 'Account Notes';
          break;
        case 'subaccount':
          vm.analyticsCategory = 'Subaccount Notes';
          break;
        case 'store':
          vm.analyticsCategory = 'Retailer Notes';
          break;
        case 'distributor':
          vm.analyticsCategory = 'Distributor Notes';
          break;
      }

      $analytics.eventTrack('Notes Tab', {category: vm.analyticsCategory, label: 'Open Notes Tab'});

      $location.hash(account.noteId);
    });
  };
