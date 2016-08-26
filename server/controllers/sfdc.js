'use strict';
/** ********************************************************
Salesforce integration
J. Scott Cromie
8/9/16
***********************************************************/

var sfdc = require('../_lib/sfdc.js');
var saml = require('../_lib/ssoSAML.js');
var utility = require('util');

exports.getAssertion = function(app, req, res) {
  res.send(saml.getSAMLAssertion('base64+URL', '7005936'));
  return true;
};

exports.SSOlogin = function(app, req, res) {
  var SSOLoginPromise = new Promise(function (resolve, reject) {
    var authnRequest = sfdc.sendAuthnRequest(app, req, res);
    console.log('Called sendAuthnRequest');

    if (authnRequest !== null) {
      console.log(utility.inspect(authnRequest, null, ''));
      resolve(authnRequest);
    } else {
      var err = 'There was an error trying to login: ' + err;
      reject(err);
    }
  });

  SSOLoginPromise.then(function (result) {
    console.log('Returned from sendAuthnRequest with ' + utility.inspect(result, null, ''));
    console.log('Will get Auth Token and Session Id next');                                      //  getAuthToken();                                        //  getSessionId();
  },
  function (err) {
    console.log(err);
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

exports.deleteAttach = function (app, req, res) {
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

exports.searchAccounts = function (app, req, res) {
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

// if (req.session.assertion !== undefined) console.log(req.session.assertion);

//  console.log(req.session.assertion);
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
//    console.log(err);
  });
};
