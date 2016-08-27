'use strict';
/** ********************************************************
Salesforce integration Library
J. Scott Cromie
8/9/16
***********************************************************/
module.exports = {
  sfdcConn: sfdcConn,
  testSFDCConn: testSFDCConn,
  createNote: createNote,
  queryAccountNotes: queryAccountNotes,
  searchAccounts: searchAccounts,
  deleteAttach: deleteAttach,
  getAttachment: getAttachment,
  deleteNote: deleteNote
};

var u = require('util');

function sfdcConn(app, req, res) {
//  console.log('In sfdcConn - establishing the connection');
  try {
    var saml = require('./ssoSAML.js');
    var jsforce = require('jsforce');
  } catch (e) {
    console.log('There was an error requiring the libraries: ' + e);
  };

//  console.log('Libraries initiated.');

  if (req.user === undefined) {
    res.redirect('/');
  } else {
//    console.log('Getting the connection.  req.user.sfdcConn is ' + u.inspect(req.user.sfdcConn, null, ''));
    if (!req.user.sfdcConn || req.user.sfdcConn === undefined) {
  // Get session promise from library
//      console.log('No connection present.  Creating one now');
      var creatingSfdcSession = saml.getSFDCSession(app, req, res);
      /* sfdc connection is similar to
      {'access_token': '00Dm00000008fCJ!AQwAQIdgCEeNSQz1ZAZfyrtYqYLmLOnZdnOaQZLK1ON8NP6HVnEP9noL_9jFTP8Y9Xb2OqEy9tLLO4OevJQojKZsgvPShGcs',
      'instance_url: 'https://cbrands--CBeerDev.cs20.my.salesforce.com',
      'id': 'https://test.salesforce.com/id/00Dm00000008fCJEAY/005G0000004eNiRIAU',
      'token_type': 'Bearer'}
      */
      var creatingSfdcConnection = creatingSfdcSession.then(function(sfdcSession) {
        sfdcSession = JSON.parse(sfdcSession);
 /*       console.log('access_token: ' + sfdcSession.access_token);
        console.log('instance_url: ' + sfdcSession.instance_url);
        console.log('id: ' + sfdcSession.id);
        console.log('token_type: ' + sfdcSession.token_type);
*/
        return new jsforce.Connection({
          instanceUrl: sfdcSession.instance_url,
          accessToken: sfdcSession.access_token
        });
      });

      return creatingSfdcConnection.then(function(sfdcConnection) {
        req.user.sfdcConn = sfdcConnection;
        return sfdcConnection;
      });
    } else {
    //  console.log('Reusing existing connection: ' + req.user.sfdcConn);
      return req.user.sfdcConn;
    }
  }
  return {'isSuccess': true,
          'sfdcConn': req.user.sfdcConn};
}

function testSFDCConn(app, req, res) {
  var sfdcConnPromise = new Promise(function (resolve, reject) {
    try {
      var result = sfdcConn(app, req, res);
      resolve(result);
    } catch (e) {
      reject(('Could not create a SFDC connection: ' + e));
    }
  });

  sfdcConnPromise.then(function (result) {
    console.log('\n\n<---------------------------------------Connection Is ------------------------------------------>\n' + u.inspect(result) + '\n<---------------------------------------Connection Finished ------------------------------------------>');
    try {
      result.query('SELECT Id, Name FROM Account', function(err, res) {
        if (err) { return console.error(err); }
        console.log(res);
      });
    } catch (e) {
      res.send(e);
    }
  }, function (err) {
    res.send(err);
  });
};

