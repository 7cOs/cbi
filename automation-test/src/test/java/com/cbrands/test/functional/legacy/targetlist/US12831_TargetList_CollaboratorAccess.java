package com.cbrands.test.functional.legacy.targetlist;

import org.testng.annotations.Test;

import com.cbrands.BaseSeleniumTestCase;
import com.cbrands.helper.RetryAnalyzer;
import com.cbrands.pages.Login;

import org.testng.Assert;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.DataProvider;

/**
 * @deprecated Legacy functional test removed from the functional suite. No longer working due to login/logout being
 * wrong. Saved for reference only. Should be deleted as soon as there is a new test to replace it.
 */
@Deprecated
public class US12831_TargetList_CollaboratorAccess extends BaseSeleniumTestCase{

  @Test(retryAnalyzer = RetryAnalyzer.class, dataProvider = "collaboratorAccessData", priority = 1)
  public void us12831_TargetList_CollaboratorAccess(String listName) {
	  login = new Login(driver);
		homePage = login.loginWithValidCredentials(ACTOR2_USER_NAME, ACTOR2_PASSWORD);
		homePage.get()
				.clickSharedWithMeLink();
		Assert.assertEquals(homePage.sharedTargetList(listName), listName);
		targetListPage = homePage.navigateToTargetListUsingURL();
		targetListPage.clickSharedWithMeLink();
		Assert.assertEquals(targetListPage.sharedTargetList(listName), listName);
  }

  @DataProvider(name = "collaboratorAccessData")
  public static Object[][] data1() {
	  return new Object[][] { {"Collaborator Access Test – DO NOT DELETE"} };
  }

  @AfterMethod
  public void signOut() {
	  logout();
  }
}
