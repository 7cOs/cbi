package com.cbrands.test.functional.targetlist;

import org.testng.annotations.Test;

import com.cbrands.BaseSeleniumTestCase;
import com.cbrands.helper.RetryAnalyzer;
import com.cbrands.pages.Login;

import org.testng.annotations.AfterMethod;
import org.testng.annotations.DataProvider;

/**
 * @deprecated Legacy functional test removed from the functional suite. No longer working due to login/logout being
 * wrong. Saved for reference only. Should be deleted as soon as there is a new test to replace it.
 */
@Deprecated
public class US13001_TargetList_Cannot_Dismiss_Targeted_Opportunities extends BaseSeleniumTestCase{

  @Test(retryAnalyzer = RetryAnalyzer.class, dataProvider = "cannotDismissTargetedOpportunitiesData", description = "Cannot Dismiss TargetedOpportunities", priority = 1)
  public void us13001_AT_TargetList_CannotDismissTargetedOpportunities(String targetListURL, String chain) {
	  login = new Login(driver);
	  homePage = login.loginWithValidCredentials(ACTOR1_USER_NAME, ACTOR1_PASSWORD);
	  homePage.get();
	  targetListPage = homePage.navigateToTargetListUsingURL();
	  targetListPage.openTargetListUsingURL(targetListURL)
					.clickfirst_store_opportunity()
					.clickfirstOpportunity()
					.clickActionButton();
	  opportunitiesPage = targetListPage.navigateToOpportunities();
	  opportunitiesPage.searchRetailerChainByName(chain)
	  					.selectTargetedOpportunityStatus()
	  					.clickApplyFilters()
						.clickfirst_store_opportunity()
						.clickfirstOpportunity()
						.clickActionButton();;
  }

  @DataProvider(name = "cannotDismissTargetedOpportunitiesData")
  public static Object[][] data1() {
	  return new Object[][] { {"https://orion-qa.cbrands.com/target-lists/6c25e6dd-b819-47fe-92b2-2af4ba3cb864","Walmart"} };
  }

  @AfterMethod
  public void signOut() {
	  logout();
  }

}
