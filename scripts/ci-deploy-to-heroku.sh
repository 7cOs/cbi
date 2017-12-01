#!/bin/bash

HEROKU_GIT_INSTANCE=$1

if [ ! $skipDeployment ] || ( [ $skipDeployment ] && ! $skipDeployment ) ; then
  echo PUSHING $CIRCLE_SHA1 TO HEROKU INSTANCE $HEROKU_GIT_INSTANCE
  git push git@heroku.com:$HEROKU_GIT_INSTANCE $CIRCLE_SHA1:master -f
else
  echo SKIPPING DEPLOYMENT TO HEROKU
fi
