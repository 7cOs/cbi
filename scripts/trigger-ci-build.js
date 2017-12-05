const rp = require('request-promise');

const projectArgName = 'project:';
const branchArgName = 'branch:';
const tokenArgName = 'token:';
const runTestSuiteArgName = 'runTestSuite:';
const runTestSuiteEnvtArgName = 'runTestSuiteEnvt:';
const skipDeploymentArgName = 'skipDeployment:';

const username = 'ConstellationBrands';
const possibleEnvironments = ['qa'];

let project = 'compass-portal';
let branchName = 'test';
let token = process.env.CIRCLE_CI_API_TOKEN;
let runTestSuite = '';
let runTestSuiteEnvt = 'qa';
let skipDeployment = true;

function buildBranch(project, branchName, token, runTestSuite, skipDeployment) {
  const url = `https://circleci.com/api/v1.1/project/github/${username}/${project}/tree/${encodeURIComponent(branchName)}?circle-token=${token}`;
  const options = {
    method: 'POST',
    uri: url,
    body: {
      build_parameters: {
        skipDeployment: skipDeployment
      }
    },
    json: true
  };

  if (runTestSuite) {
    options.body.build_parameters.runTestSuite = runTestSuite;
  }

  if (runTestSuiteEnvt) {
    options.body.build_parameters.runTestSuiteEnvt = runTestSuiteEnvt;
  }

  rp(options)
    .then((parsedBody) => {
        console.log('Build created with success!');
        console.log(parsedBody);
      })
      .catch((err) => {
        console.log('error');
        console.log(err);
    });

}

process.argv.forEach((value, index, array) => {
  if (value.indexOf(projectArgName) !== -1) {
    project = value.slice(projectArgName.length);
    if (!project || !project.length) {
      console.log('Please enter a valid project');
    }
  }

  if (value.indexOf(branchArgName) !== -1) {
    branchName = value.slice(branchArgName.length);
    if (!branchName || !branchName.length) {
      console.log('Please enter a valid branch name');
    }
  }

  if (value.indexOf(tokenArgName) !== -1) {
    token = value.slice(tokenArgName.length);
    if (!token || !token.length) {
      console.log('Please enter a valid token');
    }
  }

  if (value.indexOf(runTestSuiteArgName) !== -1) {
    runTestSuite = value.slice(runTestSuiteArgName.length);
  }

  if (value.indexOf(runTestSuiteEnvtArgName) !== -1) {
    runTestSuiteEnvt = value.slice(runTestSuiteEnvtArgName.length);
    if (!runTestSuiteEnvt || !token.runTestSuiteEnvt || possibleEnvironments.indexOf(runTestSuiteEnvt) === -1) {
      console.log('Please enter a valid environment for the test suite');
    }
  }

  if (value.indexOf(skipDeploymentArgName) !== -1) {
    skipDeployment = value.slice(skipDeploymentArgName.length) !== 'false';
  }
});

if (project && project.length &&
  branchName && branchName.length &&
  token && token.length) {
    buildBranch(project, branchName, token, runTestSuite, skipDeployment);
} else {
  console.log('Please provide valid arguments. Usage:');
  console.log('  node trigger-ci-build.js opt1:val1 opt2:val2 ...');
  console.log('Options:');
  console.log(`  ${projectArgName}<repo/ci-project> [default: compass-portal]`);
  console.log(`  ${branchArgName}<branch> [default: test]`);
  console.log(`  ${tokenArgName}<ci-token> [default: process.env.CIRCLE_CI_API_TOKEN]`);
  console.log(`  ${runTestSuiteArgName}<suite>`);
  console.log(`  ${runTestSuiteEnvtArgName}<suite-environment> [default: qa] [possible values:[${possibleEnvironments}]]`);
  console.log(`  ${skipDeploymentArgName}<true|false> [default: true]`);
}
