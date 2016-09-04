'use strict';
/** ********************************************************
Salesforce integration Library
J. Scott Cromie
8/9/16
***********************************************************/
module.exports = {
  sfdcConn: sfdcConn,
  createNote: createNote,
  queryAccountNotes: queryAccountNotes,
  searchAccounts: searchAccounts,
  deleteAttach: deleteAttach,
  getAttachment: getAttachment,
  deleteNote: deleteNote
};

// var u = require('util');

function sfdcConn(app, req, res) {
//  console.log('In sfdcConn - establishing the connection');
  try {
    var saml = require('./ssoSAML.js');
    var jsforce = require('jsforce');
  } catch (e) {
    console.log('There was an error requiring the libraries: ' + e);
  };

  if (req.user === undefined) {
    req.user = app.get('config').auth.user;
  };

  // console.log('Getting the connection.  req.user.sfdcConn is ' + JSON.stringify(req.user.sfdcConn));
  if (!req.user.sfdcConn || req.user.sfdcConn === undefined) {
  // Get session promise from library
//      console.log('No connection present.  Creating one now');
    return saml.getSFDCSession(app, req, res).then(function(sfdcSession) {
      sfdcSession = JSON.parse(sfdcSession);
      return new jsforce.Connection({
        instanceUrl: sfdcSession.instance_url,
        accessToken: sfdcSession.access_token
      });
    });
  } else {
    //  console.log('Reusing existing connection: ' + req.user.sfdcConn);
    return req.user.sfdcConn;
  }
}

function deleteAttach(app, req, res) {
  return sfdcConn(app, req, res).then(function(result) {
    try {
      var conn = result;
      if (req.query.attachId) {
        var attachId = req.query.attachId;
        return conn.sobject('Attachment').delete(attachId,
                                        function (err, res) {
                                          if (err || !res.success) {
                                            console.log('SFDC gave an error:');
                                            console.dir(err);
                                            return {
                                              'isSuccess': false,
                                              'errorMessage': err  // return the error from Salesforce
                                            };
                                          } else {
                                            return {
                                              'isSuccess': true,
                                              'searchRecords': res.searchRecords
                                            };
                                          }
                                        }).then(function(result) {
                                          return result;
                                        }, function(err) {
                                          return err;
                                        });
      } else {
        var badNoteIdError = {
          'isSuccess': 'False',
          'ErrorString': 'No noteId Id was present for delete.'
        };
        throw badNoteIdError;
      }
    } catch (err) {
      var generalError = {'isSuccess': false,
                          'errorMessage': err};
      throw generalError;
    }
  });
};

function deleteNote(app, req, res) {
  return sfdcConn(app, req, res).then(function(result) {
    try {
      var conn = result;
      if (req.query.noteId) {
        var noteId = req.query.noteId;
        return conn.sobject('Note__c').delete(noteId,
                                    function (err, res) {
                                      if (err || !res.success) {
                                        return {
                                          'isSuccess': false,
                                          'errorMessage': err  // return the error from Salesforce
                                        };
                                      } else {
                                        return {
                                          'isSuccess': true,
                                          'searchRecords': res.searchRecords
                                        };
                                      }
                                    }).then(function(result) {
                                      return result;
                                    }, function(err) {
                                      return err;
                                    });
      } else {
        var badNoteIdError = {
          'isSuccess': 'False',
          'ErrorString': 'No noteId Id was present for delete.'
        };
        throw badNoteIdError;
      }
    } catch (err) {
      var generalError = {'isSuccess': false,
                          'errorMessage': err};
      throw generalError;
    }
  });
};

