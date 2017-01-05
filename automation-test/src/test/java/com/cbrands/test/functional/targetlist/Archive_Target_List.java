package com.cbrands.test.functional.targetlist; 

import org.testng.annotations.AfterMethod;
import org.testng.annotations.DataProvider;
import org.testng.annotations.Test;

import com.cbrands.BaseSeleniumTestCase;
import com.cbrands.pages.Login;

public class Archive_Target_List extends BaseSeleniumTestCase{
	
	
	
	@Test(dataProvider = "targetData", description = "Create a new Target List", priority = 1)
	public void archive_a_target_list(String name, String description,  String listname, String collaboratorname1, String collaboratorname2, String listname2) throws InterruptedException {
		
		login = new Login(driver);
		if(!login.isUserLoggedIn()) { 
			homePage = login.loginWithValidCredentials(ACTOR1_USER_NAME, ACTOR1_PASSWORD);
		}
				targetListPage = homePage.navigateTargetList();
				
				targetListPage.clickTargetListCheckBox(listname);
				targetListPage.clickArchiveButton();
				//Thread.sleep(10000);
				targetListPage.clickArchiveSpan();
				//Thread.sleep(10000);
				targetListPage.clickArchiveTargetList(listname2);
				targetListPage.clickSelectAll();
				targetListPage.clickDownloadButton();
				targetListPage.clickWith_RationaleButton();
				
				targetListPage.logOut();
				
			} 
	
	@DataProvider(name = "targetData")
	public static Object[][] data4() {
		return new Object[][] { { "US13025", "add collaborators to a Target List", "Automated Test Target List 2","eric.ramey@cbrands.com","stash.rowley@cbrands.com","Automated Test Target List 2" } };
	}
	

	@AfterMethod
	public void signOut() {
		logout();
	}
	
	

}
