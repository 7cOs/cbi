package com.cbrands.test.functional.targetlist;

import org.testng.annotations.AfterMethod;
import org.testng.annotations.DataProvider;
import org.testng.annotations.Test;

import com.cbrands.BaseSeleniumTestCase;
import com.cbrands.RetryAnalyzer;
import com.cbrands.pages.Login;

public class CreateTargetList extends BaseSeleniumTestCase{
	
	
	
	@Test(enabled=false, dataProvider = "targetData", description = "Create a new Target List", priority = 1)
	public void createTargetListNew(String name, String description,  String listname, String desc,String chainname, String listname2) throws InterruptedException {
		
		login = new Login(driver);
		if(!login.isUserLoggedIn()) { 
			homePage = login.loginWithValidCredentials(ACTOR1_USER_NAME, ACTOR1_PASSWORD);
		}
				targetListPage = homePage.navigateTargetList();
				targetListPage.clickCreateNewList();
				targetListPage.clickCreateNewListModal();
				targetListPage.EnterNameTextBox(listname);
				targetListPage.EnterDescriptionTextBox(desc);
				targetListPage.clickSaveButton();
				
				targetListPage.clickNewTargetList(listname);
				
				targetListPage = homePage.navigateTargetList();
				targetListPage.clickCreateNewList();
				targetListPage.clickSearchOpportunityButton();
				targetListPage.clickOnPremiseRadioButton();
				targetListPage.EnterAccountsSubnameTextBox(chainname);
				targetListPage.clickSearchButton();
				
				targetListPage.clickChainName(chainname);
				targetListPage.clickApplyFIlterButton();
				
				targetListPage.clickfirst_store_opportunity();
				
				targetListPage.clickfirstOpportunity();
				
				targetListPage.clickAddToTargetListButton();
				
				targetListPage.clickCreatNewListButton();
				
				targetListPage.EnterNameTextBox(listname2);
				
				targetListPage.clickSaveButton();
				targetListPage = homePage.navigateTargetList();
			} 
	public void searchTargetList(String targetListName){
		System.out.println("Inside here");
		targetListPage.getTargetList(targetListName);
	}
	
	@DataProvider(name = "targetData")
	public static Object[][] data4() {
		return new Object[][] { { "US12828", "Create New Target List test", "Automated Test Target List","test","Real Mex ","Automated Test Target List 2" } };
	}
	
	@Test(retryAnalyzer = RetryAnalyzer.class)
	public void AT_TargetListCollaboratorAccess() {
		login = new Login(driver);
		if (!login.isUserLoggedIn()) {
			login = new Login(driver);
			homePage = login.loginWithValidCredentials(ACTOR2_USER_NAME, ACTOR2_PASSWORD);

			targetListPage = homePage.clickSharedWithMeLink().navigateTargetList();

			homePage = targetListPage.clickSharedWithMeLink().clickFirstRecord().clickBackToTargetList().clickSharedWithMeLink().navigateToHomePage();

			//homePage.clickSharedWithMeLink();

		}
	}
	
	@AfterMethod
	public void signOut() {
		logout();
	}
}
