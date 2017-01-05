package com.cbrands.helper;

import java.util.concurrent.atomic.AtomicInteger;

import org.testng.IRetryAnalyzer;
import org.testng.ITestResult;

/**
 * The Class RetryAnalyzer.
 */
public class RetryAnalyzer implements IRetryAnalyzer{
	
	/** The count. */
	private AtomicInteger count = new AtomicInteger(3);

	/* (non-Javadoc)
	 * @see org.testng.IRetryAnalyzer#retry(org.testng.ITestResult)
	 */
	@Override
	public boolean retry(ITestResult result) {
		if (0 < count.getAndDecrement()) {
			return true;
		}
		return false;
	}
}
