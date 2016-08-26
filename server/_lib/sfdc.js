// Setup dependencies
var sfdc = require('jsforce');

var request = require('request');
var htmlparser = require('htmlparser2');
var conn = {};
var utility = require('util');

function fnCreateConn(app) {
  return conn;
};

function getOAMResult(commands, app, req, res) {

  var sfdcConfig = app.get('config').sfdcSec;
  var result = request.post(commands.action,
              {form: {'RelayState': commands.RelayState,
                      'SAMLRequest': sfdcConfig.idpAssertion}},
                function(error, response, oamBody) {
                  if (error) {
                    console.log('Error is: ' + error);
                    return {'isSuccess': false,
                            'error': error};
                  } else {
                    console.log('OAM returned: ' + oamBody);
                    res.send(oamBody);
                    return {'isSuccess': true,
                            'response': response,
                            'body': oamBody};
                  }
                }

              );

  console.log('The result is\n\n' + utility.inspect(result, null, ''));

  return (result);
}

exports.sendAuthnRequestTest = function(app, req, res) {
  var tokenURL = 'https://cbrands--CBeerDev.cs20.my.salesforce.com/services/oauth2/token?so=00Dm00000008fCJ?';
  tokenURL = tokenURL + 'grant_type=assertion';
  tokenURL = tokenURL + '&assertion_type=urn%3Aoasis%3Anames%3Atc%3ASAML%3A2.0%3Aprofiles%3ASSO%3Abrowser';
  tokenURL = tokenURL + '&assertion=PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48c2FtbDJwOlJlc3BvbnNlIHhtbG5zOnNhbWwycD0idXJuOm9hc2lzOm5hbWVzOnRjOlNBTUw6Mi4wOnByb3RvY29sIiB4bWxuczp4cz0iaHR0cDovL3d3dy53My5vcmcvMjAwMS9YTUxTY2hlbWEiIERlc3RpbmF0aW9uPSJodHRwczovL2NicmFuZHMtLUNCZWVyRGV2LmNzMjAubXkuc2FsZXNmb3JjZS5jb20%2Fc289MDBEbTAwMDAwMDA4ZkNKIiBJRD0iXzNiZWQyYjc4LTMwOTQwOTVlIiBJc3N1ZUluc3RhbnQ9IjIwMTYtMDgtMjRUMDU6MDU6NTkuOTM2WiIgVmVyc2lvbj0iMi4wIj48c2FtbDI6SXNzdWVyIHhtbG5zOnNhbWwyPSJ1cm46b2FzaXM6bmFtZXM6dGM6U0FNTDoyLjA6YXNzZXJ0aW9uIj5odHRwOi8vYXhpb21zc28uaGVyb2t1YXBwLmNvbTwvc2FtbDI6SXNzdWVyPjxkczpTaWduYXR1cmUgeG1sbnM6ZHM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvMDkveG1sZHNpZyMiPjxkczpTaWduZWRJbmZvPjxkczpDYW5vbmljYWxpemF0aW9uTWV0aG9kIEFsZ29yaXRobT0iaHR0cDovL3d3dy53My5vcmcvMjAwMS8xMC94bWwtZXhjLWMxNG4jIi8%2BPGRzOlNpZ25hdHVyZU1ldGhvZCBBbGdvcml0aG09Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvMDkveG1sZHNpZyNkc2Etc2hhMSIvPjxkczpSZWZlcmVuY2UgVVJJPSIjXzNiZWQyYjc4LTMwOTQwOTVlIj48ZHM6VHJhbnNmb3Jtcz48ZHM6VHJhbnNmb3JtIEFsZ29yaXRobT0iaHR0cDovL3d3dy53My5vcmcvMjAwMC8wOS94bWxkc2lnI2VudmVsb3BlZC1zaWduYXR1cmUiLz48ZHM6VHJhbnNmb3JtIEFsZ29yaXRobT0iaHR0cDovL3d3dy53My5vcmcvMjAwMS8xMC94bWwtZXhjLWMxNG4jIj48ZWM6SW5jbHVzaXZlTmFtZXNwYWNlcyB4bWxuczplYz0iaHR0cDovL3d3dy53My5vcmcvMjAwMS8xMC94bWwtZXhjLWMxNG4jIiBQcmVmaXhMaXN0PSJ4cyIvPjwvZHM6VHJhbnNmb3JtPjwvZHM6VHJhbnNmb3Jtcz48ZHM6RGlnZXN0TWV0aG9kIEFsZ29yaXRobT0iaHR0cDovL3d3dy53My5vcmcvMjAwMC8wOS94bWxkc2lnI3NoYTEiLz48ZHM6RGlnZXN0VmFsdWU%2BUHpwVEV1L1pCcndIQUZHODZHSjlDakZJOHhNPTwvZHM6RGlnZXN0VmFsdWU%2BPC9kczpSZWZlcmVuY2U%2BPC9kczpTaWduZWRJbmZvPjxkczpTaWduYXR1cmVWYWx1ZT5KRzBaZkhZbzQ0SUwxUDlrMzVlbnZPYkxNQmczS1F0RDlOY2Uxa3RVejByRzRTemFHSTJWbHc9PTwvZHM6U2lnbmF0dXJlVmFsdWU%2BPGRzOktleUluZm8%2BPGRzOlg1MDlEYXRhPjxkczpYNTA5Q2VydGlmaWNhdGU%2BTUlJRDB6Q0NBNUdnQXdJQkFnSUVGL3VGSVRBTEJnY3Foa2pPT0FRREJRQXdnYm94Q3pBSkJnTlZCQVlUQWxWVE1Rc3dDUVlEVlFRSQpFd0pEUVRFV01CUUdBMVVFQnhNTlUyRnVJRVp5WVc1amFYTmpiekVTTUJBR0ExVUVDaE1KUVhocGIyMGdVMU5QTVZFd1R3WURWUVFMCkUwaEdUMUlnUkVWTlQwNVRWRkpCVkVsUFRpQlFWVkpRVDFORlV5QlBUa3haTGlCRVR5Qk9UMVFnVlZORklFWlBVaUJRVWs5RVZVTlUKU1U5T0lFVk9Wa2xTVDA1TlJVNVVVeTR4SHpBZEJnTlZCQU1URmtGNGFXOXRJRVJsYlc4Z1EyVnlkR2xtYVdOaGRHVXdIaGNOTVRRdwpOakl3TURRek1ESTNXaGNOTkRFeE1UQTFNRFF6TURJM1dqQ0J1akVMTUFrR0ExVUVCaE1DVlZNeEN6QUpCZ05WQkFnVEFrTkJNUll3CkZBWURWUVFIRXcxVFlXNGdSbkpoYm1OcGMyTnZNUkl3RUFZRFZRUUtFd2xCZUdsdmJTQlRVMDh4VVRCUEJnTlZCQXNUU0VaUFVpQkUKUlUxUFRsTlVVa0ZVU1U5T0lGQlZVbEJQVTBWVElFOU9URmt1SUVSUElFNVBWQ0JWVTBVZ1JrOVNJRkJTVDBSVlExUkpUMDRnUlU1VwpTVkpQVGsxRlRsUlRMakVmTUIwR0ExVUVBeE1XUVhocGIyMGdSR1Z0YnlCRFpYSjBhV1pwWTJGMFpUQ0NBYmd3Z2dFc0JnY3Foa2pPCk9BUUJNSUlCSHdLQmdRRDlmMU9CSFhVU0tWTGZTcHd1N09UbjloRzNVanp2UkFEREhqK0F0bEVtYVVWZFFDSlIrMWs5alZqNnY4WDEKdWpEMnk1dFZiTmVCTzRBZE5HL3labUMzYTVsUXBhU2ZuK2dFZXhBaXdrKzdxZGYrdDhZYitEdFg1OGFvcGhVUEJQdUQ5dFBGSHNNQwpOVlFUV2hhUk12WjE4NjRyWWRjcTcvSWlBeG1kMFVnQnh3SVZBSmRnVUk4Vkl3dk1zcEs1Z3FMcmhBdndXQnoxQW9HQkFQZmhvSVhXCm16M2V5N3lyWERhNFY3bDVsSys3K2pycWd2bFhUQXM5QjRKblVWbFhqcnJVV1UvbWNRY1FnWUMwU1JaeEkraE1LQllUdDg4Sk1vekkKcHVFOEZucUxWSHlOS09DanJoNHJzNloxa1c2amZ3djZJVFZpOGZ0aWVnRWtPOHlrOGI2b1VaQ0pxSVBmNFZybG53YVNpMlplZ0h0VgpKV1FCVER2K3owa3FBNEdGQUFLQmdRQ1hyMW1wNFV2QnlZNmRHYkRPeXEzd01zNk83TUN4bUVrVTJ4MzJBa0VwNnM3WGZpeTNNWXdLCndaUTRzTDRCbVFZelo3UU9YUFA4ZEtncktEUUtMazl0WFdPZ3ZJb09DaU5BZFFEWWxSbTJzWWdySTJTVWN5TTFiS0RxTHdERDhaNU8Kb0xldVFBdGdNZkFxL2YxQzZuUkVXclF1ZFB4T3dhb05kSGtZY1IrMDY2TWhNQjh3SFFZRFZSME9CQllFRkUySkFjOTd3ZkhLNWI0MgpuS2JBTm40U01jcWNNQXNHQnlxR1NNNDRCQU1GQUFNdkFEQXNBaFIrQ2p2cDhVd05nS0hmeDJQV0pvUmkwLzFxOEFJVU5oVFhXbEd6CkozU2RCbGdSc2RGZ0t5RnRjeEU9PC9kczpYNTA5Q2VydGlmaWNhdGU%2BPC9kczpYNTA5RGF0YT48L2RzOktleUluZm8%2BPC9kczpTaWduYXR1cmU%2BPHNhbWwycDpTdGF0dXM%2BPHNhbWwycDpTdGF0dXNDb2RlIFZhbHVlPSJ1cm46b2FzaXM6bmFtZXM6dGM6U0FNTDoyLjA6c3RhdHVzOlN1Y2Nlc3MiLz48L3NhbWwycDpTdGF0dXM%2BPHNhbWwyOkFzc2VydGlvbiB4bWxuczpzYW1sMj0idXJuOm9hc2lzOm5hbWVzOnRjOlNBTUw6Mi4wOmFzc2VydGlvbiIgSUQ9Il8zMzE1OTBmNS0xOGM1MmYwOCIgSXNzdWVJbnN0YW50PSIyMDE2LTA4LTI0VDA1OjA1OjU5LjkzNloiIFZlcnNpb249IjIuMCI%2BPHNhbWwyOklzc3Vlcj5odHRwOi8vYXhpb21zc28uaGVyb2t1YXBwLmNvbTwvc2FtbDI6SXNzdWVyPjxzYW1sMjpTdWJqZWN0PjxzYW1sMjpOYW1lSUQgRm9ybWF0PSJ1cm46b2FzaXM6bmFtZXM6dGM6U0FNTDoxLjE6bmFtZWlkLWZvcm1hdDp1bnNwZWNpZmllZCI%2BNzAwNTkzNjwvc2FtbDI6TmFtZUlEPjxzYW1sMjpTdWJqZWN0Q29uZmlybWF0aW9uIE1ldGhvZD0idXJuOm9hc2lzOm5hbWVzOnRjOlNBTUw6Mi4wOmNtOmJlYXJlciI%2BPHNhbWwyOlN1YmplY3RDb25maXJtYXRpb25EYXRhIE5vdE9uT3JBZnRlcj0iMjAxNi0wOC0yNFQwNTowNjo1OS45MzZaIiBSZWNpcGllbnQ9Imh0dHBzOi8vY2JyYW5kcy0tQ0JlZXJEZXYuY3MyMC5teS5zYWxlc2ZvcmNlLmNvbT9zbz0wMERtMDAwMDAwMDhmQ0oiLz48L3NhbWwyOlN1YmplY3RDb25maXJtYXRpb24%2BPC9zYW1sMjpTdWJqZWN0PjxzYW1sMjpDb25kaXRpb25zIE5vdEJlZm9yZT0iMjAxNi0wOC0yNFQwNTowNTo1OS45MzZaIiBOb3RPbk9yQWZ0ZXI9IjIwMTYtMDgtMjRUMDU6MDY6NTkuOTM2WiI%2BPHNhbWwyOkF1ZGllbmNlUmVzdHJpY3Rpb24%2BPHNhbWwyOkF1ZGllbmNlPmh0dHBzOi8vY2JyYW5kcy1jYmVlcmRldi5jczIwLm15LnNhbGVzZm9yY2UuY29tPC9zYW1sMjpBdWRpZW5jZT48L3NhbWwyOkF1ZGllbmNlUmVzdHJpY3Rpb24%2BPC9zYW1sMjpDb25kaXRpb25zPjxzYW1sMjpBdXRoblN0YXRlbWVudCBBdXRobkluc3RhbnQ9IjIwMTYtMDgtMjRUMDU6MDU6NTkuOTM2WiI%2BPHNhbWwyOkF1dGhuQ29udGV4dD48c2FtbDI6QXV0aG5Db250ZXh0Q2xhc3NSZWY%2BdXJuOm9hc2lzOm5hbWVzOnRjOlNBTUw6Mi4wOmFjOmNsYXNzZXM6dW5zcGVjaWZpZWQ8L3NhbWwyOkF1dGhuQ29udGV4dENsYXNzUmVmPjwvc2FtbDI6QXV0aG5Db250ZXh0Pjwvc2FtbDI6QXV0aG5TdGF0ZW1lbnQ%2BPHNhbWwyOkF0dHJpYnV0ZVN0YXRlbWVudD48c2FtbDI6QXR0cmlidXRlIE5hbWU9InNzb1N0YXJ0UGFnZSIgTmFtZUZvcm1hdD0idXJuOm9hc2lzOm5hbWVzOnRjOlNBTUw6Mi4wOmF0dHJuYW1lLWZvcm1hdDp1bnNwZWNpZmllZCI%2BPHNhbWwyOkF0dHJpYnV0ZVZhbHVlIHhtbG5zOnhzaT0iaHR0cDovL3d3dy53My5vcmcvMjAwMS9YTUxTY2hlbWEtaW5zdGFuY2UiIHhzaTp0eXBlPSJ4czpzdHJpbmciPmh0dHA6Ly9heGlvbXNzby5oZXJva3VhcHAuY29tL1JlcXVlc3RTYW1sUmVzcG9uc2UuYWN0aW9uPC9zYW1sMjpBdHRyaWJ1dGVWYWx1ZT48L3NhbWwyOkF0dHJpYnV0ZT48c2FtbDI6QXR0cmlidXRlIE5hbWU9ImxvZ291dFVSTCIgTmFtZUZvcm1hdD0idXJuOm9hc2lzOm5hbWVzOnRjOlNBTUw6Mi4wOmF0dHJuYW1lLWZvcm1hdDp1bnNwZWNpZmllZCI%2BPHNhbWwyOkF0dHJpYnV0ZVZhbHVlIHhtbG5zOnhzaT0iaHR0cDovL3d3dy53My5vcmcvMjAwMS9YTUxTY2hlbWEtaW5zdGFuY2UiIHhzaTp0eXBlPSJ4czpzdHJpbmciLz48L3NhbWwyOkF0dHJpYnV0ZT48L3NhbWwyOkF0dHJpYnV0ZVN0YXRlbWVudD48L3NhbWwyOkFzc2VydGlvbj48L3NhbWwycDpSZXNwb25zZT4%3D';
  tokenURL = tokenURL + '&format=json';
  console.log(tokenURL);
  var authnPromise = new Promise(function (resolve, reject) {
    request.post(tokenURL,
                function (error, response, body) {
                  if (error) {
                    console.Error('The error after getting the endpoint is: ' + error);
                    reject(error);
                  } else {
//                    console.log('response is: ' + utility.inspect(response, null, ''));
                    console.log('Body is: ' + body);
//                    console.log('Headers is: ' + utility.inspect(response.headers, null, ''));
//                    console.log('cookie is: ' + utility.inspect(response.headers['set-cookie'], null, ''));
//                    console.log('client is: ' + utility.inspect(response.client, null, ''));
//                    console.log('rawHeaders is: ' +  utility.inspect(response.rawHeaders, null, ''));
                    resolve(body);
                  }
                });
  });
// Promise defined.  Now do something with it.

  authnPromise.then(function(result) {
    var body = result;
    console.log(body);
    res.send(body);
  }, function(err) {
    var error = {'isSuccess': false,
                 'errorMessage': err};
    return error;
  });
};

