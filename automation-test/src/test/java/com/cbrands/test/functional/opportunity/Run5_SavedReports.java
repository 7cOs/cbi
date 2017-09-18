package com.cbrands.test.functional.opportunity;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.DataProvider;
import org.testng.annotations.Test;
import org.testng.asserts.SoftAssert;

import com.cbrands.BaseSeleniumTestCase;
import com.cbrands.helper.RetryAnalyzer;
import com.cbrands.pages.Login;

/**
 * @deprecated Legacy functional test removed from the functional suite. No longer working due to login/logout being
 * wrong. Saved for reference only. Should be deleted as soon as there is a new test to replace it.
 */
@Deprecated
public class Run5_SavedReports extends BaseSeleniumTestCase{

	private SoftAssert softAssert = new SoftAssert();

	@Test(retryAnalyzer = RetryAnalyzer.class, dataProvider="AT_Opportunities_Run5_ViewSavedReports")
	public void US12708_AT_Opportunities_Run5_ViewSavedReports(String reportName){
		login = new Login(driver);
		if(!login.isUserLoggedIn()) {
			homePage = login.loginWithValidCredentials(ACTOR1_USER_NAME, ACTOR1_PASSWORD);
		}
		softAssert.assertTrue(homePage.verifyPresenceofSavedReport(homePage.getListForSaveReport(), reportName),"Saved report not displaying in the Home Page");
		homePage.pageRefresh();
		opportunitiesPage = homePage.navigateOpportunities();
		softAssert.assertTrue(opportunitiesPage.verifyPresenceofSavedReport(opportunitiesPage.getListForSaveReport(), reportName),"Saved report not displaying in the Opportunities Page");
		softAssert.assertAll();
	}

	@DataProvider(name="AT_Opportunities_Run5_ViewSavedReports")
	public static Object[][] data1(){
		return new Object[][]{{"DO NOT DELETE - Report for Run 5 Automated Testing"}};
	}

	@AfterMethod
	public void signOut() {
		logout();
	}
}
