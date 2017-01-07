'use strict';

module.exports = /*  @ngInject */
  function notesService($http, $q) {

    var tempData = {
    };

    var model = {
      urlBase: '/sfdc/',
      accountId: '',
      currentStoreName: '',
      currentStoreProperty: ''
    };

    var service = {
      model: model,
      getNote: getNote,
      deleteNote: deleteNote,
      createNote: createNote,
      deleteAttach: deleteAttach,
      searchAccounts: searchAccounts,
      accountNotes: accountNotes
    };

    return service;

    function getNote(noteId) {
      var notesPromise = $q.defer(),
          url = model.urlBase + 'createNote?accountId=' + model.accountId,
          data = {'read': true};

      $http.get(url, data)
        .then(getNoteSuccess)
        .catch(getNoteFail);

      function getNoteSuccess(response) {
        // notesPromise.resolve(response.data);
        // uncomment above and remove below when services are ready
        notesPromise.resolve(tempData.noteGetResponse);
      }

      function getNoteFail(error) {
        notesPromise.reject(error);
      }

      return notesPromise.promise;
    }

    function accountNotes() {
      var notesPromise = $q.defer(),
          url = model.urlBase + 'accountNotes' + '?accountId=' + model.accountId;

      $http.get(url)
        .then(accountNotesSuccess)
        .catch(accountNotesFail);

      function accountNotesSuccess(response) {
        var data = [];
        angular.forEach(response.data.successReturnValue, function(arr) {
          var noteAttachments = [];

          if (arr.Attachments !== null) {

            for (var i = 0; i < arr.Attachments.records.length; i++) {
              noteAttachments.push(
                {
                  fileName: arr.Attachments.records[i].Name,
                  fileSize: filesizeFilter(arr.Attachments.records[i].BodyLength / 1000),
                  url: arr.Attachments.records[i].attributes.url
                }
              );
            };
          }

          data.push({
            id: arr.Id,
            title: arr.Title__c,
            body: arr.Comments_RTF__c,
            author: arr.CreatedBy.Name,
            date: arr.CreatedDate,
            attachments: noteAttachments
          });
        });
        notesPromise.resolve(data);
      }

      function accountNotesFail(error) {
        notesPromise.reject(error);
      }

      return notesPromise.promise;
    }

    function searchAccounts(noteId) {
      var notesPromise = $q.defer(),
          url = model.urlBase + 'note',
          data = {'read': true};

      $http.get(url, data)
        .then(searchAccountsSuccess)
        .catch(searchAccountsFail);

      function searchAccountsSuccess(response) {
        notesPromise.resolve(response.data);
      }

      function searchAccountsFail(error) {
        notesPromise.reject(error);
      }

      return notesPromise.promise;
    }

    function createNote(body) {
      var notePromise = $q.defer(),
          url = model.urlBase + 'createNote?accountId=' + model.accountId,
          payload = body;

      $http.post(url, payload, {
        headers: {}
      })
      .then(createNoteSuccess)
      .catch(createNoteFail);

      function createNoteSuccess(response) {
        console.log('[noteService.createNote] response: ', response);
        notePromise.resolve(response.data);
      }

      function createNoteFail(error) {
        notePromise.reject(error);
      }

      return notePromise.promise;
    }

    function deleteAttach(noteId) {
      var notePromise = $q.defer(),
          url = model.urlBase + 'create-note',
          payload = {};

      $http.delete(url, payload, {
        headers: {}
      })
      .then(deleteAttachSuccess)
      .catch(deleteAttachFail);

      function deleteAttachSuccess(response) {
        console.log('[noteService.deleteAttach] response: ', response);
        notePromise.resolve(response.data);
      }

      function deleteAttachFail(error) {
        notePromise.reject(error);
      }

      return notePromise.promise;
    }

    function deleteNote(noteId) {
      var notePromise = $q.defer(),
          url = model.urlBase + 'deleteNote?noteId=' + noteId,
          payload = {};

      $http.delete(url, payload, {
        headers: {}
      })
      .then(deleteNoteSuccess)
      .catch(deleteNoteFail);

      function deleteNoteSuccess(response) {
        console.log('[noteService.deleteNote] response: ', response);
        notePromise.resolve(response.data);
      }

      function deleteNoteFail(error) {
        notePromise.reject(error);
      }

      return notePromise.promise;
    }

    function filesizeFilter(number) {
      if (number > 1000) {
        return (number / 1000).toFixed(2) + ' MB';
      }
      return number.toFixed(0) + ' KB';
    }
  };