function createNote(app, req, res) {

  var sfdc = sfdcConn(app, req, res);
  if (sfdc.isSuccess) {
    var conn = sfdc.sfdcConn;
    var theAccount = conn.search('FIND {' + req.query.accountid + '} IN ALL FIELDS RETURNING Account(Id, Name)',
      function (err, res) {
        if (err) {
          console.log('The account Id could not be found');
          return console.error(err);
        }
        return res;
      });

    theAccount.then(function (result) {
      var accountId = result.searchRecords[0].Id;  // Only uses the first account it finds.
      if (accountId === null || accountId === undefined) {
        return console('There was no account specified for the Id provided (' + req.accountId + '.');
      } else {
        conn.sobject('Note__c').create([{
          Account__c: accountId,
          Comments_RTF__c: req.query.body,
          Conversion_Flag__c: req.query.conversionflag,
      // CreatedById, CreatedDate, Id, IsDeleted, LastModifiedById, LastModifiedDate are system generated.
          Other_Type__c: req.query.othertype,
          Private__c: req.query.private,
          Soft_Delete__c: req.query.softdelete,
          Title__c: req.query.title,
          Type__c: req.query.type
        }],
        function (err, ret) {
          if (err) {
            console.log('Returning an error from createNote: ' + JSON.stringify(err, null, ''));
            return err;
/*  This is returning the reverse of what it should.  ret.success should be true, yet
    it thinks it's false.  Please verify.
                       }  else if (!ret.success) {
            console.log('There was an unknown error with the logic');
  */
          } else {
            return ret;
          }
        });
      };
    }, function (err) {
      var strResponse = JSON.stringify(err, null, '');
      console.log('ERROR:' + strResponse);
      return err;
    });
  } else {
    return sfdc;
  }
};

