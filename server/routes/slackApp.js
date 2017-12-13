'use strict';

const rp = require('request-promise');

const circleCIClient = require('../../lib/circle-ci-client');
const parametersUtils = require('../../lib/trigger-ci-parameters-utils');

module.exports = function(app) {
  app.post('/slack-app', (req, res) => {
    if (!req.body.token || req.body.token !== process.env.SLACK_APP_TOKEN) {
      res.send(401);
    } else {

      try {
        const parameters = parametersUtils.parse(req.body.text.split(' '));
        res.json({'text': 'Creating build...'});
        triggerBuild(parameters, req.body.response_url);
      } catch (error) {
        sendUpdateToSlashFunction(req.body.response_url, error.message);
        sendUpdateToSlashFunction(req.body.response_url, parametersUtils.instructions);
      }
    }
  });
};

function triggerBuild(parameters, responseURL) {
  circleCIClient.buildBranch(parameters)
  .then((parsedBody) => {
    sendUpdateToSlashFunction(responseURL, 'Build created!');
    sendUpdateToSlashFunction(responseURL, 'Build URL: ' + parsedBody.build_url);
  })
  .catch((error) => {
    sendUpdateToSlashFunction(responseURL, 'There was an error when creating the build');
    sendUpdateToSlashFunction(responseURL, error.message);
    sendUpdateToSlashFunction(responseURL, parametersUtils.instructions);
  });
}

function sendUpdateToSlashFunction(url, text) {
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
  })
  .catch((error) => {
    console.log(error);
  });
}
