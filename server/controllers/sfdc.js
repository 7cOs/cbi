'use strict';

/** ********************************************************
server.js

Salesforce connection server
J. Scott Cromie
8/9/16

***********************************************************/
// Setup dependencies
var sfdc = require('jsforce');
var env = 'Development';
var url = require('url');

// Constants
// todo: move these to a parameter file for easier and safer management
var SFDC_LOGIN_URL = 'https://test.salesforce.com';
// CORS doesn't allow local development, so we have to use the credentials.  Make sure you have fake credentials!
var SFDC_USERID = 'scromie@deloitte.com.cbeerdev';
var SFDC_PASSWORD = 'P455w0rd';
var SFDC_SECURITY_TOKEN = 'bWwvZxEPdoCzd14l7YJC82bOZ';

/*  console.log('clientId is: ' + oauth2.clientId);
  console.log('clientSecret is: ' + oauth2.clientSecret);
  console.log('redirectUri is ' + oauth2.redirectUri);
*/
if (env === 'Development') {
// if username/password is required, use this connection
  var conn = new sfdc.Connection({
    'loginUrl': SFDC_LOGIN_URL
  });
  conn.login(SFDC_USERID, SFDC_PASSWORD + SFDC_SECURITY_TOKEN, function (err, userInfo) {
    if (err) {
      return console.error(err);
    }
    console.log('Access Token is: ' + conn.accessToken);
    console.log('instanceURL is: ' + conn.instanceUrl);
  });
};

/* } else if (env === 'Production') {
// TODO: POPULATE SAML CONNECTION HERE.  Authorization Request example at https://jsforce.github.io/document/

// For Oauth2 authentication
var SFDC_APIKEY_CLIENT_ID = '3MVG9Km_cBLhsuPxAOA0lcWjRr2HtI8ZV1kwJkPRBoGxPVDnC4Rg_sy13EAzmqR6tQ6bhrzsfwIrGs1xSQI.W';
var SFDC_APIKEY_CLIENT_SECRET = '7973294975290016050';
var SFDC_APIKEY_REDIRECT_URI = 'https://127.0.0.1:3000/oauth/callback';
var oauth2 = new sfdc.OAuth2({
  clientId: SFDC_APIKEY_CLIENT_ID,
  clientSecret: SFDC_APIKEY_CLIENT_SECRET,
  redirectUri: SFDC_APIKEY_REDIRECT_URI
});
  console.log('oauth2 created - ready to call SFDC');
  app.get('/oauth/auth', function (req, res) {
    res.redirect(oauth2.getAuthorizationUrl({
      scope: 'api id web'
    }));
  });
  app.get('/oauth/callback', function (req, res) {
    console.log('successfully called back');
    var conn = new sfdc.Connection({
      oauth2: oauth2
    });
    var code = req.query.code;
    conn.authorize(code, function (err, userInfo) {
      if (err) {
        return console.error(err);
      }
      console.log('Access Token: ' + conn.accessToken);
      console.log('Instance URL: ' + conn.instanceUrl);
      console.log('User ID: ' + userInfo.id);
      console.log('Org ID: ' + userInfo.organizationId);
      req.session.accessToken = conn.accessToken;
      req.session.instanceUrl = conn.instanceUrl;
    });
  });
};
*/

exports.createNote = function(app, req, res) {
  conn.sobject('Note__c').create([{
    Title__c: 'Test Note 1',
    Account__c: '001m000000WSmZU'
  }, {
    Title__c: 'Test Note 2',
    Account__c: '001m000000WSmZU'
  }],
    function (err, rets) {
      if (err) {
        return console.error(err);
      }
      for (var i = 0; i < rets.length; i++) {
        if (rets[i].success) {
          console.log('Created record id : ' + rets[i].id);
        }
      }
    }
  );
};
//      res.send('<HTML><HEAD></HEAD><BODY>The /deleteNote endpoint is not ready yet.</BODY></HTML>');
function deleteNote(app, req, res) {
  var response = '';
  if (req.query.noteId) {
    var noteId = req.query.noteId;
    response = conn.sobject('Note__c')
      .delete(noteId,
        function (err, ret) {
          if (err || !ret.success) {
            console.error(err, ret);
            return (err);
          }
          console.log('Deleted NoteId ' + noteId + ' successfully');
          return (ret);
        });
    if (response !== '') {
      return (response);
    } else return ('Salesforce did not return valid information');
  } else {
    return ([{
      'isSuccess': 'False',
      'ErrorString': 'No noteId Id was present in the URL'
    }]);
  }
};

