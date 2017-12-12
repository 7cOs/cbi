'use strict';

const rp = require('request-promise');

const circleCIClient = require('../../lib/circle-ci-client');
const parametersUtils = require('../../lib/trigger-ci-parameters-utils');

module.exports = function(app) {
  app.post('/slack-app', (req, res) => {
    console.log(req.body);

    if (!req.body.token || req.body.token !== process.env.SLACK_APP_TOKEN) {
      res.send(401);
    } else {

      const parameters = parametersUtils.parse(req.body.text.split(' '));

// do a try/catch around parameters

      res.json({'text': 'Requesting build...'});

      circleCIClient.buildBranch(parameters)
      .then((parsedBody) => {
        sendUpdateToSlashFunction(req.body.response_url, 'Build created!');
        sendUpdateToSlashFunction(req.body.response_url, 'Build URL: ' + parsedBody.build_url);
      })
      .catch((error) => {
        console.log('error called');
        console.log(error);
        sendUpdateToSlashFunction(req.body.response_url, 'There was an error creating the build');
      });
    }
  });
};

function sendUpdateToSlashFunction(url, text) {
  console.log('Sending updates');
  console.log(`url = ${url}`);
  const options = {
    method: 'POST',
    uri: url,
    body: {
      'text': text
    },
    json: true
  };

  rp(options)
  .then((parsedBody) => {
    console.log('Update sent!');
    // console.log(parsedBody);
  })
  .catch((error) => {
    console.log('error sending an update');
    console.log(error);
  });
}
