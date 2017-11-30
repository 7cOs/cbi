#!/bin/bash

cd automation-test

if [ $runTestSuite ] ; then
  mvn test -P $runTestSuite -DargLine="-Denv=qa -Dbrowser=ie"
  mvn test -P $runTestSuite -DargLine="-Denv=qa -Dbrowser=chrome"
else
  mvn test -DargLine="-Denv=qa -Dbrowser=ie"
  mvn test -DargLine="-Denv=qa -Dbrowser=chrome"
fi