exports.promiseDeleteNote = function(app, req, res) {
  var promise = new Promise(function (resolve, reject) {
    console.log('Starting deleteNote');
    var response = deleteNote(app, req, res);
    if (response) {
      console.log('The response from SFDC was: ' + JSON.stringify(response, null, ''));
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
    console.log(err);
  });
};

function deleteAttach (app, req, res) {
  var response = '';
  if (req.query.attachId) {
    var attachId = req.query.attachId;
    response = conn.sobject('Attachment')
      .delete(attachId,
        function (err, ret) {
          if (err || !ret.success) {
            console.error(err, ret);
            return (err);
          }
          console.log('Deleted AttachId ' + attachId + ' successfully : ');
          return (ret);
        });
    if (response !== '') {
      return (response);
    } else return ('Salesforce did not return valid information');
  } else {
    return ([{
      'isSuccess': 'False',
      'ErrorString': 'No attachment Id was present in the URL'
    }]);
  }
};

exports.promiseDeleteAttach = function (app, req, res) {
  var promise = new Promise(function (resolve, reject) {
    console.log('Starting deleteAttach');
    var response = deleteAttach(app, req, res);
    if (response) {
      console.log('The response from SFDC was: ' + JSON.stringify(response, null, ''));
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
    console.log(err);
  });
};

function searchAccounts (app, req, res) {
  var searchTerm = req.query.searchTerm;
  var response = '';
  if (searchTerm !== '') {
    response = conn.search('FIND {' + searchTerm + '} IN ALL FIELDS RETURNING Account(Id, Name)',
      function (err, res) {
        if (err) {
          return console.error(err);
        }
        var jsonData = JSON.stringify(res.searchRecords, null, '');
        console.log('jsonData is: ' + jsonData);
        return jsonData;
          //                                  console.log(res);
          //                                  console.log(res.searchRecords);
          //                                  console.log(JSON.stringify(res.searchRecords));
      });
    if (response !== '') {
      return (response);
    } else return ('Salesforce did not return valid information');
  } else {
    return ([{
      'isSuccess': 'False',
      'ErrorString': 'No search term was present in the URL'
    }]);
  }
};

exports.promiseSearchAccounts = function (app, req, res) {
  var promise = new Promise(function (resolve, reject) {
    var records = searchAccounts(app, req, res);
    console.log('Finished getting Accounts');
    if (records) {
      console.log('The response from SFDC was: ' + JSON.stringify(records, null, ''));
      resolve(records);
    } else {
      reject(Error('There was no response from SFDC: ' + res.statusText));
    };
    promise.then(function (result) {
      var strResponse = JSON.stringify(result, null, '');
      console.log('Abount to send ' + strResponse + ' to the browser.');
      res.write(strResponse);
      res.end();
    }, function (err) {
      var strResponse = JSON.stringify(err, null, '');
      res.write(strResponse);
      res.end();
      console.log(err);
    });
  });
};

var strId = '';

function queryAccountNotes(app, req, res) {
//  strId = '1432999';
  if (req.query.accountId) {
    strId  = (req.query.accountId || req.query.TDLinx_Id__c);
  } else {
    return ([{
      'isSuccess': 'False',
      'ErrorMessage': 'There was no account Id'
    }]);
  }
  try {
    return (
      conn.sobject('Note__c')
          .select('Account__r.TDLinx_Id__c, Account__r.JDE_Address_Book_Number__c,  Type__c, Title__c, Soft_Delete__c, Private__c, OwnerId, Other_Type__c, Name, IsDeleted, Id, Comments_RTF__c, Account__c')
          .include('Attachments')
          .select('Id, Name, CreatedDate')
          .orderby('CreatedDate', 'DESC')
          .end()
          .where('Account__r.TDLinx_Id__c = \'' + strId + '\'')
          .execute(function (err, records) {
            if (err) {
              return console.error(err);
            }
            return (records);
          })
    );
    //                         console.log("records are still: " + records);
  } catch (err) {
    console.error(err);
    return JSON.stringify(err, null, '');
  }
};

exports.promiseAccountNotes = function(app, req, res) {
  var promise = new Promise(function (resolve, reject) {
    var records = queryAccountNotes(app, req, res);
    if (records) {
      resolve(records);
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
    console.log(err);
  });
};
