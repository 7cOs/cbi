const rp = require('request-promise');

const username = 'ConstellationBrands';

module.exports = {
  buildBranch: function(parameters) {
    const url = `https://circleci.com/api/v1.1/project/github/${username}/${parameters.project}/tree/${encodeURIComponent(parameters.branchName)}?circle-token=${parameters.token}`;
    const options = {
      method: 'POST',
      uri: url,
      body: {
        build_parameters: {
          skipDeployment: parameters.skipDeployment
        }
      },
      json: true
    };

    if (parameters.runTestSuite) {
      options.body.build_parameters.runTestSuite = parameters.runTestSuite;
    }

    if (parameters.runTestSuiteEnvt) {
      options.body.build_parameters.runTestSuiteEnvt = parameters.runTestSuiteEnvt;
    }

    return new Promise((resolve, reject) => {
      rp(options)
      .then((parsedBody) => {
        console.log('Build created with success!');
        resolve(parsedBody);
      })
      .catch((error) => {
        console.log('error when creating the build');
        reject(error);
      });
    });
  }
};
