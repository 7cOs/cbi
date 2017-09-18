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
public class US13025_TargetList_Archive extends BaseSeleniumTestCase{

  @Test(retryAnalyzer = RetryAnalyzer.class, dataProvider = "archiveTargetList", description = "Archive Target List", priority = 1)
  public void us13025_AT_TargetList_Archive(String listname) {
		login = new Login(driver);
		homePage = login.loginWithValidCredentials(ACTOR1_USER_NAME, ACTOR1_PASSWORD);
		homePage.get();
		targetListPage = homePage.navigateToTargetListUsingURL();
		targetListPage.clickCreateNewListButton()
							.clickCreateNewListButtonInModal()
							.EnterNameTextBox(listname)
							.clickSaveButton()
							.reloadPage()
							.clickTargetListCheckBox(listname)
							.clickArchiveButton();

  }

  @DataProvider(name = "archiveTargetList")
  public static Object[][] data1() {
	  return new Object[][] { {"Archive Test List"} };
  }

  @AfterMethod
  public void signOut() {
	  logout();
  }

}
