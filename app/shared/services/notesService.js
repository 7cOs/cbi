'use strict';

module.exports = /*  @ngInject */
  function notesService($http, $q) {

    const tempData = {
    };

    const model = {
      urlBase: '/sfdc/',
      accountId: '',
      currentStoreName: '',
      currentStoreProperty: ''
    };

    const service = {
      model: model,
      getNote: getNote,
      deleteNote: deleteNote,
      createNote: createNote,
      deleteAttach: deleteAttach,
      accountNotes: accountNotes,
      updateNote: updateNote,
      userInfo: userInfo
    };

    return service;

    // this function appears to be obsolete, accountNotes is used throughout
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

          if (arr.Attachments !== null) {
            for (var i = 0; i < arr.Attachments.records.length; i++) {
              noteAttachments.push({
                fileName: arr.Attachments.records[i].Name,
                bodyLength: arr.Attachments.records[i].BodyLength / 1000,
                fileSize: filesizeFilter(arr.Attachments.records[i].BodyLength / 1000),
                url: arr.Attachments.records[i].attributes.compassUrl,
                fileType: arr.Attachments.records[i].ContentType,
                attachId: arr.Attachments.records[i].Id
              });
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

    function createNote(body, id) {
      const notePromise = $q.defer();
      const url = model.urlBase + 'createNote?accountId=' + id;

      $http.post(url, body, {
        headers: {}
      })
      .then(response => notePromise.resolve(response.data))
      .catch(error => notePromise.reject(error));

      return notePromise.promise;
    }

    function updateNote(note) {
      var notesPromise = $q.defer(),
      url = model.urlBase + 'updateNote?noteId=' + note.id,
      payload = note;

      $http.post(url, payload, {
        headers: {}
      })
      .then(updateNoteSuccess)
      .catch(updateNoteFail);

      function updateNoteSuccess(response) {
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
