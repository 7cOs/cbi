package com.cbrands.test.functional.myperformance;

import org.testng.annotations.Test;

import com.cbrands.BaseSeleniumTestCase;
import com.cbrands.helper.RetryAnalyzer;
import com.cbrands.pages.Login;

import org.testng.Assert;
import org.testng.annotations.AfterMethod;

/**
 * @deprecated Legacy functional test removed from the functional suite. No longer working due to login/logout being
 * wrong. Saved for reference only. Should be deleted as soon as there is a new test to replace it.
 */
@Deprecated
public class US13476_Scorecard_TimePeriodOptions extends BaseSeleniumTestCase{

	@Test(retryAnalyzer = RetryAnalyzer.class)
	public void us13476_AT_Scorecard_TimePeriodOptions() {
		login = new Login(driver);
		if(!login.isUserLoggedIn()) {
			homePage = login.loginWithValidCredentials(ACTOR1_USER_NAME, ACTOR1_PASSWORD);
		}
		myScorecards = homePage.navigateToMyScoreCards();
		Assert.assertEquals(myScorecards.depletionsTimePeriodValue(), "FYTD", "The default value of Depletions Time Period drop down is not 'FYTD'");
		Assert.assertEquals(myScorecards.depletionsScorecardTableLabel(),"FYTD", "The Depletions Scorecard Table label is incorrect");
		myScorecards.selectDepletionsTimePeriod("CYTD");
		Assert.assertEquals(myScorecards.depletionsScorecardTableLabel(),"CYTD", "The Depletions Scorecard Table label is incorrect");
		myScorecards.selectDepletionsTimePeriod("MTD");
		Assert.assertEquals(myScorecards.depletionsScorecardTableLabel(),"MTD", "The Depletions Scorecard Table label is incorrect");
		Assert.assertEquals(myScorecards.distributionTimePeriodValue(), "L90 Days", "The default value of Distribution Time Period drop down is not 'L90'");
		myScorecards.selectDistributionTimePeriod("L90");
		Assert.assertEquals(myScorecards.distributionScorecardTableLabel(),"L90 Days", "The Distribution Scorecard Table label is incorrect");
		myScorecards.selectLastClosedMonth();
		Assert.assertEquals(myScorecards.depletionsTimePeriodValue(), "FYTM", "The default value of Depletions Time Period drop down is not 'FYTM'");
		Assert.assertEquals(myScorecards.depletionsScorecardTableLabel(),"FYTM", "The Depletions Scorecard Table label is incorrect");
		myScorecards.selectDepletionsTimePeriod("CMTH");
		Assert.assertEquals(myScorecards.depletionsScorecardTableLabel(),"Clo Mth", "The Depletions Scorecard Table label is incorrect");
		myScorecards.selectDepletionsTimePeriod("CYTM");
		Assert.assertEquals(myScorecards.depletionsScorecardTableLabel(),"CYTM", "The Depletions Scorecard Table label is incorrect");
		Assert.assertEquals(myScorecards.distributionTimePeriodValue(), "L03 Mth", "The default value of Distribution Time Period drop down is not 'L03'");
		myScorecards.selectDistributionTimePeriod("L03");
		Assert.assertEquals(myScorecards.distributionScorecardTableLabelTextL03(),"L03 Mth", "The Distribution Scorecard Table label is incorrect");

	}


	@AfterMethod
	public void signOut() {
		logout();
	}

}
