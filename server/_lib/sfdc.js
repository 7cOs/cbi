'use strict';

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
/**
* sfdc.js: This controller contains the logic for the Salesforce.com endpoints
* @author J. Scott Cromie
* @version 1.0
* @since 2016-09-11
*/

function sfdcConn(app, req, res) {
  /**
  * sfdcConn: Create the Salesforce.com connection, or return the existing
  *           connection.
  */

  try {
    var saml = require('./ssoSAML.js');
    var jsforce = require('jsforce');
  } catch (e) {
    console.log('There was an error requiring the libraries: ' + e);
  };

  if (req.user === undefined) {
    req.user = app.get('config').auth.user;
  };

  if (!req.user.sfdcConn || req.user.sfdcConn === undefined) {
  // Get session promise from library

    return saml.getSFDCSession(app, req, res).then(function(sfdcSession) {
      sfdcSession = JSON.parse(sfdcSession);
      return new jsforce.Connection({
        instanceUrl: sfdcSession.instance_url,
        accessToken: sfdcSession.access_token
      });
    });
  } else {
    return req.user.sfdcConn;
  }
}

function deleteAttach(app, req, res) {
  /**
  * deleteAttach: deletes an attachment identified by the query parameter "attachId"
  *
  */
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
  /**
  * deleteNote: deletes an attachment identified by the query parameter "noteId"
  *
  */
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
  /**
  * searchAccounts: searches for an account using the search term in the "searchTerm" query parameter.
  *                 This uses Salesforce's SOSL querying language
  *                 (https://developer.salesforce.com/docs/atlas.en-us.soql_sosl.meta/soql_sosl/sforce_api_calls_sosl_about.htm)
  */
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
  /**
  * queryAccountNotes: searches for the notes and associated attachments using the query parameter "accountId"
  *                    This accountId can either be the TDLinx_Id__c Id or
  *                      the JDE_Address_Book_Number__c for the account.  This will then return the note and attachemnt
  *                      data.  The attachment data comes back in the form of a clickable link, which can then be embedded
  *                      into the resultant page by using it in an <img src=""> tag.
  *
  */
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
            .select('Id, Name, CreatedDate, BodyLength, ContentType, Description, LastModifiedDate, OwnerId, ParentId')
            .orderby('CreatedDate', 'DESC')
            .end()
            .where('Account__r.TDLinx_Id__c = \'' + strId + '\' or Account__r.JDE_Address_Book_Number__c = \'' + strId + '\'')
            .execute(function (err, records) {
              if (err) {
                return {'isSuccess': false,
                  'errorMessage': 'There was an SFDC API error retrieving the notes for this account: ' + err};
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
              res.send({'isSuccess': true,
                'successReturnValue': records
              });
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
  /**
  * createNote: Creates a new note for the account whose Id is passed in through the accountId query parameter.
  *
  */

  return sfdcConn(app, req, res).then(function(result) {
    try {
      var conn = result;
// Search for the correct Account Id
      if (!(req.query.accountId)) {
        var badAccountIdError = {'isSuccess': false,
          'errorMessage': 'There was no valid account id submitted.  Please make sure you have an account id (i.e. TD Linx Id)'
        };
        throw badAccountIdError;
      } else {
        var acctId = req.query.accountId;
        var theAccount = conn.search('FIND {' + acctId + '} IN ALL FIELDS RETURNING Account(Id, Name)',
          function (err, res) {
            if (err) {
              var badAccountIdInSFDCError = {'isSuccess': false,
                'errorMessage': 'There was no account in SFDC found with TDLinx Id or JDE Address Book Number ' + acctId + ': ' +  err
              };
              throw badAccountIdInSFDCError;
            } else {
              return res;
            }
          }
        );
// Once you have the correct account id, create a note and attach to that account Id.

        theAccount.then(function (result) {

          var accountId = result.searchRecords[0].Id;  // Only uses the first account it finds.
          if (accountId === null || accountId === undefined) {
            var badAccountIdInSFDCError = {'isSuccess': false,
              'errorMessage': 'There was no account in SFDC found with TDLinx Id or JDE Address Book Number ' + acctId
            };
            throw badAccountIdInSFDCError;
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
                var badNoteCreationError = {'isSuccess': false,
                  'errorMessage': 'Error creating an note: ' + err};
                throw badNoteCreationError;
              } else {
                try {
                  res.send({
                    'isSuccess': true,
                    'successReturnValue': result
                  });
                  return ret;
                } catch (err) {
                  var badReturnError = {'isSuccess': false,
                    'errorMessage': 'There was an error returning the successful result: ' + err};
                  throw badReturnError;
                }
              }
            });
          };
        }, function (err) {
          var badSFDCAccountError = {'isSuccess': false,
            'errorMessage': 'There was an error finding the correct account: ' + err};
          throw badSFDCAccountError;
        });
      };
    } catch (err) {
      console.error('Error creating a note: ' + err);
      res.send(err);
    };
  });
};

function getAttachment(app, req, res) {
  /**
  * getAttachments: gets a specific attachment based on the attachId query parameter.
  *                 You need to translate the binary data coming in to a form that can
  *                 be passed through a web service.
  *
  */
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
