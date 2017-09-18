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
public class US12828_TargetList_Create_and_Delete extends BaseSeleniumTestCase{

  @Test(retryAnalyzer = RetryAnalyzer.class, dataProvider = "createTargetListData", description = "Create a new Target List", priority = 1)
  public void us12828_AT_TargetList_Create_and_Delete(String name, String description,  String listname, String desc) {

	  		login = new Login(driver);
			homePage = login.loginWithValidCredentials(ACTOR1_USER_NAME, ACTOR1_PASSWORD);
			homePage.get();
			targetListPage = homePage.navigateToTargetListUsingURL();
			targetListPage.clickCreateNewListButton()
								.clickCreateNewListButtonInModal()
								.EnterNameTextBox(listname)
								.EnterDescriptionTextBox(desc)
								.clickSaveButton()
								.navigateToTargetList()
								.clickTargetList(listname)
								.clickManage()
								.clickDelete_TargetListPage()
								.clickYesDelete();

  }

	@DataProvider(name = "createTargetListData")
	public static Object[][] data1() {
		return new Object[][] { { "US12828", "Create and Delete Target List", "Test List","test"} };
	}


  @AfterMethod
  public void signOut() {
	  logout();
  }

}
