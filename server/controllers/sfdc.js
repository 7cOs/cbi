'use strict';
/** ********************************************************
Salesforce integration
J. Scott Cromie
8/9/16
***********************************************************/
var sfdc = require('../_lib/sfdc.js');
var saml = require('../_lib/ssoSAML.js');
var u = require('util');

exports.getAssertion = function(app, req, res) {
  var assertPromise = new Promise(function (resolve, reject) {
    var assertion = saml.getSAMLAssertion(app, req, res, 'base64+URL', '7005936');
    console.log('assertion is: ' + assertion);
    if (assertion) {
      console('assertion is: ' + assertion);
      resolve(assertion);
    } else {
      reject(Error('Could not generate an assertion for 7005936'));
    }
  });
  assertPromise.then(function (result) {
    console.log(result + ' came back.');
    res.send('<div>' + u.inspect(result) + '</div>');
  }, function (err) {
    console.err('There was an error: ' + err);
    res.send('<div><h1>ERROR GETTING ASSERTION</h1></div>');
  });
};

exports.getAttachmentData = function(app, req, res) {
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

exports.createNote = function(app, req, res) {
  var promise = new Promise(function (resolve, reject) {
    var records = sfdc.fnCreateNote(app, req, res);
    if (records) {
      resolve(records);
    } else {
      reject(Error('There was no response from SFDC: ' + res.statusText));
    }
  });
  promise.then(function (result) {
    var strResponse = JSON.stringify(result, null, '\t');
    res.write(strResponse);
    res.end();
  }, function (err) {
    var strResponse = JSON.stringify(err, null, '');
    res.write(strResponse);
    res.end();
  });
};

exports.deleteNote = function(app, req, res) {
  var promise = new Promise(function (resolve, reject) {
    var response = sfdc.fnDeleteNote(app, req, res);
    if (response) {
      resolve(response);
    } else {
      reject(Error('There was no response from SFDC: ' + res.statusText));
    }
  });
  promise.then(function (result) {
    var strResponse = JSON.stringify(result, null, '');
    res.write(strResponse);
    res.end();
  }, function (err) {
    var strResponse = JSON.stringify(err, null, '');
    res.write(strResponse);
    res.end();
  });
};

exports.deleteAttach = function(app, req, res) {
  var promise = new Promise(function (resolve, reject) {
    var response = sfdc.fnDeleteAttach(app, req, res);
    if (response) {
      resolve(response);
    } else {
      reject(Error('There was no response from SFDC: ' + res.statusText));
    }
  });
  promise.then(function (result) {
    var strResponse = JSON.stringify(result, null, '');
    res.write(strResponse);
    res.end();
  }, function (err) {
    var strResponse = JSON.stringify(err, null, '');
    res.write(strResponse);
    res.end();
  });
};

exports.searchAccounts = function(app, req, res) {
  var promise = new Promise(function (resolve, reject) {
    var records = sfdc.fnSearchAccounts(app, req, res);
    if (records) {
      resolve(records);
    } else {
      reject(Error('There was no response from SFDC: ' + res.statusText));
    };
    promise.then(function (result) {
      var strResponse = JSON.stringify(result, null, '');
      res.write(strResponse);
      res.end();
    }, function (err) {
      console.err('ERROR in promiseSearchAccounts: ' + JSON.stringify(err, null, ''));
      var strResponse = JSON.stringify(err, null, '');
      res.write(strResponse);
      res.end();
    });
  });
};

exports.accountNotes = function(app, req, res) {
  var promise = new Promise(function (resolve, reject) {
    var records = sfdc.queryAccountNotes(app, req, res);
    if (records) {
      resolve(records);
    } else {
      reject(Error('There was no response from SFDC: ' + res.statusText));
    }
  });
  promise.then(function (result) {
    console.log('records were returned from sfdc');
    var strResponse = JSON.stringify(result, null, '\t');
    res.write(strResponse);
    res.end();
  }, function (err) {
    var strResponse = JSON.stringify(err, null, '');
    res.write(strResponse);
    res.end();
  });
};

