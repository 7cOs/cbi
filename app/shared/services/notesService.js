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
      accountNotes: accountNotes,
      updateNote: updateNote,
      userInfo: userInfo
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
          id = service.model.accountId,
          url = model.urlBase + 'accountNotes' + '?accountId=';

      url += id;

      $http.get(url)
        .then(accountNotesSuccess)
        .catch(accountNotesFail);

      function accountNotesSuccess(response) {
        var data = [];
        angular.forEach(response.data.successReturnValue, function(arr) {
          var noteAttachments = [];

          // moment(arr.CreatedDate).format();

          if (arr.Attachments !== null) {

            for (var i = 0; i < arr.Attachments.records.length; i++) {
              noteAttachments.push(
                {
                  fileName: arr.Attachments.records[i].Name,
                  bodyLength: arr.Attachments.records[i].BodyLength / 1000,
                  fileSize: filesizeFilter(arr.Attachments.records[i].BodyLength / 1000),
                  url: arr.Attachments.records[i].attributes.url,
                  fileType: arr.Attachments.records[i].ContentType,
                  attachId: arr.Attachments.records[i].Id
                }
              );
            };
          }

          data.push({
            id: arr.Id,
            title: arr.Type__c,
            body: arr.Comments_RTF__c,
            author: arr.CreatedBy.Name,
            authorId: arr.CreatedBy.CBI_Employee_ID__c,
            date: arr.CreatedDate,
            lastModifiedDate: arr.LastModifiedDate,
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

    function updateNote(note) {
      console.log(note);
      var notesPromise = $q.defer(),
      url = model.urlBase + 'updateNote?noteId=' + note.id,
      payload = note;

      $http.post(url, payload, {
        headers: {}
      })
      .then(updateNoteSuccess)
      .catch(updateNoteFail);

      function updateNoteSuccess(response) {
        console.log('[noteServie.updateNote] response: ', response);
        notesPromise.resolve(response.data);
      }

      function updateNoteFail(error) {
        notesPromise.reject(error);
      }

      return notesPromise.promise;
    }

    function deleteAttach(attachId) {
      var notePromise = $q.defer(),
          url = model.urlBase + 'deleteAttachment?attachmentId=' + attachId,
          payload = attachId;

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

    function userInfo() {
      var deferred = $q.defer(),
        url = model.urlBase + 'userInfo';

      $http.get(url)
        .then(function(response) {
          if (response.data && response.data.isSuccess && response.data.successReturnValue) {
            deferred.resolve(response.data.successReturnValue);
          } else {
            deferred.reject(response);
          }
        })
        .catch(function(err) {
          deferred.reject(err);
        });

      return deferred.promise;
    }

    function filesizeFilter(number) {
      if (number > 1000) {
        return (number / 1000).toFixed(2) + ' MB';
      }
      return number.toFixed(0) + ' KB';
    }
  };
