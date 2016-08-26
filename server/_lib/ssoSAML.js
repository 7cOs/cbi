'use strict';
/* **********************************************
This script will produce a valid SAML assertion.  It
runs under node.js, so that, npm, and the node
modules request, cheerio, he, and urlencode must be
installed for it to work.

I typically run it in the commandline like this:

node SAMLtest.js > SAMLPage.html

When you do this, SAMLPage.html will contain 3
versions of a valid assertion, along with a
urlencoded URL that can be POSTed to the token endpoint.
i.e.: https://cbrands--cbeerdev.cs20.my.salesforce.com/services/oauth2/token?so=00Dm00000008fCJ&grant_type=assertion&assertion_type=urn%3Aoasis%3Anames%3Atc%3ASAML%3A2.0%3Abrowser&assertion=PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48c2FtbDJwOlJlc3BvbnNlIHhtbG5zOnNhbWwycD0idXJuOm9hc2lzOm5hbWVzOnRjOlNBTUw6Mi4wOnByb3RvY29sIiB4bWxuczp4cz0iaHR0cDovL3d3dy53My5vcmcvMjAwMS9YTUxTY2hlbWEiIERlc3RpbmF0aW9uPSJodHRwczovL2NicmFuZHMtLUNCZWVyRGV2LmNzMjAubXkuc2FsZXNmb3JjZS5jb20vc2VydmljZXMvb2F1dGgyL3Rva2VuP3NvPTAwRG0wMDAwMDAwOGZDSiIgSUQ9Il8zNmE4NTRhNi02ZDAyNzJjMSIgSXNzdWVJbnN0YW50PSIyMDE2LTA4LTI1VDA2OjExOjUwLjE1NloiIFZlcnNpb249IjIuMCI%2BPHNhbWwyOklzc3VlciB4bWxuczpzYW1sMj0idXJuOm9hc2lzOm5hbWVzOnRjOlNBTUw6Mi4wOmFzc2VydGlvbiI%2BaHR0cHM6Ly9heGlvbXNzby5oZXJva3VhcHAuY29tPC9zYW1sMjpJc3N1ZXI%2BPGRzOlNpZ25hdHVyZSB4bWxuczpkcz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC8wOS94bWxkc2lnIyI%2BPGRzOlNpZ25lZEluZm8%2BPGRzOkNhbm9uaWNhbGl6YXRpb25NZXRob2QgQWxnb3JpdGhtPSJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzEwL3htbC1leGMtYzE0biMiLz48ZHM6U2lnbmF0dXJlTWV0aG9kIEFsZ29yaXRobT0iaHR0cDovL3d3dy53My5vcmcvMjAwMC8wOS94bWxkc2lnI2RzYS1zaGExIi8%2BPGRzOlJlZmVyZW5jZSBVUkk9IiNfMzZhODU0YTYtNmQwMjcyYzEiPjxkczpUcmFuc2Zvcm1zPjxkczpUcmFuc2Zvcm0gQWxnb3JpdGhtPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwLzA5L3htbGRzaWcjZW52ZWxvcGVkLXNpZ25hdHVyZSIvPjxkczpUcmFuc2Zvcm0gQWxnb3JpdGhtPSJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzEwL3htbC1leGMtYzE0biMiPjxlYzpJbmNsdXNpdmVOYW1lc3BhY2VzIHhtbG5zOmVjPSJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzEwL3htbC1leGMtYzE0biMiIFByZWZpeExpc3Q9InhzIi8%2BPC9kczpUcmFuc2Zvcm0%2BPC9kczpUcmFuc2Zvcm1zPjxkczpEaWdlc3RNZXRob2QgQWxnb3JpdGhtPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwLzA5L3htbGRzaWcjc2hhMSIvPjxkczpEaWdlc3RWYWx1ZT53ek91T29ObTZvNzlXYjJjVUc3WEFhbmpzcWs9PC9kczpEaWdlc3RWYWx1ZT48L2RzOlJlZmVyZW5jZT48L2RzOlNpZ25lZEluZm8%2BPGRzOlNpZ25hdHVyZVZhbHVlPkJqbWR0d0Zua3Nyd3psWjc3ZnFVeDdsWEY2ZDZSMFZaTUZRSE1ra2dNbDg3T3IrRXltalVTUT09PC9kczpTaWduYXR1cmVWYWx1ZT48ZHM6S2V5SW5mbz48ZHM6WDUwOURhdGE%2BPGRzOlg1MDlDZXJ0aWZpY2F0ZT5NSUlEMHpDQ0E1R2dBd0lCQWdJRUYvdUZJVEFMQmdjcWhrak9PQVFEQlFBd2dib3hDekFKQmdOVkJBWVRBbFZUTVFzd0NRWURWUVFJCkV3SkRRVEVXTUJRR0ExVUVCeE1OVTJGdUlFWnlZVzVqYVhOamJ6RVNNQkFHQTFVRUNoTUpRWGhwYjIwZ1UxTlBNVkV3VHdZRFZRUUwKRTBoR1QxSWdSRVZOVDA1VFZGSkJWRWxQVGlCUVZWSlFUMU5GVXlCUFRreFpMaUJFVHlCT1QxUWdWVk5GSUVaUFVpQlFVazlFVlVOVQpTVTlPSUVWT1ZrbFNUMDVOUlU1VVV5NHhIekFkQmdOVkJBTVRGa0Y0YVc5dElFUmxiVzhnUTJWeWRHbG1hV05oZEdVd0hoY05NVFF3Ck5qSXdNRFF6TURJM1doY05OREV4TVRBMU1EUXpNREkzV2pDQnVqRUxNQWtHQTFVRUJoTUNWVk14Q3pBSkJnTlZCQWdUQWtOQk1SWXcKRkFZRFZRUUhFdzFUWVc0Z1JuSmhibU5wYzJOdk1SSXdFQVlEVlFRS0V3bEJlR2x2YlNCVFUwOHhVVEJQQmdOVkJBc1RTRVpQVWlCRQpSVTFQVGxOVVVrRlVTVTlPSUZCVlVsQlBVMFZUSUU5T1RGa3VJRVJQSUU1UFZDQlZVMFVnUms5U0lGQlNUMFJWUTFSSlQwNGdSVTVXClNWSlBUazFGVGxSVExqRWZNQjBHQTFVRUF4TVdRWGhwYjIwZ1JHVnRieUJEWlhKMGFXWnBZMkYwWlRDQ0FiZ3dnZ0VzQmdjcWhrak8KT0FRQk1JSUJId0tCZ1FEOWYxT0JIWFVTS1ZMZlNwd3U3T1RuOWhHM1VqenZSQURESGorQXRsRW1hVVZkUUNKUisxazlqVmo2djhYMQp1akQyeTV0VmJOZUJPNEFkTkcveVptQzNhNWxRcGFTZm4rZ0VleEFpd2srN3FkZit0OFliK0R0WDU4YW9waFVQQlB1RDl0UEZIc01DCk5WUVRXaGFSTXZaMTg2NHJZZGNxNy9JaUF4bWQwVWdCeHdJVkFKZGdVSThWSXd2TXNwSzVncUxyaEF2d1dCejFBb0dCQVBmaG9JWFcKbXozZXk3eXJYRGE0VjdsNWxLKzcranJxZ3ZsWFRBczlCNEpuVVZsWGpyclVXVS9tY1FjUWdZQzBTUlp4SStoTUtCWVR0ODhKTW96SQpwdUU4Rm5xTFZIeU5LT0Nqcmg0cnM2WjFrVzZqZnd2NklUVmk4ZnRpZWdFa084eWs4YjZvVVpDSnFJUGY0VnJsbndhU2kyWmVnSHRWCkpXUUJURHYrejBrcUE0R0ZBQUtCZ1FDWHIxbXA0VXZCeVk2ZEdiRE95cTN3TXM2TzdNQ3htRWtVMngzMkFrRXA2czdYZml5M01Zd0sKd1pRNHNMNEJtUVl6WjdRT1hQUDhkS2dyS0RRS0xrOXRYV09ndklvT0NpTkFkUURZbFJtMnNZZ3JJMlNVY3lNMWJLRHFMd0REOFo1TwpvTGV1UUF0Z01mQXEvZjFDNm5SRVdyUXVkUHhPd2FvTmRIa1ljUiswNjZNaE1COHdIUVlEVlIwT0JCWUVGRTJKQWM5N3dmSEs1YjQyCm5LYkFObjRTTWNxY01Bc0dCeXFHU000NEJBTUZBQU12QURBc0FoUitDanZwOFV3TmdLSGZ4MlBXSm9SaTAvMXE4QUlVTmhUWFdsR3oKSjNTZEJsZ1JzZEZnS3lGdGN4RT08L2RzOlg1MDlDZXJ0aWZpY2F0ZT48L2RzOlg1MDlEYXRhPjwvZHM6S2V5SW5mbz48L2RzOlNpZ25hdHVyZT48c2FtbDJwOlN0YXR1cz48c2FtbDJwOlN0YXR1c0NvZGUgVmFsdWU9InVybjpvYXNpczpuYW1lczp0YzpTQU1MOjIuMDpzdGF0dXM6U3VjY2VzcyIvPjwvc2FtbDJwOlN0YXR1cz48c2FtbDI6QXNzZXJ0aW9uIHhtbG5zOnNhbWwyPSJ1cm46b2FzaXM6bmFtZXM6dGM6U0FNTDoyLjA6YXNzZXJ0aW9uIiBJRD0iXzE4YjczNGEyLTdmY2Y4YzBmIiBJc3N1ZUluc3RhbnQ9IjIwMTYtMDgtMjVUMDY6MTE6NTAuMTU2WiIgVmVyc2lvbj0iMi4wIj48c2FtbDI6SXNzdWVyPmh0dHBzOi8vYXhpb21zc28uaGVyb2t1YXBwLmNvbTwvc2FtbDI6SXNzdWVyPjxzYW1sMjpTdWJqZWN0PjxzYW1sMjpOYW1lSUQgRm9ybWF0PSJ1cm46b2FzaXM6bmFtZXM6dGM6U0FNTDoxLjE6bmFtZWlkLWZvcm1hdDp1bnNwZWNpZmllZCI%2BNzAwNTkzNjwvc2FtbDI6TmFtZUlEPjxzYW1sMjpTdWJqZWN0Q29uZmlybWF0aW9uIE1ldGhvZD0idXJuOm9hc2lzOm5hbWVzOnRjOlNBTUw6Mi4wOmNtOmJlYXJlciI%2BPHNhbWwyOlN1YmplY3RDb25maXJtYXRpb25EYXRhIE5vdE9uT3JBZnRlcj0iMjAxNi0wOC0yNVQwNjoxMjo1MC4xNTZaIiBSZWNpcGllbnQ9Imh0dHBzOi8vY2JyYW5kcy0tQ0JlZXJEZXYuY3MyMC5teS5zYWxlc2ZvcmNlLmNvbS9zZXJ2aWNlcy9vYXV0aDIvdG9rZW4%2Fc289MDBEbTAwMDAwMDA4ZkNKIi8%2BPC9zYW1sMjpTdWJqZWN0Q29uZmlybWF0aW9uPjwvc2FtbDI6U3ViamVjdD48c2FtbDI6Q29uZGl0aW9ucyBOb3RCZWZvcmU9IjIwMTYtMDgtMjVUMDY6MTE6NTAuMTU2WiIgTm90T25PckFmdGVyPSIyMDE2LTA4LTI1VDA2OjEyOjUwLjE1NloiPjxzYW1sMjpBdWRpZW5jZVJlc3RyaWN0aW9uPjxzYW1sMjpBdWRpZW5jZT5odHRwczovL3NhbWwuc2FsZXNmb3JjZS5jb208L3NhbWwyOkF1ZGllbmNlPjwvc2FtbDI6QXVkaWVuY2VSZXN0cmljdGlvbj48L3NhbWwyOkNvbmRpdGlvbnM%2BPHNhbWwyOkF1dGhuU3RhdGVtZW50IEF1dGhuSW5zdGFudD0iMjAxNi0wOC0yNVQwNjoxMTo1MC4xNTZaIj48c2FtbDI6QXV0aG5Db250ZXh0PjxzYW1sMjpBdXRobkNvbnRleHRDbGFzc1JlZj51cm46b2FzaXM6bmFtZXM6dGM6U0FNTDoyLjA6YWM6Y2xhc3Nlczp1bnNwZWNpZmllZDwvc2FtbDI6QXV0aG5Db250ZXh0Q2xhc3NSZWY%2BPC9zYW1sMjpBdXRobkNvbnRleHQ%2BPC9zYW1sMjpBdXRoblN0YXRlbWVudD48c2FtbDI6QXR0cmlidXRlU3RhdGVtZW50PjxzYW1sMjpBdHRyaWJ1dGUgTmFtZT0ic3NvU3RhcnRQYWdlIiBOYW1lRm9ybWF0PSJ1cm46b2FzaXM6bmFtZXM6dGM6U0FNTDoyLjA6YXR0cm5hbWUtZm9ybWF0OnVuc3BlY2lmaWVkIj48c2FtbDI6QXR0cmlidXRlVmFsdWUgeG1sbnM6eHNpPSJodHRwOi8vd3d3LnczLm9yZy8yMDAxL1hNTFNjaGVtYS1pbnN0YW5jZSIgeHNpOnR5cGU9InhzOnN0cmluZyI%2BaHR0cDovL2F4aW9tc3NvLmhlcm9rdWFwcC5jb20vUmVxdWVzdFNhbWxSZXNwb25zZS5hY3Rpb248L3NhbWwyOkF0dHJpYnV0ZVZhbHVlPjwvc2FtbDI6QXR0cmlidXRlPjxzYW1sMjpBdHRyaWJ1dGUgTmFtZT0ibG9nb3V0VVJMIiBOYW1lRm9ybWF0PSJ1cm46b2FzaXM6bmFtZXM6dGM6U0FNTDoyLjA6YXR0cm5hbWUtZm9ybWF0OnVuc3BlY2lmaWVkIj48c2FtbDI6QXR0cmlidXRlVmFsdWUgeG1sbnM6eHNpPSJodHRwOi8vd3d3LnczLm9yZy8yMDAxL1hNTFNjaGVtYS1pbnN0YW5jZSIgeHNpOnR5cGU9InhzOnN0cmluZyIvPjwvc2FtbDI6QXR0cmlidXRlPjwvc2FtbDI6QXR0cmlidXRlU3RhdGVtZW50Pjwvc2FtbDI6QXNzZXJ0aW9uPjwvc2FtbDJwOlJlc3BvbnNlPg%3D%3D

************************************************/
exports.getSAMLAssertion = function(encoding, empId) {

  var request = require('request');
  var cheerio = require('cheerio');
  var he = require('he');
  var urlencode = require('urlencode');
  var b64url = require('base64url');
  var b, raw, b64, u64, b64u;

  var options = { method: 'POST',
    url: 'http://axiomsso.herokuapp.com/GenerateSamlResponse.action',
    qs:
     { 'idpConfig.samlVersion': '_2_0',
       'idpConfig.userId': empId,
       'idpConfig.samlUserIdLocation': 'SUBJECT',
       'idpConfig.issuer': 'https://axiomsso.herokuapp.com',
       'idpConfig.recipient': 'https://cbrands--CBeerDev.cs20.my.salesforce.com?so=00Dm00000008fCJ',
       'idpConfig.ssoStartPage': 'http://axiomsso.herokuapp.com/RequestSamlResponse.action',
       'idpConfig.startURL': '',
       'idpConfig.logoutURL': '',
       'idpConfig.userType': 'STANDARD',
       'idpConfig.additionalAttributes': '' },
    headers:
     { 'postman-token': 'ba6870cc-5a9c-0746-c136-9c028b2ed51c',
       'cache-control': 'no-cache' } };

  request(options, function (error, response, body) {
    if (error) throw new Error(error);
    var $ = cheerio.load(body);

    var s = $('textarea').html();
    b = new Buffer(he.decode(s));
    raw = b;
    b64 = b.toString('base64');
    u64 = urlencode(b64);
    b64u = b64url(raw);
    var enc = 'u64';

    console.log('<---------------------------------Original------------------------->');
    console.log('\n\n' + raw + '\n\n');
    console.log('<---------------------------------Base64--------------------------->');
    console.log('\n\n' + b64 + '\n\n');
    console.log('<---------------------------------Urlencoded-Base64---------------->');
    console.log('\n\n' + u64 + '\n\n');
    console.log('<---------------------------------Base64URL Encoded---------------->');
    console.log('\n\n' + b64u + '\n\n');

    var postURL = 'https://cbrands--cbeerdev.cs20.my.salesforce.com/services/oauth2/token';
    var so = '00Dm00000008fCJ';
    var grantType = 'assertion';
    var assertionType = 'urn%3Aoasis%3Anames%3Atc%3ASAML%3A2.0%3Aprofiles%3ASSO%3Abrowser';

    console.log('--------------------> POST this URL <---------------------------');
    console.log('\n\n' + postURL + '?so=' + so + '&grant_type=' + grantType + '&assertion_type=' + assertionType + '&assertion=' + u64);
    console.log('\n\n------------------->URL Complete<---------------------------');

    if (enc === 'raw') {
      return raw;
    } else if (enc === 'base64') {
      return b64;
    } else if (enc === 'base64+URL') {
      return u64;
    } else if (enc === 'base64Url') {
      return b64u;
    } else  {
      return ('Invalid encoding: ' + enc);
    }
  });
};
