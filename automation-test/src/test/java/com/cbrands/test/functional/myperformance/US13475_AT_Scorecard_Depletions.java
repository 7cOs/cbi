package com.cbrands.test.functional.myperformance;

import static net.javacrumbs.hamcrest.logger.HamcrestLoggerMatcher.log;
import static org.hamcrest.CoreMatchers.containsString;
import static org.hamcrest.MatcherAssert.assertThat;

import org.testng.annotations.Test;

import com.cbrands.BaseSeleniumTestCase;
import com.cbrands.helper.RetryAnalyzer;
import com.cbrands.pages.Login;

/**
 * @deprecated Legacy functional test removed from the functional suite. No longer working due to login/logout being
 * wrong. Saved for reference only. Should be deleted as soon as there is a new test to replace it.
 */
@Deprecated
public class US13475_AT_Scorecard_Depletions extends BaseSeleniumTestCase{

	@Test(retryAnalyzer = RetryAnalyzer.class)
	public void US13475_AT_Scorecard_Depletions() {
		login = new Login(driver);
		if(!login.isUserLoggedIn()) {
			homePage = login.loginWithValidCredentials(ACTOR1_USER_NAME, ACTOR1_PASSWORD);
		}
		myScorecards = homePage.navigateToMyScoreCards();

		String allText = getAllTextFromPage();
		assertThat(allText, log(containsString("TOTAL DEPLETIONS / VS YA %")));
	}
}
