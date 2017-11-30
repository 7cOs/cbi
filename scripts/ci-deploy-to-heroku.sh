#!/bin/bash

HEROKU_GIT_INSTANCE=$1

if [ ! $skipDeployment ] || ( [ $skipDeployment ] && ! $skipDeployment ) ; then
  echo Pushing $CIRCLE_SHA1 to HEROKU_GIT_INSTANCE
  git push git@heroku.com:HEROKU_GIT_INSTANCE $CIRCLE_SHA1:master -f
else
  echo Skipping Deployment to Heroku
fi
