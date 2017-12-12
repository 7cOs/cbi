const circleCIClient = require('../lib/circle-ci-client');
const parametersUtils = require('../lib/trigger-ci-parameters-utils');

const parameters = parametersUtils.parse(process.argv);

if (parameters.project && parameters.project.length &&
  parameters.branchName && parameters.branchName.length &&
  parameters.token && parameters.token.length) {
    circleCIClient.buildBranch(parameters)
    .then((parsedBody) => {
      console.log('Build created with success!');
    })
    .catch((err) => {
      console.log('Error when creating the build');
      console.log(err);
    });
} else {
  console.log('Please provide valid arguments. Usage:');
  console.log('  node trigger-ci-build.js opt1:val1 opt2:val2 ...');
  console.log('Options:');
  console.log(`  ${parametersUtils.parametersArgNames.projectArgName}<repo/ci-project> [default: compass-portal]`);
  console.log(`  ${parametersUtils.parametersArgNames.branchArgName}<branch> [default: test]`);
  console.log(`  ${parametersUtils.parametersArgNames.tokenArgName}<ci-token> [default: process.env.CIRCLE_CI_API_TOKEN]`);
  console.log(`  ${parametersUtils.parametersArgNames.runTestSuiteArgName}<suite>`);
  console.log(`  ${parametersUtils.parametersArgNames.runTestSuiteEnvtArgName}<suite-environment> [default: qa] [possible values:[${parametersUtils.possibleEnvironments}]]`);
  console.log(`  ${parametersUtils.parametersArgNames.skipDeploymentArgName}<true|false> [default: true]`);
}
