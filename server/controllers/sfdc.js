'use strict';
/** ********************************************************
Salesforce integration
J. Scott Cromie
8/9/16
***********************************************************/
const sfdc = require('../_lib/sfdc.js'),
      logutil = require('../_lib/logutil');

module.exports = {
  userInfo: userInfo,
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

function userInfo(app, req, res) {
  sfdc.userInfo(app, req).then(function(result) {
    if (isErrorResponse(result)) {
      logErrorAndReturnGeneric(req, res, 'userInfo', JSON.stringify(result));
    } else {
      res.send(result);
    }
  }).catch(function(err) {
    logErrorAndReturnGeneric(req, res, 'userInfo', JSON.stringify(err));
  });
}

function createAttachment(app, req, res) {
  sfdc.createAttachment(app, req).then(function(result) {
    if (isErrorResponse(result)) {
      logErrorAndReturnGeneric(req, res, 'createAttachment', JSON.stringify(result));
    } else {
      res.send(result);
    }
  })
  .catch(function(err) {
    logErrorAndReturnGeneric(req, res, 'createAttachment', JSON.stringify(err));
  });
}

function getAttachmentData(app, req, res) {
  sfdc.getAttachment(app, req, res).then(function(result) {
    // handle potential error case only - success case is when data is streamed back to client
    if (isErrorResponse(result)) {
      logErrorAndReturnGeneric(req, res, 'getAttachment', JSON.stringify(result));
    }
  }).catch(function(err) {
    logErrorAndReturnGeneric(req, res, 'getAttachment', JSON.stringify(err));
  });
}

function deleteAttachment(app, req, res) {
  sfdc.deleteAttachment(app, req).then(function(result) {
    if (isErrorResponse(result)) {
      logErrorAndReturnGeneric(req, res, 'deleteAttachment', JSON.stringify(result));
    } else {
      res.send(result);
    }
  }).catch(function(err) {
    logErrorAndReturnGeneric(req, res, 'deleteAttachment', JSON.stringify(err));
  });
};

function deleteNote(app, req, res) {
  sfdc.deleteNote(app, req, res).then(function(result) {
    if (isErrorResponse(result)) {
      logErrorAndReturnGeneric(req, res, 'deleteNote', JSON.stringify(result));
    } else {
      res.send(result);
    }
  }).catch(function (err) {
    logErrorAndReturnGeneric(req, res, 'deleteNote', JSON.stringify(err));
  });
};

function updateNote(app, req, res) {
  sfdc.updateNote(app, req).then(function(result) {
    if (isErrorResponse(result)) {
      logErrorAndReturnGeneric(req, res, 'updateNote', JSON.stringify(result));
    } else {
      res.send(result);
    }
  }).catch(function(err) {
    logErrorAndReturnGeneric(req, res, 'updateNote', JSON.stringify(err));
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
  sfdc.createNote(app, req).then(function (result) {
    if (isErrorResponse(result)) {
      logErrorAndReturnGeneric(req, res, 'createNote', JSON.stringify(result));
    } else {
      res.send(result);
    }
  }).catch(function (err) {
    logErrorAndReturnGeneric(req, res, 'createNote', JSON.stringify(err));
  });
};

function accountNotes(app, req, res) {
  sfdc.accountNotes(app, req).then(function(result) {
    if (isErrorResponse(result)) {
      logErrorAndReturnGeneric(req, res, 'queryAccountNotes', JSON.stringify(result));
    } else {
      res.send(result);
    }
  }).catch(function (err) {
    logErrorAndReturnGeneric(req, res, 'queryAccountNotes', JSON.stringify(err));
  });
};
