package com.cbrands.listener;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.testng.ITestResult;
import org.testng.TestListenerAdapter;

import com.cbrands.helper.SeleniumUtils;

/**
 * 
 * @author Kazi Hossain
 *
 */
public class SeleniumSnapshotRule extends TestListenerAdapter {
	private Log log = LogFactory.getLog(SeleniumSnapshotRule.class);

	@Override
	public void onTestFailure(ITestResult tr) {
		String basePath = "target/screenshot/";
		String outputFileName = tr.getMethod().getMethodName() + ".png";
		SeleniumUtils.snapshot(basePath, outputFileName);
		log.info("*****************************************************");
		log.info("TEST FAILED: " + tr.getMethod().getMethodName() + "!!");
		log.info("*****************************************************");
	}

	@Override
	public void onTestSuccess(ITestResult tr) {
		log.info("TEST PASSED: " + tr.getMethod().getMethodName());
	}
}
