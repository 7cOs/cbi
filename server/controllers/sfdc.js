'use strict';
/** ********************************************************
Salesforce integration
J. Scott Cromie
8/9/16
***********************************************************/
var sfdc = require('../_lib/sfdc.js');
var saml = require('../_lib/ssoSAML.js');
// var u = require('util');
module.exports = {
  getSFDCSession: getSFDCSession,
  getAttachmentData: getAttachmentData,
  createNote: createNote,
  deleteNote: deleteNote,
  deleteAttach: deleteAttach,
  searchAccounts: searchAccounts,
  accountNotes: accountNotes,
  testSFDCConn: testSFDCConn
};

function testSFDCConn(app, req, res) {
  var sfdcConnPromise = new Promise(function (resolve, reject) {
    var result = sfdc.testSFDCConn(app, req, res);
    if (result.isSuccess) {
      resolve(result);
    } else {
      reject(Error('Could not create a SFDC connection: ' + result.errorMessage));
    }
  });

  sfdcConnPromise.then(function (result) {
    console.log('The SFDC Connection is \n' + JSON.stringify(result.sfdcConn, null, '\t'));
    return result.sfdcConn;
  }, function (err) {
    console.err(err);
    return err;
  });
};

function getSFDCSession(app, req, res) {
  var sessionPromise = new Promise(function (resolve, reject) {
    var sessionId = saml.getSFDCSession(app, req, res);
    if (sessionId) {
      resolve(sessionId);
    } else {
      reject(Error('Could not generate a session id for this user'));
    }
  });
  sessionPromise.then(function (result) {
    var strResponse = JSON.stringify(result, null, '\t');
    console.log('The session Id is ' + strResponse);
    return strResponse;
  }, function (err) {
    console.err({'isSuccess': false,
                 'errorMessage': err});
    return err;
  });
};

function getAttachmentData(app, req, res) {
  var promise = new Promise(function (resolve, reject) {
    var blobData = sfdc.getAttachment(app, req, res);
    if (blobData) {
      resolve(blobData);
    } else {
      reject(Error('There are no attachments with this ParentId: ' + req.query.attachId));
    }
  });
  promise.then(function (result) {
  }, function (err) {
    console.log('There was an error getting the attachment');
    console.log(err);
  });
};

function deleteAttach(app, req, res) {
  sfdc.deleteAttach(app, req, res).then(function(result) {
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
