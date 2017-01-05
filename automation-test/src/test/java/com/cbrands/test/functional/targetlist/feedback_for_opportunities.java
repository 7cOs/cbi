package com.cbrands.test.functional.targetlist;


import org.testng.annotations.AfterMethod;
import org.testng.annotations.DataProvider;
import org.testng.annotations.Test;

import com.cbrands.BaseSeleniumTestCase;
import com.cbrands.pages.Login;


public class feedback_for_opportunities extends BaseSeleniumTestCase{
	

	@Test(dataProvider = "targetData", description = "Create a new Target List", priority = 1)
	public void Cannot_Dismiss_Targeted_Opportunities(String name, String description,  String listname, String desc,String distributorname, String listname2) throws InterruptedException {
		
		login = new Login(driver);
		if(!login.isUserLoggedIn()) { 
			homePage = login.loginWithValidCredentials(ACTOR1_USER_NAME, ACTOR1_PASSWORD);
		}
				targetListPage = homePage.navigateTargetList();
				Thread.sleep(10000);
				targetListPage.clickNewTargetList(listname2);
				
				targetListPage.clickfirst_store_opportunity();
				targetListPage.clickfirstOpportunity();
				targetListPage.clickActionButton();
				
				driver.navigate().refresh();
				targetListPage.navigateToOpportunities();
				targetListPage.clickMyAccountCheckBox();
				targetListPage.clickOffPremiseRadioButton();
				targetListPage.EnterDistributorTextBox(distributorname);
				targetListPage.clickOpportunityStatusCheckBox();
				targetListPage.clickDistributorSearchButton();
				
				targetListPage.clickDistributorName(distributorname);
				targetListPage.clickApplyFIlterButton();
				targetListPage.clickfirst_store_opportunity();
				targetListPage.clickfirstOpportunity();
				targetListPage.clickActionButton();
				
				
				targetListPage.logOut();
				
			} 
	
	
	@DataProvider(name = "targetData")
	public static Object[][] data4() {
		return new Object[][] { { "US13001", "feedback for opportunities", "Automated Test Target List","test","COASTAL BEV CO-NC (WILMINGTON)","Automated Test Target List 2" } };
	}
	
	
	@AfterMethod
	public void signOut() {
		logout();
	}
	
	

}
