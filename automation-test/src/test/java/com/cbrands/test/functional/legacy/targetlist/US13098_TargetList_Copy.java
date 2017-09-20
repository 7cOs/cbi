package com.cbrands.test.functional.legacy.targetlist;

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
public class US13098_TargetList_Copy extends BaseSeleniumTestCase{

  @Test(retryAnalyzer = RetryAnalyzer.class, dataProvider="targetListCopyData", priority=1)
  public void us13098_TargetList_Copy(String listName, String targetListURL) {
	  login = new Login(driver);
	  homePage = login.loginWithValidCredentials(ACTOR1_USER_NAME, ACTOR1_PASSWORD);
	  homePage.get();
	  targetListPage = homePage.navigateTargetList();
	  targetListPage.clickCreateNewListButton()
					.clickCreateNewListButtonInModal()
					.EnterNameTextBox(listName)
					.clickSaveButton()
					.openTargetListUsingURL(targetListURL)
					.clickfirst_store_opportunity()
					.selectFirstRecord()
					.copyToTargetList(listName)
	  				.navigateToTargetList()
	  				.clickTargetList(listName)
	  				.clickfirst_store_opportunity()
	  				.clickManageButton()
	  				.clickDelete_TargetListPage()
	  				.clickYesDelete();

  }

  @DataProvider(name = "targetListCopyData")
  public static Object[][] data1() {
	  return new Object[][] {{"Target List Copy","https://orion-qa.cbrands.com/target-lists/6c25e6dd-b819-47fe-92b2-2af4ba3cb864"}};
  }

  @AfterMethod
  public void signOut() {
	  logout();
  }

}
