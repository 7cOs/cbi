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
    vm.notesError = false;
    vm.editMode = false;
    vm.numLimit = 150;
    vm.creatingNote = false;
    vm.deleteConfirmation = false;
    vm.notesOpen = false;
    vm.notesClose = notesClose;
    vm.fileUploadActive = true;
    vm.noteHasBeenDeleted = false;
    vm.uploadSizeError = false;
    vm.uploadSizeErrorMessage = '';

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
    vm.showImage = showImage;
    vm.isAuthor = isAuthor;
    vm.mailNote = mailNote;
    vm.formatEmailString = formatEmailString;
    vm.saveEditedNote = saveEditedNote;
    vm.uploadFiles = uploadFiles;
    vm.deleteAttachment = deleteAttachment;
    vm.getMaxFileSize = getMaxFileSize;
    vm.addAttachment = addAttachment;

    init();

    // **************
    // PUBLIC METHODS
    // **************

    function notesClose() {
      $scope.notesOpen = false;
      vm.notes = [];
    }

    function isEditing(note, cancel) {
      vm.uploadSizeError = false;
      note.editMode = !note.editMode;
      if (cancel) {
        note.body = vm.cachedNote.body;
        note.title = vm.cachedNote.title;
      } else {
        vm.cachedNote = angular.copy(note);
      }
    }

    function openCreateNote() {
      vm.uploadSizeError = false;
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

      if (data.attachments && data.attachments.length) {
        vm.fileUploading = true;
      } else {
        vm.loading = true;
      }
      data.author = 'Me';

      var id;
      if (notesService.model.tdlinx) {
        id = notesService.model.tdlinx;
      } else {
        id = notesService.model.accountId;
      }

      notesService.createNote(data, id).then(function(success) {
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
        payload.objectId = id;
        payload.salesforceUserNoteID = success.successReturnValue[0].id;

        userService.createNotification(userService.model.currentUser.employeeID, payload);

        vm.newNote = null;
        vm.creatingNote = false;
        vm.loading = false;

        if (data.attachments && data.attachments.length) {
          uploadFiles(data.id, data.attachments);
        }
      }).catch(function() {
        vm.fileUploading = false;
        vm.notesError = true;
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

      notesService.updateNote(note).then(function(updateSuccess) {
        notesService.accountNotes().then(function(success) {
          vm.notes = success;
          jumpToNotesTop();
          setNoteAuthor();
          vm.loading = false;
        }).catch(function() {
          vm.notesError = true;
        });
      }).catch(function() {
        vm.notesError = true;
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
      }).catch(function() {
        vm.notesError = true;
      });
    }

    function cancelNewNote(note) {
      vm.newNote = {};
      vm.creatingNote = false;
    }

    function readMore(note) {
      note.readMore = true;
    }

    function addAttachment(note, file, invalidFile) {
      vm.uploadSizeError = false;

      if (invalidFile) {
        vm.uploadSizeErrorMessage = 'File exceeds the 10MB limit. Please try again.';
        vm.uploadSizeError = true;
      } else if (file) {
        file.parsedSize = parseFileSize(file.size);

        if (!note.attachments) note.attachments = [];

        if (canAttachFile(file.size, note.attachments)) {
          if (note.editMode) {
            vm.fileUploading = true;
            uploadFiles(note.id, [file]);
          } else {
            note.attachments.push(file);
          }
        } else {
          vm.uploadSizeErrorMessage = 'Attaching this file puts you over the 10MB limit.';
          vm.uploadSizeError = true;
        }
      }
    }

    // Upload files to Salesforce
    function uploadFiles(noteId, attachments) {
      Upload.upload({
        url: '/sfdc/createAttachment',
        data: {
          noteId: noteId,
          files: attachments
        }
      }).then(function(response) {
        vm.result = response.data;
        vm.loading = true;
        vm.fileUploading = false;

        notesService.accountNotes().then(function(success) {
          vm.notes = success;
          vm.loading = false;
          setNoteAuthor();
        }).catch(function() {
          vm.notesError = true;
        });
      }).catch(function() {
        vm.fileUploading = false;
        vm.notesError = true;
      });
    }

    function deleteAttachment(data) {
      vm.loading = true;
      notesService.deleteAttach(data.attachId).then(function(deleteSuccess) {
        notesService.accountNotes().then(function(success) {
          vm.notes = success;
          vm.loading = false;
          setNoteAuthor();
        }).catch(function() {
          vm.notesError = true;
        });
      }).catch(function() {
        vm.notesError = true;
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

    function getExplicitSize(size) {
      let splitSize = size.split(' ');

      if (splitSize[1].toLowerCase() === 'kb') {
        return splitSize[0] * 1000;
      } else {
        return splitSize[0] * 1000000;
      }
    }

    function canAttachFile(newFileSize, currentAttachments) {
      if (!currentAttachments.length) return true;
      else {
        const tenMBSizeLimit = 10000000;
        const currentAttachmentSize = currentAttachments.reduce((fileSize, file) => {
          if (!file.size) {
            file.size = getExplicitSize(file.fileSize);
          }
          return fileSize + file.size;
        }, 0);
        return (currentAttachmentSize + newFileSize) <= tenMBSizeLimit;
      }
    }

    $scope.$on('notes:opened', function(event, data, account) {
      var accountElement = '#' + account.noteId;

      vm.notesError = false;
      vm.loading = true;

      account.id.length > 1 ? notesService.model.accountId = account.id[1] : notesService.model.accountId = account.id[0];

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
      }).catch(function() {
        vm.notesError = true;
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
