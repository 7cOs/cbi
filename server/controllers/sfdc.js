'use strict';
/** ********************************************************
Salesforce integration
J. Scott Cromie
8/9/16
***********************************************************/
var sfdc = require('../_lib/sfdc.js'),
    logutil = require('../_lib/logutil');

module.exports = {
  createAttachment: createAttachment,
  getAttachmentData: getAttachmentData,
  createNote: createNote,
  deleteNote: deleteNote,
  updateNote: updateNote,
  deleteAttachment: deleteAttachment,
  searchAccounts: searchAccounts,
  accountNotes: accountNotes
};

function isErrorResponse(response) {
  return response && (response.isSuccess === false || response.isSuccess === 'false' || response.isSuccess === 'False');
}

function logErrorAndReturnGeneric(req, res, sfdcMethod, errorString) {
  logutil.logError(logutil.buildSFDCError(req.headers['x-request-id'], sfdcMethod, 'SFDC error encountered.', errorString));
  res.status(500).send({isSuccess: false, code: 500, message: logutil.GENERIC_ERROR_MSG});
}

function createAttachment(app, req, res) {
  sfdc
    .createAttachment(app, req, res)
    .then(function(result) {
      if (isErrorResponse(result)) {
        logErrorAndReturnGeneric(req, res, 'createAttachment', JSON.stringify(result));
      } else {
        res.send(result);
      }
    })
    .catch(function(err) {
      logErrorAndReturnGeneric(req, res, 'createAttachment', err.toString());
    });
}

function getAttachmentData(app, req, res) {
  try {
    sfdc.getAttachment(app, req, res).then(function(result) {
      // handle potential error case only - success case is when data is streamed back to client
      if (isErrorResponse(result)) {
        logErrorAndReturnGeneric(req, res, 'getAttachment', JSON.stringify(result));
      }
    });
  } catch (err) {
    logErrorAndReturnGeneric(req, res, 'getAttachment', err.toString());
  }
}

function deleteAttachment(app, req, res) {
  sfdc
    .deleteAttachment(app, req, res)
    .then(function(result) {
      if (isErrorResponse(result)) {
        logErrorAndReturnGeneric(req, res, 'deleteAttachment', JSON.stringify(result));
      } else {
        res.send(result);
      }
    })
    .catch(function(err) {
      logErrorAndReturnGeneric(req, res, 'deleteAttachment', err.toString());
    });
};

function deleteNote(app, req, res) {
  sfdc.deleteNote(app, req, res).then(function(result) {
    try {
      if (isErrorResponse(result)) {
        logErrorAndReturnGeneric(req, res, 'deleteNote', JSON.stringify(result));
      } else {
        res.send(result);
      }
    } catch (err) {
      // if there is a problem sending the response.
      logErrorAndReturnGeneric(req, res, 'deleteNote', err.toString());
    };
  }, function (err) {
    logErrorAndReturnGeneric(req, res, 'deleteNote', err.toString());
  });
};

function updateNote(app, req, res) {
  sfdc.updateNote(app, req, res).then(function(result) {
    try {
      if (isErrorResponse(result)) {
        logErrorAndReturnGeneric(req, res, 'updateNote', JSON.stringify(result));
      } else {
        res.send(result);
      }
    } catch (err) {
      logErrorAndReturnGeneric(req, res, 'updateNote', err.toString());
    };
  }, function(err) {
    logErrorAndReturnGeneric(req, res, 'updateNote', err.toString());
  });
};

function searchAccounts(app, req, res) {
  sfdc.searchAccounts(app, req, res).then(function(result) {
    try {
      if (isErrorResponse(result)) {
        logErrorAndReturnGeneric(req, res, 'searchAccounts', JSON.stringify(result));
      } else {
        res.send(result);
      }
    } catch (err) {
      // if there is a problem sending the response.
      logErrorAndReturnGeneric(req, res, 'searchAccounts', err.toString());
    };
  }, function (err) {
    logErrorAndReturnGeneric(req, res, 'searchAccounts', err.toString());
  });
};

function createNote(app, req, res) {

  sfdc.createNote(app, req, res).then(function(result) {
    if (isErrorResponse(result)) {
      logErrorAndReturnGeneric(req, res, 'createNote', JSON.stringify(result));
    }
  }, function (err) {
    logErrorAndReturnGeneric(req, res, 'createNote', err.toString());
  });
};

function accountNotes(app, req, res) {

  sfdc.queryAccountNotes(app, req, res).then(function(result) {
    try {
      if (isErrorResponse(result)) {
        logErrorAndReturnGeneric(req, res, 'queryAccountNotes', JSON.stringify(result || null));
      } else {
        res.send(result);
      }
    } catch (err) {
      // if there is a problem sending the response.
      logErrorAndReturnGeneric(req, res, 'queryAccountNotes', err.toString());
    };
  }, function (err) {
    logErrorAndReturnGeneric(req, res, 'queryAccountNotes', err.toString());
  });
};
