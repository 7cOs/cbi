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

exports.SSONodeTest = function(app, req, res) {
  console.log('in SSONodeTest');
  var request = require('request');

  var options = { method: 'POST',
    url: 'https://cbrands--cbeerdev.cs20.my.salesforce.com',
    qs:
     { so: '00Dm00000008fCJ',
       grant_type: 'assertion',
       assertion_type: 'urn%3Aoasis%3Anames%3Atc%3ASAML%3A2.0%3Aprofiles%3ASSO%3Abrowser',
       assertion: 'PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48c2FtbDJwOlJlc3BvbnNlIHhtbG5zOnNhbWwycD0idXJuOm9hc2lzOm5hbWVzOnRjOlNBTUw6Mi4wOnByb3RvY29sIiB4bWxuczp4cz0iaHR0cDovL3d3dy53My5vcmcvMjAwMS9YTUxTY2hlbWEiIERlc3RpbmF0aW9uPSJodHRwczovL2NicmFuZHMtLUNCZWVyRGV2LmNzMjAubXkuc2FsZXNmb3JjZS5jb20vc2VydmljZXMvb2F1dGgyL3Rva2VuP3NvPTAwRG0wMDAwMDAwOGZDSiIgSUQ9Il81Njc3ZDc1NC00NzY5YWY1MCIgSXNzdWVJbnN0YW50PSIyMDE2LTA4LTI0VDE3OjUyOjE4LjA3OFoiIFZlcnNpb249IjIuMCI%2BPHNhbWwyOklzc3VlciB4bWxuczpzYW1sMj0idXJuOm9hc2lzOm5hbWVzOnRjOlNBTUw6Mi4wOmFzc2VydGlvbiI%2BaHR0cDovL2F4aW9tc3NvLmhlcm9rdWFwcC5jb208L3NhbWwyOklzc3Vlcj48ZHM6U2lnbmF0dXJlIHhtbG5zOmRzPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwLzA5L3htbGRzaWcjIj48ZHM6U2lnbmVkSW5mbz48ZHM6Q2Fub25pY2FsaXphdGlvbk1ldGhvZCBBbGdvcml0aG09Imh0dHA6Ly93d3cudzMub3JnLzIwMDEvMTAveG1sLWV4Yy1jMTRuIyIvPjxkczpTaWduYXR1cmVNZXRob2QgQWxnb3JpdGhtPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwLzA5L3htbGRzaWcjZHNhLXNoYTEiLz48ZHM6UmVmZXJlbmNlIFVSST0iI181Njc3ZDc1NC00NzY5YWY1MCI%2BPGRzOlRyYW5zZm9ybXM%2BPGRzOlRyYW5zZm9ybSBBbGdvcml0aG09Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvMDkveG1sZHNpZyNlbnZlbG9wZWQtc2lnbmF0dXJlIi8%2BPGRzOlRyYW5zZm9ybSBBbGdvcml0aG09Imh0dHA6Ly93d3cudzMub3JnLzIwMDEvMTAveG1sLWV4Yy1jMTRuIyI%2BPGVjOkluY2x1c2l2ZU5hbWVzcGFjZXMgeG1sbnM6ZWM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDEvMTAveG1sLWV4Yy1jMTRuIyIgUHJlZml4TGlzdD0ieHMiLz48L2RzOlRyYW5zZm9ybT48L2RzOlRyYW5zZm9ybXM%2BPGRzOkRpZ2VzdE1ldGhvZCBBbGdvcml0aG09Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvMDkveG1sZHNpZyNzaGExIi8%2BPGRzOkRpZ2VzdFZhbHVlPm02T2pYdTREZHF1ekUrMlpqeURVRHFWeDF0UT08L2RzOkRpZ2VzdFZhbHVlPjwvZHM6UmVmZXJlbmNlPjwvZHM6U2lnbmVkSW5mbz48ZHM6U2lnbmF0dXJlVmFsdWU%2BRXVZTStTcHlHSk1oL3AzQkoxcE1Yd3Mrc1N4cnlhdXUvaS9jK1Vzd3ZRbU1pWkx1ZStWc3d3PT08L2RzOlNpZ25hdHVyZVZhbHVlPjxkczpLZXlJbmZvPjxkczpYNTA5RGF0YT48ZHM6WDUwOUNlcnRpZmljYXRlPk1JSUQwekNDQTVHZ0F3SUJBZ0lFRi91RklUQUxCZ2NxaGtqT09BUURCUUF3Z2JveEN6QUpCZ05WQkFZVEFsVlRNUXN3Q1FZRFZRUUkKRXdKRFFURVdNQlFHQTFVRUJ4TU5VMkZ1SUVaeVlXNWphWE5qYnpFU01CQUdBMVVFQ2hNSlFYaHBiMjBnVTFOUE1WRXdUd1lEVlFRTApFMGhHVDFJZ1JFVk5UMDVUVkZKQlZFbFBUaUJRVlZKUVQxTkZVeUJQVGt4WkxpQkVUeUJPVDFRZ1ZWTkZJRVpQVWlCUVVrOUVWVU5VClNVOU9JRVZPVmtsU1QwNU5SVTVVVXk0eEh6QWRCZ05WQkFNVEZrRjRhVzl0SUVSbGJXOGdRMlZ5ZEdsbWFXTmhkR1V3SGhjTk1UUXcKTmpJd01EUXpNREkzV2hjTk5ERXhNVEExTURRek1ESTNXakNCdWpFTE1Ba0dBMVVFQmhNQ1ZWTXhDekFKQmdOVkJBZ1RBa05CTVJZdwpGQVlEVlFRSEV3MVRZVzRnUm5KaGJtTnBjMk52TVJJd0VBWURWUVFLRXdsQmVHbHZiU0JUVTA4eFVUQlBCZ05WQkFzVFNFWlBVaUJFClJVMVBUbE5VVWtGVVNVOU9JRkJWVWxCUFUwVlRJRTlPVEZrdUlFUlBJRTVQVkNCVlUwVWdSazlTSUZCU1QwUlZRMVJKVDA0Z1JVNVcKU1ZKUFRrMUZUbFJUTGpFZk1CMEdBMVVFQXhNV1FYaHBiMjBnUkdWdGJ5QkRaWEowYVdacFkyRjBaVENDQWJnd2dnRXNCZ2NxaGtqTwpPQVFCTUlJQkh3S0JnUUQ5ZjFPQkhYVVNLVkxmU3B3dTdPVG45aEczVWp6dlJBRERIaitBdGxFbWFVVmRRQ0pSKzFrOWpWajZ2OFgxCnVqRDJ5NXRWYk5lQk80QWRORy95Wm1DM2E1bFFwYVNmbitnRWV4QWl3ays3cWRmK3Q4WWIrRHRYNThhb3BoVVBCUHVEOXRQRkhzTUMKTlZRVFdoYVJNdloxODY0cllkY3E3L0lpQXhtZDBVZ0J4d0lWQUpkZ1VJOFZJd3ZNc3BLNWdxTHJoQXZ3V0J6MUFvR0JBUGZob0lYVwptejNleTd5clhEYTRWN2w1bEsrNytqcnFndmxYVEFzOUI0Sm5VVmxYanJyVVdVL21jUWNRZ1lDMFNSWnhJK2hNS0JZVHQ4OEpNb3pJCnB1RThGbnFMVkh5TktPQ2pyaDRyczZaMWtXNmpmd3Y2SVRWaThmdGllZ0VrTzh5azhiNm9VWkNKcUlQZjRWcmxud2FTaTJaZWdIdFYKSldRQlREdit6MGtxQTRHRkFBS0JnUUNYcjFtcDRVdkJ5WTZkR2JET3lxM3dNczZPN01DeG1Fa1UyeDMyQWtFcDZzN1hmaXkzTVl3Swp3WlE0c0w0Qm1RWXpaN1FPWFBQOGRLZ3JLRFFLTGs5dFhXT2d2SW9PQ2lOQWRRRFlsUm0yc1lnckkyU1VjeU0xYktEcUx3REQ4WjVPCm9MZXVRQXRnTWZBcS9mMUM2blJFV3JRdWRQeE93YW9OZEhrWWNSKzA2Nk1oTUI4d0hRWURWUjBPQkJZRUZFMkpBYzk3d2ZISzViNDIKbktiQU5uNFNNY3FjTUFzR0J5cUdTTTQ0QkFNRkFBTXZBREFzQWhSK0NqdnA4VXdOZ0tIZngyUFdKb1JpMC8xcThBSVVOaFRYV2xHegpKM1NkQmxnUnNkRmdLeUZ0Y3hFPTwvZHM6WDUwOUNlcnRpZmljYXRlPjwvZHM6WDUwOURhdGE%2BPC9kczpLZXlJbmZvPjwvZHM6U2lnbmF0dXJlPjxzYW1sMnA6U3RhdHVzPjxzYW1sMnA6U3RhdHVzQ29kZSBWYWx1ZT0idXJuOm9hc2lzOm5hbWVzOnRjOlNBTUw6Mi4wOnN0YXR1czpTdWNjZXNzIi8%2BPC9zYW1sMnA6U3RhdHVzPjxzYW1sMjpBc3NlcnRpb24geG1sbnM6c2FtbDI9InVybjpvYXNpczpuYW1lczp0YzpTQU1MOjIuMDphc3NlcnRpb24iIElEPSJfNmQ4MzhiOWEtMzhkN2M5MTQiIElzc3VlSW5zdGFudD0iMjAxNi0wOC0yNFQxNzo1MjoxOC4wNzhaIiBWZXJzaW9uPSIyLjAiPjxzYW1sMjpJc3N1ZXI%2BaHR0cDovL2F4aW9tc3NvLmhlcm9rdWFwcC5jb208L3NhbWwyOklzc3Vlcj48c2FtbDI6U3ViamVjdD48c2FtbDI6TmFtZUlEIEZvcm1hdD0idXJuOm9hc2lzOm5hbWVzOnRjOlNBTUw6MS4xOm5hbWVpZC1mb3JtYXQ6dW5zcGVjaWZpZWQiPjcwMDU5MzY8L3NhbWwyOk5hbWVJRD48c2FtbDI6U3ViamVjdENvbmZpcm1hdGlvbiBNZXRob2Q9InVybjpvYXNpczpuYW1lczp0YzpTQU1MOjIuMDpjbTpiZWFyZXIiPjxzYW1sMjpTdWJqZWN0Q29uZmlybWF0aW9uRGF0YSBOb3RPbk9yQWZ0ZXI9IjIwMTYtMDgtMjRUMTc6NTM6MTguMDc4WiIgUmVjaXBpZW50PSJodHRwczovL2NicmFuZHMtLUNCZWVyRGV2LmNzMjAubXkuc2FsZXNmb3JjZS5jb20vc2VydmljZXMvb2F1dGgyL3Rva2VuP3NvPTAwRG0wMDAwMDAwOGZDSiIvPjwvc2FtbDI6U3ViamVjdENvbmZpcm1hdGlvbj48L3NhbWwyOlN1YmplY3Q%2BPHNhbWwyOkNvbmRpdGlvbnMgTm90QmVmb3JlPSIyMDE2LTA4LTI0VDE3OjUyOjE4LjA3OFoiIE5vdE9uT3JBZnRlcj0iMjAxNi0wOC0yNFQxNzo1MzoxOC4wNzhaIj48c2FtbDI6QXVkaWVuY2VSZXN0cmljdGlvbj48c2FtbDI6QXVkaWVuY2U%2BaHR0cHM6Ly9jYnJhbmRzLS1jYmVlcmRldi5jczIwLm15LnNhbGVzZm9yY2UuY29tPC9zYW1sMjpBdWRpZW5jZT48L3NhbWwyOkF1ZGllbmNlUmVzdHJpY3Rpb24%2BPC9zYW1sMjpDb25kaXRpb25zPjxzYW1sMjpBdXRoblN0YXRlbWVudCBBdXRobkluc3RhbnQ9IjIwMTYtMDgtMjRUMTc6NTI6MTguMDc4WiI%2BPHNhbWwyOkF1dGhuQ29udGV4dD48c2FtbDI6QXV0aG5Db250ZXh0Q2xhc3NSZWY%2BdXJuOm9hc2lzOm5hbWVzOnRjOlNBTUw6Mi4wOmFjOmNsYXNzZXM6dW5zcGVjaWZpZWQ8L3NhbWwyOkF1dGhuQ29udGV4dENsYXNzUmVmPjwvc2FtbDI6QXV0aG5Db250ZXh0Pjwvc2FtbDI6QXV0aG5TdGF0ZW1lbnQ%2BPHNhbWwyOkF0dHJpYnV0ZVN0YXRlbWVudD48c2FtbDI6QXR0cmlidXRlIE5hbWU9InNzb1N0YXJ0UGFnZSIgTmFtZUZvcm1hdD0idXJuOm9hc2lzOm5hbWVzOnRjOlNBTUw6Mi4wOmF0dHJuYW1lLWZvcm1hdDp1bnNwZWNpZmllZCI%2BPHNhbWwyOkF0dHJpYnV0ZVZhbHVlIHhtbG5zOnhzaT0iaHR0cDovL3d3dy53My5vcmcvMjAwMS9YTUxTY2hlbWEtaW5zdGFuY2UiIHhzaTp0eXBlPSJ4czpzdHJpbmciPmh0dHA6Ly9heGlvbXNzby5oZXJva3VhcHAuY29tL1JlcXVlc3RTYW1sUmVzcG9uc2UuYWN0aW9uPC9zYW1sMjpBdHRyaWJ1dGVWYWx1ZT48L3NhbWwyOkF0dHJpYnV0ZT48c2FtbDI6QXR0cmlidXRlIE5hbWU9ImxvZ291dFVSTCIgTmFtZUZvcm1hdD0idXJuOm9hc2lzOm5hbWVzOnRjOlNBTUw6Mi4wOmF0dHJuYW1lLWZvcm1hdDp1bnNwZWNpZmllZCI%2BPHNhbWwyOkF0dHJpYnV0ZVZhbHVlIHhtbG5zOnhzaT0iaHR0cDovL3d3dy53My5vcmcvMjAwMS9YTUxTY2hlbWEtaW5zdGFuY2UiIHhzaTp0eXBlPSJ4czpzdHJpbmciLz48L3NhbWwyOkF0dHJpYnV0ZT48L3NhbWwyOkF0dHJpYnV0ZVN0YXRlbWVudD48L3NhbWwyOkFzc2VydGlvbj48L3NhbWwycDpSZXNwb25zZT4%3D'},
    headers:
     { 'postman-token': '1867e96c-ea57-e2fb-5d35-d7c346547b4e',
       'cache-control': 'no-cache' } };

  request(options, function (error, response, body) {
    if (error) throw new Error(error);
    console.log(response);
  });
};

exports.SSOLoginTest = function(app, req, res) {
  var SSOLoginPromiseTest = new Promise(function (resolve, reject) {
    var authnRequest = sfdc.sendAuthnRequestTest(app, req, res);
    console.log('Called sendAuthnRequestTest');

    if (authnRequest !== null) {
      console.log(utility.inspect(authnRequest, null, ''));
      resolve(authnRequest);
    } else {
      var err = 'There was an error trying to login: ' + err;
      reject(err);
    }
  });

  SSOLoginPromiseTest.then(function (result) {
    console.log('Returned from sendAuthnRequest with ' + utility.inspect(result, null, ''));
    console.log('Will get Auth Token and Session Id next');                                      //  getAuthToken();                                        //  getSessionId();
  },
  function (err) {
    console.log(err);
  });
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
