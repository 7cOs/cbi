#!/bin/bash

GIT_ENVIRONMENT=$1

if [ ! $skipDeployment ] || ( [ $skipDeployment ] && ! $skipDeployment ) ; then
  echo Pushing $CIRCLE_SHA1 to $GIT_ENVIRONMENT
  git push git@heroku.com:$GIT_ENVIRONMENT $CIRCLE_SHA1:master -f
else
  echo Skipping Deployment to Heroku
fi
