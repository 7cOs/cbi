'use strict';

module.exports =
  function notesService($http, $q, apiHelperService) {

    var tempData = {
      notePatchResponse: {'status': 200}
    };

    return {
      markNoteAsRead: markNoteAsRead
    };

    function markNoteAsRead(noteId) {
      var notesPromise = $q.defer(),
          url = apiHelperService.request('/api/notes/' + noteId),
          data = {'read': true};

      $http.patch(url, data)
        .then(markNoteAsReadSuccess)
        .catch(markNoteAsReadFail);

      function markNoteAsReadSuccess(response) {
        // notesPromise.resolve(response.data);
        // uncomment above and remove below when services are ready
        notesPromise.resolve(tempData.notePatchResponse);
      }

      function markNoteAsReadFail(error) {
        notesPromise.reject(error);
      }

      return notesPromise.promise;
    }
  };
