const parametersArgNames = {
  project: 'project:',
  branch: 'branch:',
  token: 'token:',
  runTestSuite: 'runTestSuite:',
  runTestSuiteEnvt: 'runTestSuiteEnvt:',
  skipDeployment: 'skipDeployment:'
};

const possibleEnvironments = ['qa'];

const defaultParameters = {
  project: 'compass-portal',
  branchName: 'test',
  token: process.env.CIRCLE_CI_API_TOKEN,
  runTestSuite: '',
  runTestSuiteEnvt: 'qa',
  skipDeployment: true
};

module.exports = {
  parametersArgNames: parametersArgNames,
  possibleEnvironments: possibleEnvironments,

  parse: function(parametersArray) {
    const parameters = Object.assign({}, defaultParameters);

    parametersArray.forEach((value, index, array) => {
      if (value.indexOf(parametersArgNames.projectArgName) !== -1) {
        parameters.project = value.slice(parametersArgNames.projectArgName.length);
        if (!parameters.project || !parameters.project.length) {
          console.log('Please enter a valid project');
        }
      }

      if (value.indexOf(parametersArgNames.branchArgName) !== -1) {
        parameters.branchName = value.slice(parametersArgNames.branchArgName.length);
        if (!parameters.branchName || !parameters.branchName.length) {
          console.log('Please enter a valid branch name');
        }
      }

      if (value.indexOf(parametersArgNames.tokenArgName) !== -1) {
        parameters.token = value.slice(parametersArgNames.tokenArgName.length);
        if (!parameters.token || !parameters.token.length) {
          console.log('Please enter a valid token');
        }
      }

      if (value.indexOf(parametersArgNames.runTestSuiteArgName) !== -1) {
        parameters.runTestSuite = value.slice(parameters.runTestSuiteArgName.length);
      }

      if (value.indexOf(parametersArgNames.runTestSuiteEnvtArgName) !== -1) {
        parameters.runTestSuiteEnvt = value.slice(parametersArgNames.runTestSuiteEnvtArgName.length);
        if (!parameters.runTestSuiteEnvt || possibleEnvironments.indexOf(parameters.runTestSuiteEnvt) === -1) {
          console.log('Please enter a valid environment for the test suite');
        }
      }

      if (value.indexOf(parametersArgNames.skipDeploymentArgName) !== -1) {
        parameters.skipDeployment = value.slice(parameters.skipDeploymentArgName.length) !== 'false';
      }
    });

    return parameters;
  }
};
