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
public class US12830_TargetList_Add_and_Remove_Collaborators extends BaseSeleniumTestCase{

  @Test(retryAnalyzer = RetryAnalyzer.class, dataProvider = "addRemoveCollaboratorData", description = "Add and remove Colaborators from Target List", priority = 1)
  public void us12830_AT_TargetList_Add_and_Remove_Collaborators(String targetListURL, String collaboratorName) {
	  login = new Login(driver);
	  homePage = login.loginWithValidCredentials(ACTOR1_USER_NAME, ACTOR1_PASSWORD);
	  homePage.get();
	  targetListPage = homePage.navigateToTargetListUsingURL();
	  targetListPage.openTargetListUsingURL(targetListURL)
	  				.clickManageButton()
	  				.EnterCollaboratorNameTextBox(collaboratorName)
	  				.clickSearchButton()
	  				.clickCollaboratorList(collaboratorName)
	  				.clickSaveCollaboratorButton()
	  				.navigateToTargetList()
	  				.openTargetListUsingURL(targetListURL)
	  				.clickManage()
					.clickCollaborator()
					.removeCollaborator()
					.clickSaveCollaboratorButton();
  }

  @DataProvider(name = "addRemoveCollaboratorData")
  public static Object[][] data1() {
	  return new Object[][] { {"https://orion-qa.cbrands.com/target-lists/61616883-1c0e-496c-982c-568e19a14085","eric.ramey@cbrands.com"} };
  }

  @AfterMethod
  public void signOut() {
	  logout();
  }

}
