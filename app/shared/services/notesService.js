'use strict';

module.exports =
  function notesService($http, $q) {

    var urlBase = '/sfdc/';

    var tempData = {
    };

    return {
      getNote: getNote,
      deleteNote: deleteNote,
      createNote: createNote,
      deleteAttach: deleteAttach,
      searchAccounts: searchAccounts,
      accountNotes: accountNotes
    };

    function getNote(noteId) {
      var notesPromise = $q.defer(),
          url = urlBase + 'note',
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

    function accountNotes(id) {
      var notesPromise = $q.defer(),
          url = urlBase + 'accountNotes' + '?accountId=1432999';

      $http.get(url)
        .then(accountNotesSuccess)
        .catch(accountNotesFail);

      function accountNotesSuccess(response) {
        console.log(response.data[1]);
        notesPromise.resolve(response.data);
      }

      function accountNotesFail(error) {
        notesPromise.reject(error);
      }

      return notesPromise.promise;
    }

    function searchAccounts(noteId) {
      var notesPromise = $q.defer(),
          url = urlBase + 'note',
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

    function createNote(noteId) {
      var notePromise = $q.defer(),
          url = urlBase + 'create-note',
          payload = {};

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
          url = urlBase + 'create-note',
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
          url = urlBase + 'create-note',
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

  };
