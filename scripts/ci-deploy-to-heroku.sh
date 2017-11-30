#!/bin/bash

GIT_ENVIRONMENT=$1

if [ ! $skipDeployment ] || ( [ $skipDeployment ] && ! $skipDeployment ) ; then
  echo $CIRCLE_SHA1
  git push git@heroku.com:$GIT_ENVIRONMENT $CIRCLE_SHA1:master -f
fi
