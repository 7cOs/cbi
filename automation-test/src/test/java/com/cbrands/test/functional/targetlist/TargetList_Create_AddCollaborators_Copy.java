package com.cbrands.test.functional.targetlist;

import org.testng.annotations.AfterMethod;
import org.testng.annotations.DataProvider;
import org.testng.annotations.Test;

import com.cbrands.BaseSeleniumTestCase;
import com.cbrands.pages.Login;

public class TargetList_Create_AddCollaborators_Copy extends BaseSeleniumTestCase{

	@Test(dataProvider = "createTargetListData", description = "Create a new Target List", priority = 1)
	public void US12828_AT_TargetList_Creation(String name, String description,  String listname, String desc,String chainname, String listname2) throws InterruptedException {
		
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
				targetListPage.EnterAccountsSubnameTextBox(chainname);
				targetListPage.clickSearchButton();				
				targetListPage.clickChainName(chainname);
				targetListPage.clickApplyFIlterButton();				
				targetListPage.clickfirst_store_opportunity();				
				targetListPage.clickfirstOpportunity();
				targetListPage.clickSecondOpportunity();				
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
	
	@Test(dependsOnMethods = "US12828_AT_TargetList_Creation",dataProvider = "addCollaboratorData", description = "Add Colaborators to Target List", priority = 2)
	public void US12830_AT_TargetList_AddCollaboratorsToTargetList(String name, String description,  String listname, String collaboratorname1, String collaboratorname2, String listname2) throws InterruptedException {
		
		login = new Login(driver);
		if(!login.isUserLoggedIn()) { 
			homePage = login.loginWithValidCredentials(ACTOR1_USER_NAME, ACTOR1_PASSWORD);
		}
				targetListPage = homePage.navigateTargetList();
				
				targetListPage.clickNewTargetList(listname);
			
				targetListPage.clickManageButton();
	
				targetListPage.EnterCollaboratorNameTextBox(collaboratorname1);
				
				targetListPage.clickSearchButton();
				
				targetListPage.clickCollaboratorList(collaboratorname1);
		
				targetListPage.EnterCollaboratorNameTextBox(collaboratorname2);

				targetListPage.clickSearchButton();

				targetListPage.clickCollaboratorList(collaboratorname2);
			
				targetListPage.clickSaveCollaboratorButton();
				
				targetListPage = homePage.navigateTargetList();
				
				targetListPage.clickNewTargetList(listname2);
				
				targetListPage.maximizeWindow();
			
				targetListPage.clickManageButton();
			
				targetListPage.EnterCollaboratorNameTextBox(collaboratorname2);
					
				targetListPage.clickSearchButton();
		
				targetListPage.clickCollaboratorList(collaboratorname2);
			
				targetListPage.clickAllowCollaboratorCheckBox();
				targetListPage.clickSaveCollaboratorButton();
				targetListPage.logOut();
				
			} 
	
	  @Test(dependsOnMethods = "US12830_AT_TargetList_AddCollaboratorsToTargetList",description = "Copy Opportunities to Target List", priority = 3)
	  public void US13098_AT_TargetList_Copy() {
		  login = new Login(driver);
		  if(!login.isUserLoggedIn()) { 
				homePage = login.loginWithValidCredentials(ACTOR1_USER_NAME, ACTOR1_PASSWORD);
		  }
		  targetListPage = homePage.navigateTargetList();
		  targetListPage.clickTargetList("Automated Test Target List 2");
		  String targetListURL = targetListPage.getTargetListURL();
		  targetListPage.clickfirst_store_opportunity();
		  targetListPage.clickfirstOpportunity();
		  targetListPage.copyToTargetList("Automated Test Target List");
		  targetListPage.navigateBackToTargetLists();
		  //targetListPage.navigateToTargetLists();
		  targetListPage.clickTargetListDuplicate("Automated Test Target List");
		  targetListPage.clickfirst_store_opportunity();
		  
		  logout();
		  homePage = login.loginWithValidCredentials(ACTOR2_USER_NAME, ACTOR2_PASSWORD);
		  targetListPage = homePage.navigateTargetList();
		  targetListPage.clickCreateNewList();
		  targetListPage.clickCreateNewListModal();
		  targetListPage.EnterNameTextBox("Target List Copy");
		  targetListPage.clickSaveButton();
		  targetListPage.clickSharedWithMeLink();
		  targetListPage.openTargetListUsingURL(targetListURL);
		  targetListPage.clickfirst_store_opportunity();
		  targetListPage.clickSecondOpportunity();
		  targetListPage.copyToTargetList("Target List Copy");
		  targetListPage.navigateBackToTargetLists();
		  targetListPage.clickTargetList("Target List Copy");
		  targetListPage.clickfirst_store_opportunity();
		  targetListPage.clickManageButton();
		  targetListPage.clickDelete_TargetListPage();
		  targetListPage.clickYesDelete();
	  }
	
	@DataProvider(name = "createTargetListData")
	public static Object[][] data1() {
		return new Object[][] { { "US12828", "Create New Target List test", "Automated Test Target List","test","Walmart ","Automated Test Target List 2" } };
	}
	
	@DataProvider(name = "addCollaboratorData")
	public static Object[][] data2() {
		return new Object[][] { { "US12830", "add collaborators to a Target List", "Automated Test Target List","eric.ramey@cbrands.com","stash.rowley@cbrands.com","Automated Test Target List 2" } };
	}
	
  
  @AfterMethod
  public void signOut() {
	logout();
  }
}
