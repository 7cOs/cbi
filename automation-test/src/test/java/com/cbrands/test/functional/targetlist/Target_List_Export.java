package com.cbrands.test.functional.targetlist; 

import org.testng.annotations.AfterMethod;
import org.testng.annotations.DataProvider;
import org.testng.annotations.Test;

import com.cbrands.BaseSeleniumTestCase;
import com.cbrands.pages.Login;

public class Target_List_Export extends BaseSeleniumTestCase{
	
	
	
	@Test(dataProvider = "targetData", description = "Create a new Target List", priority = 1)
	public void Target_List_Export(String name, String description,  String listname, String collaboratorname1, String collaboratorname2, String listname2) throws InterruptedException {
		
		login = new Login(driver);
		if(!login.isUserLoggedIn()) { 
			homePage = login.loginWithValidCredentials(ACTOR1_USER_NAME, ACTOR1_PASSWORD);
		}
				targetListPage = homePage.navigateTargetList();
				
				targetListPage.clickNewTargetList(listname2);
				targetListPage.clickSelectAll();
				targetListPage.clickDownloadButton();
				targetListPage.clickWith_RationaleButton();
				targetListPage.clickSelectAll();
				targetListPage.selectFirstOpportunity();
				targetListPage.clickDownloadButton();
				targetListPage.clickWithout_RationaleButton();
				
				
				targetListPage.logOut();
				
			} 
	
	
	@DataProvider(name = "targetData")
	public static Object[][] data4() {
		return new Object[][] { { "US13024", "add collaborators to a Target List", "Automated Test Target List","eric.ramey@cbrands.com","stash.rowley@cbrands.com","Automated Test Target List 2" } };
	}
	
	@AfterMethod
	public void signOut() {
		logout();
	}
	
	
	
	

}
