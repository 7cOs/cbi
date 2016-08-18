// Setup dependencies
var sfdc = require('jsforce');
var conn = {};

function fnCreateConn (app) {

  console.log('in fnCreateConn');
  var config = app.get('config').sfdcSec;
};

function fnCreateNote (app, req, res) {
   // get the Account Id
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
};

function fnDeleteNote(app, req, res) {
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
};

function getAttachment(app, req, res) {
  var theURL = '';
  var theId = req.query.noteId;
  var atts = conn.query('Select a.Owner.Name, a.Owner.Username, a.OwnerId, a.Name, a.IsPrivate, a.Id, a.Description, a.CreatedDate, a.CreatedById, a.ContentType, a.BodyLength, a.Body From Attachment a where ParentId = \'' + theId + '\'', function(err, result) {
    var retValue = '';
    if (err) { return console.error(err); }
//    console.log('total: ' + result.totalSize);
//    console.log('fetched : ' + result.records.length);
    retValue = '{"Attachments": [';
    for (var att in result.records) {
/*      console.log('result.records[att] is ' + JSON.stringify(result.records[att], null, ''));
      console.log('url is: ' + result.records[att].attributes.url);
      console.log('security token is: ' + conn.accessToken);
      console.log('instanceUrl is: ' + conn.instanceUrl);
      console.log('The full URL is: ' + conn.instanceUrl + '/servlet/servlet.FileDownload?file=' + result.records[att].Id + '&sessionId=' + conn.accessToken);
*/
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
  });
  atts.then(function(result) {
    res.end();
    return (result);
  });
}

/*
    TODO: There is a better way to write this: bring in the object and id, that can account for attachments and notes
   will revisit if we have time
*/
function fnDeleteAttach (app, req, res) {
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

function fnSearchAccounts (app, req, res) {
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
      });
    if (response !== '') {
      res.send(response);
    } else {
      return ([{
        'isSuccess': false,
        'ErrorString': 'Salesforce did not return valid information'
      }]);
    }
  } else {
    res.send([{
      'isSuccess': 'False',
      'ErrorString': 'No search term was present in the URL'
    }]);
  }
};

var strId = '';

exports.queryAccountNotes = function(app, req, res) {
  console.log('in queryAccountNotes');
  var conn = fnCreateConn(app);

//  var conn = fnCreateConn(app);

  console.log('In _lib.queryAccountNotes with ');
  if (app !== undefined) console.log('---------> app: ' + JSON.stringify(app, null, ''));
  if (req !== undefined) console.log('---------> req: ' + JSON.stringify(req.query, null, ''));
  if (res !== undefined) console.log('---------> res: ' + JSON.stringify(res.query, null, ''));
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
          .select('Account__r.TDLinx_Id__c, Account__r.JDE_Address_Book_Number__c,  Type__c, Title__c, Soft_Delete__c, Private__c, OwnerId, Other_Type__c, Name, IsDeleted, Id, Comments_RTF__c, Account__c, CreatedDate, CreatedBy.Name')
          .include('Attachments')
          .select('Id, Name, CreatedDate')
          .orderby('CreatedDate', 'DESC')
          .end()
          .where('Account__r.TDLinx_Id__c = \'' + strId + '\' or Account__r.JDE_Address_Book_Number__c = \'' + strId + '\'')
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
    console.error('There was an error in queryAccountNotes: ' + JSON.stringify(err, null, ''));
    return JSON.stringify(err, null, '');
  }
};
