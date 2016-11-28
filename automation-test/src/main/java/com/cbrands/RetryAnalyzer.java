package com.cbrands;

import java.util.concurrent.atomic.AtomicInteger;

import org.testng.IRetryAnalyzer;
import org.testng.ITestResult;

public class RetryAnalyzer implements IRetryAnalyzer{
	private AtomicInteger count = new AtomicInteger(3);

	@Override
	public boolean retry(ITestResult result) {
		if (0 < count.getAndDecrement()) {
			return true;
		}
		return false;
	}
}