exports.sendAuthnRequest = function(app, req, res) {
  console.log('In sendAuthnRequest');
  var sfdcConfig = app.get('config').sfdcSec;

  console.log('Trying to create the auth promise');

  var authnPromise = new Promise(function (resolve, reject) {
    console.log('Within the auth promise');
    request(sfdcConfig.spSAMLRequestEndpoint, function (error, response, body) {
      if (error) {
        console.Error('The error after getting the endpoint is: ' + error);
        reject(error);
      } else {
        resolve(body);
      }
    });
  });
// Promise defined.  Now do something with it.

  authnPromise.then(function(result) {
    var body = result;
    var commands = {};
    var parser = new htmlparser.Parser({
      onopentag: function(name, attribs) {
        if (name === 'form') {
          commands['action'] = attribs.action; // SFDC Auth request url
        } else if (name === 'input') {
          if (attribs.name === 'RelayState') {
            commands['RelayState'] = attribs.value;
          } else if (attribs.name === 'SAMLRequest') {
            commands['SAMLRequest'] = attribs.value;
          }
        }
      }
    });
    parser.write(body);
    parser.end();
    console.log('The commands object now contains: ' + commands.RelayState + ' ' + commands.SAMLRequest);

    var OAMResult = getOAMResult(commands, app, req, res);
    console.log('Went to getOAMResult to talk to OAM: ' + OAMResult);
    return ({'isSuccess': true,
             'errorMessage': ''});
  }, function(err) {
    var error = {'isSuccess': false,
                 'errorMessage': err};
    return error;
  });
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
