package com.cbrands.test.functional.targetlist;

import org.apache.http.auth.UsernamePasswordCredentials;
import org.openqa.selenium.Alert;
import org.openqa.selenium.Keys;
import org.openqa.selenium.NoAlertPresentException;
import org.openqa.selenium.UnhandledAlertException;
import org.openqa.selenium.security.Credentials;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.DataProvider;
import org.testng.annotations.Test;

import com.cbrands.BaseSeleniumTestCase;
import com.cbrands.pages.Login;

public class TargetList_Create_AddCollaborators_Copy_Archive extends BaseSeleniumTestCase{

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
				opportunitiesPage = targetListPage.clickSearchOpportunityButton();
				opportunitiesPage.searchRetailerChainByName(chainname);
				opportunitiesPage.clickApplyFilters();			
				opportunitiesPage.clickfirst_store_opportunity();				
				opportunitiesPage.clickfirstOpportunity();
				opportunitiesPage.clickSecondOpportunity();				
				opportunitiesPage.clickAddToTargetListButton();				
				opportunitiesPage.clickCreatNewListButton();			
				opportunitiesPage.EnterNameTextBox(listname2);				
				opportunitiesPage.clickSaveButton();	
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
				try {
					targetListPage.clickCollaboratorList(collaboratorname2);
				} catch (UnhandledAlertException f) {
					try {
				        Alert alert = driver.switchTo().alert();
				        alert.authenticateUsing((Credentials) new UsernamePasswordCredentials(ACTOR1_USER_NAME,ACTOR1_PASSWORD));;
				    } catch (NoAlertPresentException e) {
				        e.printStackTrace();
				    }
				}
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
	  
		@Test(dependsOnMethods = "US12828_AT_TargetList_Creation", dataProvider = "archiveTargetList", description = "Archive Target List", priority = 4)
		public void US13025_AT_TargetList_Archive(String name, String description,  String listname){
			
			login = new Login(driver);
			if(!login.isUserLoggedIn()) { 
				homePage = login.loginWithValidCredentials(ACTOR1_USER_NAME, ACTOR1_PASSWORD);
			}
					targetListPage = homePage.navigateTargetList();
					targetListPage.clickTargetListCheckBox(listname);
					targetListPage.clickArchiveButton();
					targetListPage.clickArchiveSpan();
					targetListPage.clickArchiveTargetList(listname);
					targetListPage.clickSelectAll();
					targetListPage.clickDownloadButton();
					targetListPage.clickWith_RationaleButton();
					
					targetListPage.logOut();
					
				} 
		
	
	@DataProvider(name = "createTargetListData")
	public static Object[][] data1() {
		return new Object[][] { { "US12828", "Create New Target List test", "Automated Test Target List","test","Walmart ","Automated Test Target List 2" } };
	}
	
	@DataProvider(name = "addCollaboratorData")
	public static Object[][] data2() {
		return new Object[][] { { "US12830", "add collaborators to a Target List", "Automated Test Target List","eric.ramey@cbrands.com","stash.rowley@cbrands.com","Automated Test Target List 2" } };
	}
	
	@DataProvider(name = "archiveTargetList")
	public static Object[][] data4() {
		return new Object[][] { { "US13025", "Archive Target List", "Automated Test Target List 2"} };
	}
	
	@BeforeMethod
	public void logOut() {
	logout();
	}
	
  
  @AfterMethod
  public void signOut() {
	logout();
  }
}
