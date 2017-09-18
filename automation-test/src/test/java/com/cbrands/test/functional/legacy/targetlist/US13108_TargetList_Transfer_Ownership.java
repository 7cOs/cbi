package com.cbrands.test.functional.legacy.targetlist;

import org.testng.annotations.Test;

import com.cbrands.BaseSeleniumTestCase;
import com.cbrands.helper.RetryAnalyzer;
import com.cbrands.pages.Login;

import static net.javacrumbs.hamcrest.logger.HamcrestLoggerMatcher.log;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.equalToIgnoringCase;

import org.testng.annotations.AfterMethod;
import org.testng.annotations.DataProvider;

/**
 * @deprecated Legacy functional test removed from the functional suite. No longer working due to login/logout being
 * wrong. Saved for reference only. Should be deleted as soon as there is a new test to replace it.
 */
@Deprecated
public class US13108_TargetList_Transfer_Ownership extends BaseSeleniumTestCase{

  @Test(retryAnalyzer = RetryAnalyzer.class,dataProvider="transferOwnershipData", priority=1)
  public void us13108_TargetList_Transfer_Ownership(String targetListURL) {
	  login = new Login(driver);
	  homePage = login.loginWithValidCredentials(ACTOR1_USER_NAME, ACTOR1_PASSWORD);
	  homePage.get();
	  targetListPage = homePage.navigateToTargetListUsingURL();
	  targetListPage.openTargetListUsingURL(targetListURL)
					.clickManage()
					.clickCollaborator()
					.makeOwner();
		assertThat(targetListPage.getmakeOwnerConfirmationToast(), log(((equalToIgnoringCase("This will cause you to lose editing rights.  Continue Transfer")))));
		targetListPage.clickContinueTransfer();
		logout();
		login = new Login(driver);
		homePage = login.loginWithValidCredentials(ACTOR2_USER_NAME, ACTOR2_PASSWORD);
		homePage.get();
		targetListPage = homePage.navigateToTargetListUsingURL();
		targetListPage.reloadPage()
					.openTargetListUsingURL(targetListURL)
					.reloadPage()
					.clickManage()
					.clickCollaborator()
					.makeOwner()
					.clickContinueTransfer();

  }

  @DataProvider(name = "transferOwnershipData")
  public static Object[][] data1() {
	  return new Object[][] { {"https://orion-qa.cbrands.com/target-lists/c1eca1a1-a461-4c69-b84b-a019abacda0e"} };
  }

  @AfterMethod
  public void signOut() {
	  logout();
  }

}
