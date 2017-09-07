'use strict';

const saml = require('./ssoSAML.js'),
      jsforce = require('jsforce'),
      fs = require('fs'),
      connErrorMessage = 'A connection to Salesforce could not be established: ';

module.exports = {
  sfdcConn: sfdcConn,
  userInfo: userInfo,
  createNote: createNote,
  accountNotes: accountNotes,
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
  * sfdcConn: Retrieve access token and url form Salesforce, persist credentials to session,
  * and create a new connection to salesforce, OR create a new connection from existing
  * credentials if they already exist in session.
  */

  return new Promise(function(resolve, reject) {
    let jsonSfdcSession;

    if (!req.session.sfdc) {
      saml.getSFDCSession(app, req.user.jwtmap.employeeID).then(function(sfdcSession) {
        jsonSfdcSession = JSON.parse(sfdcSession);
        req.session.sfdc = jsonSfdcSession;

        // manual save is required for non GET reqs
        req.session.save(function() {
          resolve(new jsforce.Connection({
            instanceUrl: jsonSfdcSession.instance_url,
            accessToken: jsonSfdcSession.access_token
          }));
        });
      }).catch(function(err) {
        let msg = 'Unable to get Salesforce session';
        if (err) {
          msg = err.errorMessage || err.message || err.error || msg;
        }

        let error = {
          'isSuccess': false,
          'errorMessage': msg
        };

        reject(error);
      });
    } else {
      jsonSfdcSession = req.session.sfdc;

      if (jsonSfdcSession.instance_url && jsonSfdcSession.access_token) {
        resolve(new jsforce.Connection({
          instanceUrl: jsonSfdcSession.instance_url,
          accessToken: jsonSfdcSession.access_token
        }));
      } else {
        reject({
          'isSuccess': false,
          'errorMessage': 'Unable to retrieve Salesforce credentials from session'
        });
      }
    }
  });
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
      }).catch(function(err) {
        reject({
          isSuccess: false,
          errorMessage: connErrorMessage + err
        });
      });
    }
  });
}

function deleteNote(app, req) {
  /**
  * deleteNote: deletes a note identified by the query parameter "noteId"
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
        conn.sobject('Note__c').delete(noteId).then(function(result) {
          if (result.success === true) {
            resolve({
              isSuccess: true,
              successReturnValue: result
            });
          } else {
            reject({
              isSuccess: false,
              errorMessage: 'Error deleting note: ' + JSON.stringify(result)
            });
          }
        }).catch(function(err) {
          reject({
            isSuccess: false,
            errorMessage: 'Error deleting note: ' + err
          });
        });
      }).catch(function(err) {
        reject({
          isSuccess: false,
          errorMessage: connErrorMessage + err
        });
      });
    }
  });
}

function accountNotes(app, req) {
  /**
  * queryAccountNotes: searches for the notes and associated attachments using the query parameter "accountId"
  *                    This accountId can either be the TDLinx_Id__c Id or
  *                      the JDE_Address_Book_Number__c for the account.  This will then return the note and attachemnt
  *                      data.  The attachment data comes back in the form of a clickable link, which can then be embedded
  *                      into the resultant page by using it in an <img src=""> tag.
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
        conn.sobject('Note__c')
          .select('Account__r.TDLinx_Id__c, Account__r.JDE_Address_Book_Number__c,  Type__c, Title__c, Soft_Delete__c, Private__c, OwnerId, Other_Type__c, Name, IsDeleted, Id, Comments_RTF__c, Account__c, CreatedDate, CreatedBy.Name, CreatedBy.CBI_Employee_ID__c, LastModifiedDate')
          .include('Attachments')
          .select('Id, Name, CreatedDate, BodyLength, ContentType, Description, LastModifiedDate, OwnerId, ParentId')
          .orderby('CreatedDate', 'DESC')
          .end()
          .where('(Account__r.TDLinx_Id__c = \'' + acctId + '\' or Account__r.JDE_Address_Book_Number__c = \'' + acctId + '\' or Account__r.Store_Code__c = \'' + acctId + '\') and RecordTypeId = \'' + app.get('config').sfdcSettings.noteRecordTypeId + '\'')
          .execute().then(function(records) {

          // modify url attribute for attachments
          for (let note in records) {
            if (records[note].Attachments) {
              for (let theAtt in records[note].Attachments.records) {
                let thisAtt = records[note].Attachments.records[theAtt],
                  urlPath = '/sfdc/getAttachment?attachId=' + thisAtt.Id;

                thisAtt.attributes.compassUrl = urlPath;
              }
            }
          }

          resolve({
            isSuccess: true,
            successReturnValue: records
          });
        }).catch(function(err) {
          reject({
            isSuccess: false,
            errorMessage: 'Error retrieving notes: ' + err
          });
        });
      }).catch(function (err) {
        reject({
          isSuccess: false,
          errorMessage: connErrorMessage + err
        });
      });
    }
  });
}

function userInfo(app, req) {
  /**
   * userInfo: gets Salesforce user information for current user identified by empployeeID
   *
   */
  return new Promise(function(resolve, reject) {
    sfdcConn(app, req).then(function (conn) {
      let employeeId = req.user.jwtmap.employeeID;

      conn.sobject('User')
        .select('Id, FederationIdentifier, Name, CompanyName, Division, CBI_Department__c, Supervisory__c, Role__c')
        .where('FederationIdentifier = \'' + employeeId + '\'')
        .execute().then(function(records) {

        if (records.length === 1) {
          resolve({
            isSuccess: true,
            successReturnValue: records[0]
          });
        } else {
          reject({
            isSuccess: false,
            errorMessage: 'Could not find a user with FederationIdentifier matching ' + employeeId + ' (' + records.length + ' records)'
          });
        }
      }).catch(function(err) {
        reject({
          isSuccess: false,
          errorMessage: 'Error retrieving user info: ' + err
        });
      });
    }).catch(function(err) {
      reject({
        isSuccess: false,
        errorMessage: connErrorMessage + JSON.stringify(err)
      });
    });
  });
}

