'use strict';
/** ********************************************************
Salesforce integration
J. Scott Cromie
8/9/16
***********************************************************/
var sfdc = require('../_lib/sfdc.js');
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

function createAttachment(app, req, res) {
  sfdc
    .createAttachment(app, req, res)
    .then(res.send)
    .catch(res.send);
}

function getAttachmentData(app, req, res) {
  try {
    sfdc.getAttachment(app, req, res);
  } catch (e) {
    console.error('There was an error getting attachments: ' + e);
  }
}

function deleteAttachment(app, req, res) {
  sfdc
    .deleteAttachment(app, req, res)
    .then(res.send)
    .catch(res.send);
};

function deleteNote(app, req, res) {
  sfdc.deleteNote(app, req, res).then(function(result) {
    try {
      res.send(result);
    } catch (err) {
      // if there is a problem sending the response.
      console.log(err);
      res.send(err);
    };
  }, function (err) {
    console.log(err);
    res.send(err);
  });
};

function updateNote(app, req, res) {
  sfdc.updateNote(app, req, res).then(function(result) {
    try {
      res.send(result);
    } catch (err) {
      console.log(err);
      res.send(err);
    };
  }, function(err) {
    console.log(err);
    res.send(err);
  });
};

function searchAccounts(app, req, res) {
  sfdc.searchAccounts(app, req, res).then(function(result) {
    try {
      res.send(result);
    } catch (err) {
      // if there is a problem sending the response.
      console.log(err);
      res.send(err);
    };
  }, function (err) {
    console.log(err);
    res.send(err);
  });
};

function createNote(app, req, res) {

  sfdc.createNote(app, req, res).then(function(result) {
    if (!result.isSuccess) {
      console.log(result.errorMessage);
      res.send(result.errorMessage);
    }
  }, function (err) {
    console.log(err);
    res.send(err);
  });
};

function accountNotes(app, req, res) {

  sfdc.queryAccountNotes(app, req, res).then(function(result) {
    try {
      res.send(result);
    } catch (err) {
      // if there is a problem sending the response.
      console.log(err);
      res.send(err);
    };
  }, function (err) {
    console.log(err);
    res.send(err);
  });
};
