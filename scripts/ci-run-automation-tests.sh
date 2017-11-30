#!/bin/bash

TEST_SUITE=$1

cd automation-test
mvn install -DskipTests=true

if [ $runTestSuite ] ; then
  echo Running specified test suite $TEST_SUITE
  mvn test -P $TEST_SUITE -DargLine="-Denv=qa -Dbrowser=ie"
  mvn test -P $TEST_SUITE -DargLine="-Denv=qa -Dbrowser=chrome"
else
  echo Running default test suite
  mvn test -DargLine="-Denv=qa -Dbrowser=ie"
  mvn test -DargLine="-Denv=qa -Dbrowser=chrome"
fi
