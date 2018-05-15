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
public class US13024_TargetList_Export extends BaseSeleniumTestCase{

  @Test(retryAnalyzer = RetryAnalyzer.class,dataProvider="targetListExportData", priority=1)
  public void us13024_TargetList_Export(String targetListURL) {
	  login = new Login(driver);
	  homePage = login.loginWithValidCredentials(ACTOR1_USER_NAME, ACTOR1_PASSWORD);
	  homePage.get();
	  targetListPage = homePage.navigateToTargetListUsingURL();
	  targetListPage.openTargetListUsingURL(targetListURL)
					.clickSelectAll()
					.clickDownloadButton()
					.clickWith_RationaleButton();
  }

  @DataProvider(name = "targetListExportData")
  public static Object[][] data1() {
	  return new Object[][] { {"https://orion-qa.cbrands.com/target-lists/6c25e6dd-b819-47fe-92b2-2af4ba3cb864"} };
  }

  @AfterMethod
  public void signOut() {
	  logout();
  }

}
