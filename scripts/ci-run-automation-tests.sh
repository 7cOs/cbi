#!/bin/bash

# default to smoke-test suite
TEST_SUITE=${1:-smoke-test}

cd automation-test

echo INSTALLING MAVEN DEPENDENCIES FOR AT SUITE RUN
mvn install -DskipTests=true

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
