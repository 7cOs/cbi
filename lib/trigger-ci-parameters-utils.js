const parametersArgNames = {
  project: 'project:',
  branch: 'branch:',
  token: 'token:',
  runTestSuite: 'runTestSuite:',
  runTestSuiteEnvt: 'runTestSuiteEnvt:',
  skipDeployment: 'skipDeployment:'
};

const possibleEnvironments = ['qa'];

const instructions = 'Please provide valid arguments. Usage:' +
  '\n  node trigger-ci-build.js opt1:val1 opt2:val2 ...' +
  '\nOptions:' +
  `\n  ${parametersArgNames.projectArgName}<repo/ci-project> [default: compass-portal]` +
  `\n  ${parametersArgNames.branchArgName}<branch> [default: test]` +
  `\n  ${parametersArgNames.tokenArgName}<ci-token> [default: process.env.CIRCLE_CI_API_TOKEN]` +
  `\n  ${parametersArgNames.runTestSuiteArgName}<suite>` +
  `\n  ${parametersArgNames.runTestSuiteEnvtArgName}<suite-environment> [default: qa] [possible values:[${possibleEnvironments}]]` +
  `\n  ${parametersArgNames.skipDeploymentArgName}<true|false> [default: true]`;

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
  instructions: instructions,

  parse: (parametersArray) => {
    const parameters = Object.assign({}, defaultParameters);
    let errors = '';

    parametersArray.forEach((parameter, index, array) => {
      if (parameter.indexOf(parametersArgNames.project) !== -1) {
        parameters.project = parameter.slice(parametersArgNames.project.length);
        if (!parameters.project || !parameters.project.length) {
          errors += `${errors.length ? '\n' : ''}Error while parsing project`;
        }
      }

      if (parameter.indexOf(parametersArgNames.branch) !== -1) {
        parameters.branchName = parameter.slice(parametersArgNames.branch.length);
        if (!parameters.branchName || !parameters.branchName.length) {
          errors += `${errors.length ? '\n' : ''}Error while parsing branch name`;
        }
      }

      if (parameter.indexOf(parametersArgNames.token) !== -1) {
        parameters.token = parameter.slice(parametersArgNames.token.length);
        if (!parameters.token || !parameters.token.length) {
          errors += `${errors.length ? '\n' : ''}Error while parsing token`;
        }
      }

      if (parameter.indexOf(parametersArgNames.runTestSuite) !== -1) {
        parameters.runTestSuite = parameter.slice(parameters.runTestSuite.length);
      }

      if (parameter.indexOf(parametersArgNames.runTestSuiteEnvt) !== -1) {
        parameters.runTestSuiteEnvt = parameter.slice(parametersArgNames.runTestSuiteEnvt.length);
        if (!parameters.runTestSuiteEnvt || possibleEnvironments.indexOf(parameters.runTestSuiteEnvt) === -1) {
          errors += `${errors.length ? '\n' : ''}Error while parsing environment for the test suite`;
        }
      }

      if (parameter.indexOf(parametersArgNames.skipDeployment) !== -1) {
        parameters.skipDeployment = parameter.slice(parameters.skipDeployment.length) !== 'false';
      }
    });

    if (errors.length) {
      throw new Error(errors);
    } else {
      return parameters;
    }
  }
};
