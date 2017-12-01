#!/bin/bash

TEST_SUITE=$1

cd automation-test

if [[ -z "${TEST_SUITE}" ]]; then
  echo NO TEST SUITE SPECIFIED - SKIPPING AT EXECUTION
  exit -1
else
  echo INSTALLING MAVEN DEPENDENCIES FOR AT SUITE RUN
  mvn install -DskipTests=true
fi

if [ "$TEST_SUITE" == "smoke-test" ] ; then
  echo RUNNING SMOKE TEST SUITE FOR IE AND CHROME
  mvn test -P smoke-test -DargLine="-Denv=qa -Dbrowser=ie"
  mvn test -P smoke-test -DargLine="-Denv=qa -Dbrowser=chrome"
elif [ "$TEST_SUITE" == "functional-test" ] ; then
  echo RUNNING FUNCTIONAL TEST SUITE FOR CHROME
  mvn test -P functional-test -DargLine="-Denv=qa -Dbrowser=chrome"
else
  echo UNRECOGNIZED TEST SUITE SPECIFIED - SKIPPING AT EXECUTION
fi
