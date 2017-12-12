const circleCIClient = require('../lib/circle-ci-client');
const parametersUtils = require('../lib/trigger-ci-parameters-utils');

try {
  const parameters = parametersUtils.parse(process.argv);
  triggerBuild(parameters);
} catch (error) {
  console.log(error.message);
  console.log(parametersUtils.instructions);
}

function triggerBuild(parameters) {
  if (parameters.project && parameters.project.length &&
    parameters.branchName && parameters.branchName.length &&
    parameters.token && parameters.token.length) {
      circleCIClient.buildBranch(parameters)
      .then((parsedBody) => {
        console.log('Build created with success!');
      })
      .catch((error) => {
        console.log('Error when creating the build');
        throw error;
      });
  } else {
    throw new Error('Insufficient arguments');
  }
}
