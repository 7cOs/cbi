package com.cbrands.legacy.test.functional.targetlist;

import org.testng.annotations.Test;

import com.cbrands.legacy.BaseSeleniumTestCase;
import com.cbrands.helper.RetryAnalyzer;
import com.cbrands.legacy.pages.Login;

import org.testng.annotations.AfterMethod;
import org.testng.annotations.DataProvider;

/**
 * @deprecated Legacy functional test removed from the functional suite. No longer working due to login/logout being
 * wrong. Saved for reference only. Should be deleted as soon as there is a new test to replace it.
 */
@Deprecated
public class US12829_TargetList_Add_Remove_Opportunities extends BaseSeleniumTestCase{
  @Test(retryAnalyzer = RetryAnalyzer.class, dataProvider="addRemoveOpportunitiesData", priority=1)
  public void us12829_AT_TargetList_Add_Remove_Opportunities(String chain, String targetListName, String targetListURL) {
	  login = new Login(driver);
	  homePage = login.loginWithValidCredentials(ACTOR1_USER_NAME, ACTOR1_PASSWORD);
	  homePage.get();
	  opportunitiesPage = homePage.navigateToOpportunitiesPageUsingURL();
		opportunitiesPage.searchRetailerChainByName(chain)
						.clickApplyFilters()
						.clickOpportunitySearchFirstResult()
						.clickExpandAllButton()
						.selectFirstStore()
						.clickAddToTargetListButton()
						.selectDropdownFromTargetList(targetListName)
						.reloadPage();
		targetListPage = opportunitiesPage.navigateToTargetList();
		targetListPage.openTargetListUsingURL(targetListURL)
					.selectFirstOpportunity()
					.deleteOpportunity()
					.openTargetListUsingURL(targetListURL);
  }


  @DataProvider(name = "addRemoveOpportunitiesData")
  public static Object[][] data1() {
	  return new Object[][] { {"Walmart","Automated Test Target List–DO NOT DELETE","https://orion-qa.cbrands.com/target-lists/edc59c4a-c47b-43ea-b88f-fb85b970ac5e"} };
  }

  @AfterMethod
  public void signOut() {
	  logout();
  }

}
