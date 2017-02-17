'use strict';

const saml = require('./ssoSAML.js'),
      jsforce = require('jsforce'),
      fs = require('fs');

module.exports = {
  sfdcConn: sfdcConn,
  userInfo: userInfo,
  createNote: createNote,
  queryAccountNotes: queryAccountNotes,
  searchAccounts: searchAccounts,
  deleteAttachment: deleteAttachment,
  getAttachment: getAttachment,
  createAttachment: createAttachment,
  deleteNote: deleteNote,
  updateNote: updateNote
};

/**
* sfdc.js: This controller contains the logic for the Salesforce.com endpoints
* @author J. Scott Cromie
* @version 1.0
* @since 2016-09-11
*/

function sfdcConn(app, req) {
  /**
  * sfdcConn: Create the Salesforce.com connection, or return the existing
  *           connection.
  */
  if (!req.user.sfdcConn) {
    return saml.getSFDCSession(app, req.user.jwtmap.employeeID).then(function(sfdcSession) {
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

function updateNote(app, req) {
  /**
  * updateNote
  *
  */
  return new Promise(function(resolve, reject) {
    let noteId = req.query ? req.query.noteId : undefined;

    if (!noteId) {
      reject({
        isSuccess: false,
        errorMessage: 'There was no valid noteId submitted.'
      });
    } else {
      sfdcConn(app, req).then(function (conn) {
        conn.sobject('Note__c').update({
          Id: noteId,
          Type__c: req.body.title,
          Comments_RTF__c: req.body.body
        }).then(function(result) {
          if (result.success === true) {
            resolve({
              isSuccess: true,
              successReturnValue: result
            });
          } else {
            reject({
              isSuccess: false,
              errorMessage: 'Error updating note: ' + JSON.stringify(result)
            });
          }
        }).catch(function(err) {
          reject({
            isSuccess: false,
            errorMessage: 'Error updating note: ' + err
          });
        });
      });
    }
  });
};

function deleteNote(app, req) {
  /**
  * deleteNote: deletes an attachment identified by the query parameter "noteId"
  *
  */
  return sfdcConn(app, req).then(function(result) {
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

function searchAccounts(app, req) {
  /**
  * searchAccounts: searches for an account using the search term in the "searchTerm" query parameter.
  *                 This uses Salesforce's SOSL querying language
  *                 (https://developer.salesforce.com/docs/atlas.en-us.soql_sosl.meta/soql_sosl/sforce_api_calls_sosl_about.htm)
  */
  return sfdcConn(app, req).then(function(result) {
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
  return sfdcConn(app, req).then(function(result) {
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
            .select('Account__r.TDLinx_Id__c, Account__r.JDE_Address_Book_Number__c,  Type__c, Title__c, Soft_Delete__c, Private__c, OwnerId, Other_Type__c, Name, IsDeleted, Id, Comments_RTF__c, Account__c, CreatedDate, CreatedBy.Name, CreatedBy.CBI_Employee_ID__c, LastModifiedDate')
            .include('Attachments')
            .select('Id, Name, CreatedDate, BodyLength, ContentType, Description, LastModifiedDate, OwnerId, ParentId')
            .orderby('CreatedDate', 'DESC')
            .end()
            .where('(Account__r.TDLinx_Id__c = \'' + strId + '\' or Account__r.JDE_Address_Book_Number__c = \'' + strId + '\' or Account__r.Store_Code__c = \'' + strId + '\') and RecordTypeId = \'' + app.get('config').sfdcSettings.noteRecordTypeId + '\'')
            .execute(function (err, records) {
              if (err) {
                return {'isSuccess': false,
                  'errorMessage': 'There was an SFDC API error retrieving the notes for this account: ' + err};
              }
              // set the URL on the image to include the url and session id
              for (var note in records) {
                if (records[note].Attachments) {
                  for (var theAtt in records[note].Attachments.records) {
                    var thisAtt = records[note].Attachments.records[theAtt],
                        urlPath = app.get('config').env === 'development' ? 'sfdc/getAttachment?attachId=' : '/sfdc/getAttachment?attachId=',
                        clickableLink = app.get('config').address + urlPath + thisAtt.Id;

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
      return {'isSuccess': false,
        'errorMessage': errMessage};
    }
  }, function (err) {
    return {'isSuccess': false,
      'errorMessage': 'A connection to Salesforce could not be established: ' + err};
  });
};

function userInfo(app, req) {
  return sfdcConn(app, req).then(function(result) {
    try {
      var conn = result,
        empId = req.user.jwtmap.employeeID;

      return (
        conn.sobject('User')
          .select('Id, FederationIdentifier, Name, CompanyName, Division, Department, Supervisory__c, Role__c')
          .where('FederationIdentifier = \'' + empId + '\'')
          .execute(function (err, records) {
            if (err) {
              return {
                'isSuccess': false,
                'errorMessage': 'There was an SFDC API error retrieving user info: ' + err
              };
            }

            if (records.length === 1) {
              return {
                'isSuccess': true,
                'successReturnValue': records[0]
              };
            } else {
              return {
                'isSuccess': false,
                'errorMessage': 'Could not find a user with FederationIdentifier matching ' + empId + ' (' + records.length + ' records)'
              };
            }
          })
      );
    } catch (err) {
      var errMessage = 'There was an error in userInfo: ' + JSON.stringify(err, null, '');
      return {
        'isSuccess': false,
        'errorMessage': errMessage
      };
    }
  }, function (err) {
    return {'isSuccess': false,
      'errorMessage': 'A connection to Salesforce could not be established: ' + err};
  });
};

function createNote(app, req) {
  /**
  * createNote: Creates a new note for the account whose Id is passed in through the accountId query parameter.
  *
  */
  return new Promise(function(resolve, reject) {
    let acctId = req.query ? req.query.accountId : undefined;

    if (!acctId) {
      reject({
        isSuccess: false,
        errorMessage: 'There was no valid accountId submitted. Please make sure you have an account id (i.e. TD Linx Id)'
      });
    } else {
      sfdcConn(app, req).then(function (conn) {
        // search for the correct SFDC account Id
        conn.search('FIND {' + acctId + '} IN ALL FIELDS RETURNING Account(Id, Name)').then(function (result) {
          // only uses the first account it finds
          let sfdcAccountId = (result && result.searchRecords && result.searchRecords[0]) ? result.searchRecords[0].Id : undefined;

          if (!sfdcAccountId) {
            reject({
              isSuccess: false,
              errorMessage: 'There was no account in SFDC found with TDLinx Id or JDE Address Book Number ' + acctId
            });
          } else {
            // once you have the correct account id, create a note and attach to that account Id.
            conn.sobject('Note__c').create([{
              Account__c: sfdcAccountId,
              Comments_RTF__c: req.body.body,
              Conversion_Flag__c: req.body.conversionflag,
              // CreatedById, CreatedDate, Id, IsDeleted, LastModifiedById, LastModifiedDate are system generated
              Other_Type__c: req.body.othertype,
              Private__c: req.body.private,
              Soft_Delete__c: req.body.softdelete,
              Type__c: req.body.title,
              RecordTypeId: app.get('config').sfdcSettings.noteRecordTypeId
            }]).then(function(noteReturn) {
              if (noteReturn.length > 0 && noteReturn[0].success === true) {
                resolve({
                  isSuccess: true,
                  successReturnValue: noteReturn
                });
              } else {
                reject({
                  isSuccess: false,
                  errorMessage: 'Error creating note: ' + JSON.stringify(noteReturn)
                });
              }
            }).catch(function(noteError) {
              reject({
                isSuccess: false,
                errorMessage: 'Error creating note: ' + noteError
              });
            });
          };
        }).catch(function(err) {
          reject({
            isSuccess: false,
            errorMessage: 'There was an error searching for a matching account: ' + err
          });
        });
      });
    }
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
    return sfdcConn(app, req).then(function(result) {
    // In order to return a clickable link we need to issue a GET from our server
      var conn = result;
      var theAtt = conn.sobject('Attachment').record(req.query.attachId);
      var attBlob = theAtt.blob('Body');
      var buf = [];
      attBlob.on('data', function(data) {
        buf.push(data);
      });
      attBlob.on('end', function() {
        var attRecord = [];
        conn.query('Select Id, ContentType, Description, Name FROM Attachment WHERE Id = \'' + req.query.attachId + '\'')
        .on('record', function(record) {
          attRecord.push(record);
        })
        .on('end', function() {
          var contentStr = Buffer.concat(buf);
          res.writeHead(200, {
            'Content-Type': attRecord[0].ContentType,
            'Content-disposition': 'attachment;filename="' + attRecord[0].Name + '"'
          });
          res.end(new Buffer(contentStr, 'binary'));
          })
          .on('error', function(err) {
            console.error(err);
          })
          .run({ autoFetch: true, maxFetch: 1 });
      });
    }, function(err) {
      throw (err);
    });
  } catch (err) {
    return {'isSuccess': false,
      'errorMessage': 'No connection could be made to Salesforce.com: ' + err};
  }
};

function createAttachment(app, req) {
  var files = req.files.files || [];
  var sfdc = sfdcConn(app, req);
  var attachments = Promise
    .all(cleanUploadedFiles(files))
    .then(function(files) {
      return files.map(function(file) {
        file.ParentId = req.body.noteId;
        return file;
      });
    });

  return Promise
    .all([attachments, sfdc])
    .then(function(args) {
      var attachments = args[0];
      var sfdc = args[1];

      return sfdc.sobject('Attachment').create(attachments);
    });
}

function deleteAttachment(app, req) {
  return sfdcConn(app, req)
    .then(function(conn) {
      return conn.sobject('Attachment').delete(req.query.attachmentId);
    });
}

function cleanUploadedFiles(files) {
  return files.map(function(file) {
    return getUploadedFileBase64(file.path)
      .then(function(data) {
        return {
          Name: file.originalFilename,
          Body: data,
          ContentType: file.type
        };
      })
      .catch(console.error);
  });
}
function getUploadedFileBase64(path) {
  return new Promise(function(resolve, reject) {
    fs.readFile(path, function(err, data) {
      err ? reject(err) : resolve(new Buffer(data).toString('base64'));
    });
  });
}

