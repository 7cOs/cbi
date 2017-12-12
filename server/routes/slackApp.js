'use strict';

const rp = require('request-promise');

const circleCIClient = require('../../lib/circle-ci-client');
const parametersUtils = require('../../lib/trigger-ci-parameters-utils');

module.exports = function(app) {
  app.post('/slack-app', (req, res) => {
    console.log(req.body);

// check token

    const parameters = parametersUtils.parse(req.body.text.split(' '));

    circleCIClient.buildBranch(parameters)
    .then((response) => {
      console.log('then called');
      // console.log(response);
      sendUpdateToSlashFunction(req.body.response_url, 'Build created!');
    })
    .catch((error) => {
      console.log('error called');
      console.log(error);
      sendUpdateToSlashFunction(req.body.response_url, 'There was an error creating the build');
    });

    res.json({'text': 'Requesting build...'});
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
