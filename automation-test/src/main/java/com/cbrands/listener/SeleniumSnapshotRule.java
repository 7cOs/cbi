package com.cbrands.listener;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.testng.ITestResult;
import org.testng.TestListenerAdapter;

import com.cbrands.helper.SeleniumUtils;

/**
 * @author Kazi Hossain
 */
public class SeleniumSnapshotRule extends TestListenerAdapter {
  private static final String SCREENSHOTS_PATH = "surefire-reports/screenshots/";

  private Log log = LogFactory.getLog(SeleniumSnapshotRule.class);

  @Override
  public void onTestFailure(ITestResult failedTest) {
    final String failedMethod = failedTest.getMethod().getMethodName();

    SeleniumUtils.snapshot(SCREENSHOTS_PATH, getScreenshotNameFor(failedMethod));
    log.info("*****************************************************");
    log.info(String.format("TEST FAILED: %s!!", failedMethod));
    log.info("*****************************************************");
  }

  @Override
  public void onTestSuccess(ITestResult passedTest) {
    log.info(String.format("TEST PASSED: %s", passedTest.getMethod().getMethodName()));
  }

  private String getScreenshotNameFor(String failedMethodName) {
    final String browserPrefix = System.getProperty("browser");
    return browserPrefix != null ?
      String.format("%s_%s.png", browserPrefix, failedMethodName) :
      String.format("%s.png", failedMethodName);
  }

}