function createNote(app, req) {
  return new Promise((resolve, reject) => {
    if (req.query.accountId) {
      const accountId = req.query.accountId;

      sfdcConn(app, req)
      .then(connection => {
        const queryStrings = req.body.accountType === 'DISTRIBUTOR'
          ? getNoteQueries('distributor', accountId)
          : getNoteQueries('nonDistributor', accountId);

        getNoteId(connection, queryStrings)
        .then(response => createSalesForceNote(connection, response, app, req))
        .then(response => resolve(response))
        .catch(error => reject(error));
      })
      .catch(error => reject(error));
    } else {
      reject(getResponseObject(false, 'There was no valid accountId submitted. Please make sure you have an account id (i.e. TD Linx Id)'));
    }
  });
}

function getNoteId(sfdcConnection, queryStrings) {
  return new Promise((resolve, reject) => {
    sfdcConnection.sobject(queryStrings.sobject)
      .select(queryStrings.select)
      .where(queryStrings.where)
      .execute()
      .then(response => {
        if (response.length) resolve(response[0].Id);
        else reject(getResponseObject(false, `There was no SFDC account found with request accountID: ${response}`));
      })
      .catch(error => reject(getResponseObject(false, `There was no SFDC account found with request accountID: ${error}`)));
  });
}

function createSalesForceNote(sfdcConnection, noteId, app, req) {
  return new Promise((resolve, reject) => {
    sfdcConnection.sobject('Note__c').create([{
      Account__c: noteId,
      Comments_RTF__c: req.body.body,
      Conversion_Flag__c: req.body.conversionflag,
      Other_Type__c: req.body.othertype,
      Private__c: req.body.private,
      Soft_Delete__c: req.body.softdelete,
      Type__c: req.body.title,
      RecordTypeId: app.get('config').sfdcSettings.noteRecordTypeId
    }])
    .then(response => {
      response.length && response[0].success
        ? resolve(getResponseObject(true, response))
        : reject(getResponseObject(false, `Error creating note: ${JSON.stringify(response)}`));
    })
    .catch(error => reject(getResponseObject(false, `Error creating note: ${error}`)));
  });
}

