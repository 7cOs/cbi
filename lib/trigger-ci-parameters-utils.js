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
  branchName: 'doesntexist', // TODO:switch back before creating PR
  token: process.env.CIRCLE_CI_API_TOKEN,
  runTestSuite: '',
  runTestSuiteEnvt: 'qa',
  skipDeployment: true
};

module.exports = {
  parametersArgNames: parametersArgNames,
  possibleEnvironments: possibleEnvironments,

  parse: (parametersArray) => {
    const parameters = Object.assign({}, defaultParameters);

    parametersArray.forEach((value, index, array) => {
      if (value.indexOf(parametersArgNames.project) !== -1) {
        parameters.project = value.slice(parametersArgNames.project.length);
        if (!parameters.project || !parameters.project.length) {
          console.log('Please enter a valid project');
        }
      }

      if (value.indexOf(parametersArgNames.branch) !== -1) {
        parameters.branchName = value.slice(parametersArgNames.branch.length);
        if (!parameters.branchName || !parameters.branchName.length) {
          console.log('Please enter a valid branch name');
        }
      }

      if (value.indexOf(parametersArgNames.token) !== -1) {
        parameters.token = value.slice(parametersArgNames.token.length);
        if (!parameters.token || !parameters.token.length) {
          console.log('Please enter a valid token');
        }
      }

      if (value.indexOf(parametersArgNames.runTestSuite) !== -1) {
        parameters.runTestSuite = value.slice(parameters.runTestSuite.length);
      }

      if (value.indexOf(parametersArgNames.runTestSuiteEnvt) !== -1) {
        parameters.runTestSuiteEnvt = value.slice(parametersArgNames.runTestSuiteEnvt.length);
        if (!parameters.runTestSuiteEnvt || possibleEnvironments.indexOf(parameters.runTestSuiteEnvt) === -1) {
          console.log('Please enter a valid environment for the test suite');
        }
      }

      if (value.indexOf(parametersArgNames.skipDeployment) !== -1) {
        parameters.skipDeployment = value.slice(parameters.skipDeployment.length) !== 'false';
      }
    });

    return parameters;
  }
};
