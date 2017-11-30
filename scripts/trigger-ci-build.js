const rp = require('request-promise');

const projectArgName = 'project:';
const branchArgName = 'branch:';
const tokenArgName = 'token:';
const runTestSuiteArgName = 'runTestSuite:';
const skipDeploymentArgName = 'skipDeployment:';

const username = 'ConstellationBrands';

let project = 'compass-portal';
let branchName = 'test';
let token = process.env.CIRCLE_CI_API_TOKEN;
let runTestSuite = '';
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
    options.body.runTestSuite = runTestSuite;
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
    if (!project || !project) {
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

  if (value.indexOf(skipDeploymentArgName) !== -1) {
    skipDeployment = value.slice(skipDeploymentArgName.length);
  }
});

if (project && project.length &&
  branchName && branchName.length &&
  token && token.length &&
  skipDeployment !== undefined) {
    buildBranch(project, branchName, token, runTestSuite, skipDeployment);
} else {
  console.log('Please provide the arguments according to documentation.');
}