function getNoteQueries(queryType, accountId) {
  const queries = {
    distributor: {
      sobject: 'Account',
      select: 'Id, JDE_Address_Book_Number__c, Account_Record_Type_Name__c',
      where: `Account_Record_Type_Name__c='US_Distributor_Account' AND JDE_Address_Book_Number__c='${accountId}'`
    },
    nonDistributor: {
      sobject: 'Account',
      select: 'Id, TDLinx_ID__c',
      where: `TDLinx_ID__c='${accountId}' AND Account_Record_Type_Name__c='US_Account'`
    }
  };

  return queries[queryType];
}

function getAttachment(app, req, res) {
  /**
  * getAttachments: gets a specific attachment based on the attachId query parameter.
  *                 You need to translate the binary data coming in to a form that can
  *                 be passed through a web service.
  *
  */
  return new Promise(function(resolve, reject) {
    let attachId = req.query.attachId;

    if (!attachId) {
      reject({
        isSuccess: false,
        errorMessage: 'There was no valid attachId submitted.'
      });
    } else {
      sfdcConn(app, req).then(function (conn) {

        let theAtt = conn.sobject('Attachment').record(attachId);
        let attBlob = theAtt.blob('Body');
        let buf = [];

        attBlob.on('error', function (err) {
          reject({
            isSuccess: false,
            errorMessage: 'Error fetching attachment: ' + err
          });
        });

        attBlob.on('data', function (data) {
          buf.push(data);
        });

        attBlob.on('end', function () {
          let attRecord = [];
          conn.query('Select Id, ContentType, Description, Name FROM Attachment WHERE Id = \'' + req.query.attachId + '\'')
            .on('record', function (record) {
              attRecord.push(record);
            })
            .on('end', function () {
              let contentStr = Buffer.concat(buf);
              res.writeHead(200, {
                'Content-Type': attRecord[0].ContentType,
                'Content-disposition': 'attachment;filename="' + attRecord[0].Name + '"'
              });
              res.end(new Buffer(contentStr, 'binary'));

              resolve({
                isSuccess: true
              });
            })
            .on('error', function (err) {
              reject({
                isSuccess: false,
                errorMessage: 'Error fetching attachment: ' + err
              });
            })
            .run({autoFetch: true, maxFetch: 1});
        });
      }).catch(function(err) {
        reject({
          isSuccess: false,
          errorMessage: connErrorMessage + err
        });
      });
    }
  });
}

function createAttachment(app, req) {
  let files = req.files.files || [];
  let sfdc = sfdcConn(app, req);
  let attachments = Promise
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
      let attachments = args[0];
      let sfdc = args[1];

      return sfdc.sobject('Attachment').create(attachments);
    }).catch(function(err) {
      return {
        isSuccess: false,
        errorMessage: 'Error creating attachment: ' + err
      };
    });
}

function deleteAttachment(app, req) {
  /**
   * deleteAttachment: deletes an attachment on a note identified by the query parameter "attachmentId"
   *
   */
  return new Promise(function(resolve, reject) {
    let attachmentId = req.query ? req.query.attachmentId : undefined;

    if (!attachmentId) {
      reject({
        isSuccess: false,
        errorMessage: 'There was no valid attachmentId submitted.'
      });
    } else {
      sfdcConn(app, req).then(function (conn) {
        conn.sobject('Attachment').delete(attachmentId).then(function (result) {
          if (result.success === true) {
            resolve({
              isSuccess: true,
              successReturnValue: result
            });
          } else {
            reject({
              isSuccess: false,
              errorMessage: 'Error deleting attachment: ' + JSON.stringify(result)
            });
          }
        }).catch(function (err) {
          reject({
            isSuccess: false,
            errorMessage: 'Error deleting attachment: ' + err
          });
        });
      }).catch(function(err) {
        reject({
          isSuccess: false,
          errorMessage: connErrorMessage + err
        });
      });
    }
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
      });
  });
}

function getUploadedFileBase64(path) {
  return new Promise(function(resolve, reject) {
    fs.readFile(path, function(err, data) {
      err ? reject(err) : resolve(new Buffer(data).toString('base64'));
    });
  });
}

function getResponseObject(isSuccess, response) {
  const responseObject = {
    isSuccess: isSuccess
  };

  isSuccess
    ? responseObject['successReturnValue'] = response
    : responseObject['errorMessage'] = response;

  return responseObject;
}