function deleteNote(app, req, res) {
  var sfdc = sfdcConn(app, req, res);
  if (sfdc.isSuccess) {
    var conn = sfdc.theSession;
    var response = '';
    if (req.query.noteId) {
      var noteId = req.query.noteId;
      response = conn.sobject('Note__c')
                     .delete(noteId,
                             function (err, ret) {
                               if (err || !ret.success) {
                                 return (err);
                               }
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
  } else {
    return sfdc;
  }
};

function getAttachment(app, req, res) {
  var sfdc = sfdcConn(app, req, res);
  if (sfdc.isSuccess) {
    var conn = sfdc.theSession;
    var theURL = '';
    var theId = req.query.noteId;

    var atts = conn.query('Select a.Owner.Name, a.Owner.Username, a.OwnerId, a.Name, a.IsPrivate, a.Id, a.Description, a.CreatedDate, a.CreatedById, a.ContentType, a.BodyLength, a.Body From Attachment a where ParentId = \'' + theId + '\'',
      function(err, result) {
        var retValue = '';

        if (err) { return console.error(err); }

        retValue = '{"Attachments": [';
        for (var att in result.records) {

          theURL = conn.instanceUrl + '/servlet/servlet.FileDownload?file=' + result.records[att].Id + '&sessionId=' + conn.accessToken;

          retValue = retValue + '{"Id": "' + result.records[att].Id + '",';

          retValue += '"Name": "' + result.records[att].Name + '",';
          retValue += '"attachmentURL": "' + theURL + '",';
          retValue += '"OwnerName": "' + result.records[att].Owner.Name + '",';
          retValue += '"OwnerUsername": "' + result.records[att].Owner.Username + '",';
          retValue += '"OwnerId": "' + result.records[att].OwnerId + '",';
          retValue += '"IsPrivate": "' + result.records[att].IsPrivate + '",';
          retValue += '"Description": "' + result.records[att].Description + '",';
          retValue += '"CreatedDate": "' + result.records[att].CreatedDate + '",';
          retValue += '"CreatedById": "' + result.records[att].CreatedById + '",';
          retValue += '"ContentType": "' + result.records[att].ContentType + '",';
          retValue += '"BodyLength": "' + result.records[att].BodyLength + '",';
          retValue += '"Body": "' + result.records[att].Body + '"},';
        }

        retValue = retValue.slice(0, -1);  // remove the trailing comma
        retValue += ']}';
        res.write(retValue);
        return (theURL);
      }
    );

    atts.then(function(result) {
      res.end();
      return (result);
    }, function(err) {
      return (err);
    });
  } else {
    return sfdc;
  }
};

/*
    TODO: There is a better way to write this: bring in the object and id, that can account for attachments and notes
   will revisit if we have time
*/
function deleteAttach(app, req, res) {
  var sfdc = sfdcConn(app, req, res);
  if (sfdc.isSuccess) {
    var conn = sfdc.theSession;
    var response = '';
    if (req.query.attachId) {
      var attachId = req.query.attachId;
      response = conn.sobject('Attachment')
                     .delete(attachId,
                                      function (err, ret) {
                                        if (err || !ret.success) {
                                          return (err);
                                        }
                                        return (ret);
                                      }
                             );
      if (response !== '') {
        return (response);
      } else {
        return {
          'isSuccess': 'false',
          'errorMessage': 'Salesforce did not return valid information'
        };
      }
    } else {
      return {
        'isSuccess': 'False',
        'ErrorString': 'No attachment Id was present in the URL'
      };
    }
  } else {
    return sfdc;
  }
};

function searchAccounts(app, req, res) {
  var sfdc = sfdcConn(app, req, res);
  if (sfdc.isSuccess) {
    var conn = sfdc.theSession;
    var searchTerm = req.query.searchTerm;
    var response = '';
    if (searchTerm !== '') {
      response = conn.search('FIND {' + searchTerm + '} IN ALL FIELDS RETURNING Account(Id, Name)',
                              function (err, res) {
                                if (err) {
                                  return console.error('There was an error in searchAccounts: ' + err);
                                }
                                var jsonData = JSON.stringify(res.searchRecords, null, '');
                                return jsonData;
                              }
                            );
      if (response !== '') {
        res.send(response);
      } else {
        return {
          'isSuccess': false,
          'ErrorString': 'Salesforce did not return valid information'
        };
      }
    } else {
      return {
        'isSuccess': 'False',
        'ErrorString': 'No search term was present in the URL'
      };
    }
  } else {
    return sfdc;
  }
};

function queryAccountNotes(app, req, res) {
  var sfdcConnPromise = new Promise(function (resolve, reject) {
    try {
      var result = sfdcConn(app, req, res);
      resolve(result);
    } catch (e) {
      reject(('Could not create a SFDC connection: ' + e));
    }
  });

  var acctNotes = sfdcConnPromise.then(function (result) {
 //   console.log('\n\n<---------------------------------------Account Notes Connection Is ------------------------------------------>\n' + u.inspect(result) + '\n<---------------------------------------Connection Finished ------------------------------------------>');
    try {
      var conn = result;
      var strId = '';

      if (req.query.accountId) {
        strId  = (req.query.accountId || req.query.TDLinx_Id__c);
      } else {
        return {
          'isSuccess': 'False',
          'ErrorMessage': 'There was no account Id'
        };
      }

      return (
        conn.sobject('Note__c')
            .select('Account__r.TDLinx_Id__c, Account__r.JDE_Address_Book_Number__c,  Type__c, Title__c, Soft_Delete__c, Private__c, OwnerId, Other_Type__c, Name, IsDeleted, Id, Comments_RTF__c, Account__c, CreatedDate, CreatedBy.Name')
            .include('Attachments')
            .select('Id, Name, CreatedDate')
            .orderby('CreatedDate', 'DESC')
            .end()
            .where('Account__r.TDLinx_Id__c = \'' + strId + '\' or Account__r.JDE_Address_Book_Number__c = \'' + strId + '\'')
            // .limit(10)
            .execute(function (err, records) {
              if (err) {
                return console.error(err);
              }
// set the URL on the image to include the url and session id
              for (var note in records) {
                if (records[note].Attachments) {
                  for (var theAtt in records[note].Attachments.records) {
                    records[note].Attachments.records[theAtt].attributes.url = conn.instanceUrl + records[note].Attachments.records[theAtt].attributes.url + '&sessionId=' + conn.sessionId;
                    var attachBlob = conn.sobject('Attachment').record(records[note].Attachments.records[theAtt].Id).blob('Body');
                    records[note].Attachments.records[theAtt].attributes.blobData = attachBlob;
                  }
                }
              }
              return (records);
            })
      );
    } catch (err) {
      var errMessage = 'There was an error in queryAccountNotes: ' + JSON.stringify(err, null, '');
      console.error(errMessage);
      return {'isSuccess': false,
              'errorMessage': errMessage};
    }
  }, function (err) {
    return {'isSuccess': false,
            'errorMessage': 'A connection to Salesforce could not be established: ' + err};
  });
  return {'isSuccess': true,
          'theNotes': acctNotes};
};