function searchAccounts(app, req, res) {
  return sfdcConn(app, req, res).then(function(result) {
    try {
      var conn = result;
      var searchTerm = req.query.searchTerm;
      if (searchTerm) {
        return conn.search('FIND {' + searchTerm + '} IN ALL FIELDS RETURNING Account(Id, Name)',
                                    function (err, res) {
                                      if (err) {
                                        return {
                                          'isSuccess': false,
                                          'errorMessage': err  // return the error from Salesforce
                                        };
                                      } else {
                                        return {
                                          'isSuccess': true,
                                          'searchRecords': res.searchRecords
                                        };
                                      }
                                    }).then(function(result) {
                                      return result;
                                    }, function(err) {
                                      return err;
                                    });
      } else {
        return {
          'isSuccess': 'False',
          'errorMessage': 'No search term was present in the URL'
        };
      }
    } catch (err) {
      var theError = {'isSuccess': false,
                      'errorMessage': err};
    }
    throw theError;
  });
};

function queryAccountNotes(app, req, res) {
  return sfdcConn(app, req, res).then(function(result) {
    try {
      var conn = result;
      var strId = '';

      if (req.query.accountId) {
        strId  = req.query.accountId;
      } else {
        var badAccountIdError = {
          'isSuccess': 'False',
          'ErrorMessage': 'There was no account Id'
        };
        throw badAccountIdError;
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
                    var thisAtt = records[note].Attachments.records[theAtt];
                    var clickableLink = app.get('config').address + 'sfdc/getAttachment?attachId=' + thisAtt.Id;
                    thisAtt.attributes.url = clickableLink;
                  }
                }
              }
              return records;
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
};

function createNote(app, req, res) {
  return sfdcConn(app, req, res).then(function(result) {
    try {
      var conn = result;
// Search for the correct Account Id
      if (!(req.body.accountId)) {
        var badAccountIdError = {'isSuccess': false,
                                 'errorMessage': 'There was no valid account id submitted.  Please make sure you have an account id (i.e. TD Linx Id)'
                                };
        throw badAccountIdError;
      } else {
        var acctId;
        if (req.body.accountId) {
          acctId = req.body.accountId;
        } else {
          acctId = req.query.accountId;
        }
        var theAccount = conn.search('FIND {' + acctId + '} IN ALL FIELDS RETURNING Account(Id, Name)',
          function (err, res) {
            if (err) {
              console.log('The account Id could not be found');
              return console.error(err);
            }
            return res;
          });
// Once you have the correct account id, create a note and attach to that account Id.

        theAccount.then(function (result) {

          var accountId = result.searchRecords[0].Id;  // Only uses the first account it finds.
          if (accountId === null || accountId === undefined) {
            return console('There was no account specified for the Id provided (' + req.body.accountId + '.');
          } else {
            conn.sobject('Note__c').create([{
              Account__c: accountId,
              Comments_RTF__c: req.body.body,
              Conversion_Flag__c: req.body.conversionflag,
              // CreatedById, CreatedDate, Id, IsDeleted, LastModifiedById, LastModifiedDate are system generated.
              Other_Type__c: req.body.othertype,
              Private__c: req.body.private,
              Soft_Delete__c: req.body.softdelete,
              Title__c: req.body.title,
              Type__c: req.body.type
            }],
            function (err, ret) {
              if (err) {
                console.log('Returning an error from createNote: ' + JSON.stringify(err, null, ''));
                return err;
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
      };
    } catch (err) {
      console.error(err);
      return err;
    };
  });
};

function getAttachment(app, req, res) {
  try {
    return sfdcConn(app, req, res).then(function(result) {
    // In order to return a clickable link we need to issue a GET from our server
      var conn = result;
      var theAtt = conn.sobject('Attachment').record(req.query.attachId);
      var attBlob = theAtt.blob('Body');
      var buf = [];
      attBlob.on('data', function(data) {
        buf.push(data);
      });
      attBlob.on('end', function() {
        var contentStr = Buffer.concat(buf);
        res.send(contentStr);
      });
    }, function(err) {
      throw (err);
    });
  } catch (err) {
    console.error(err);
    return {'isSuccess': false,
            'errorMessage': 'No connection could be made to Salesforce.com: ' + err};
  }
};

