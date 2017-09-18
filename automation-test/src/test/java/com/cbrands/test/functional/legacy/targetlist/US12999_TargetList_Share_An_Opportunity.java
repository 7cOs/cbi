package com.cbrands.test.functional.legacy.targetlist;

import org.testng.annotations.Test;

import com.cbrands.BaseSeleniumTestCase;
import com.cbrands.helper.RetryAnalyzer;
import com.cbrands.pages.Login;

import static net.javacrumbs.hamcrest.logger.HamcrestLoggerMatcher.log;
import static org.hamcrest.CoreMatchers.containsString;
import static org.hamcrest.MatcherAssert.assertThat;

import org.testng.annotations.AfterMethod;
import org.testng.annotations.DataProvider;

/**
 * @deprecated Legacy functional test removed from the functional suite. No longer working due to login/logout being
 * wrong. Saved for reference only. Should be deleted as soon as there is a new test to replace it.
 */
@Deprecated
public class US12999_TargetList_Share_An_Opportunity extends BaseSeleniumTestCase{
  @Test(retryAnalyzer = RetryAnalyzer.class, dataProvider="shareOpportunityData", description="US12999: AT_Target List_Share An Opportunity",priority=1)
  public void us12999_AT_TargetList_Share_An_Opportunity(String targetListURL, String sendTo) {
	  login = new Login(driver);
		homePage = login.loginWithValidCredentials(ACTOR1_USER_NAME, ACTOR1_PASSWORD);
		homePage.get();
		targetListPage = homePage.navigateTargetList();
		targetListPage.openTargetListUsingURL(targetListURL)
					.clickExpandAll()
					.selectFirstRecord()
					.clickSendTo(sendTo);
		assertThat(targetListPage.getOpportunitySent(),log(containsString("Opportunity Sent!")));
  }

  @DataProvider(name = "shareOpportunityData")
  public static Object[][] data1() {
	  return new Object[][] { {"https://orion-qa.cbrands.com/target-lists/6c25e6dd-b819-47fe-92b2-2af4ba3cb864", "Stanley Rowley"} };
  }

  @AfterMethod
  public void signOut() {
	  logout();
  }

}
