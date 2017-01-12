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

public class TargetListTests extends BaseSeleniumTestCase{

	@Test(dataProvider = "createTargetListData", description = "Create a new Target List", priority = 1)
	public void US12828_AT_TargetList_Creation(String name, String description,  String listname, String desc,String chainname, String listname2) throws InterruptedException {
		
		login = new Login(driver);
		if(!login.isUserLoggedIn()) { 
			homePage = login.loginWithValidCredentials(ACTOR1_USER_NAME, ACTOR1_PASSWORD);
		}
				targetListPage = homePage.navigateTargetList();
				targetListPage.clickCreateNewList()
								.clickCreateNewListModal()
								.EnterNameTextBox(listname)
								.EnterDescriptionTextBox(desc)
								.clickSaveButton()
								.clickNewTargetList(listname);		
				targetListPage = homePage.navigateTargetList();
				targetListPage.clickCreateNewList();
				opportunitiesPage = targetListPage.clickSearchOpportunityButton();
				opportunitiesPage.searchRetailerChainByName(chainname)
								.clickApplyFilters()
								.clickfirst_store_opportunity()
								.clickfirstOpportunity()
								.clickSecondOpportunity()
								.clickAddToTargetListButton()
								.clickCreatNewListButton()
								.EnterNameTextBox(listname2)
								.clickSaveButton();
				targetListPage = opportunitiesPage.navigateToTargetList();
			}
	
	@Test(dependsOnMethods = "US12828_AT_TargetList_Creation", dataProvider = "cannotDismissTargetedOpportunities", description = "Cannot Dismiss TargetedOpportunities", priority = 2)
	public void US13001_AT_TargetList_CannotDismissTargetedOpportunities(String name, String description, String distributorname, String listname) {
		
		login = new Login(driver);
		if(!login.isUserLoggedIn()) { 
			homePage = login.loginWithValidCredentials(ACTOR1_USER_NAME, ACTOR1_PASSWORD);
		}
				targetListPage = homePage.navigateTargetList();
				targetListPage.clickNewTargetList(listname)
							.clickfirst_store_opportunity()
							.clickfirstOpportunity()
							.clickActionButton()
							.reloadPage();

				opportunitiesPage = targetListPage.navigateToOpportunities();
				opportunitiesPage.selectAccountScope()
								.clickOffPremise()
								.searchDistributor(distributorname)
								.clickApplyFilters()
								.clickfirst_store_opportunity()
								.clickfirstOpportunity()
								.clickActionButton();
			} 
	
	@Test(dependsOnMethods = "US12828_AT_TargetList_Creation", dataProvider = "targetListExport", description = "Download Opportunities from Target List", priority = 3)
	public void US13024_AT_TargetList_Export(String name, String description,  String listname) {
		
		login = new Login(driver);
		if(!login.isUserLoggedIn()) { 
			homePage = login.loginWithValidCredentials(ACTOR1_USER_NAME, ACTOR1_PASSWORD);
		}
				targetListPage = homePage.navigateTargetList();				
				targetListPage.clickNewTargetList(listname)
							.clickSelectAll()
							.clickDownloadButton()
							.clickWith_RationaleButton()
							.clickSelectAll()
							.selectFirstOpportunity()
							.clickDownloadButton()
							.clickWithout_RationaleButton();				
			} 
	
	@Test(dependsOnMethods = "US12828_AT_TargetList_Creation",dataProvider = "addCollaboratorData", description = "Add Colaborators to Target List", priority = 4)
	public void US12830_AT_TargetList_AddCollaboratorsToTargetList(String name, String description,  String listname, String collaboratorname1, String collaboratorname2, String listname2) throws InterruptedException {
		
		login = new Login(driver);
		if(!login.isUserLoggedIn()) { 
			homePage = login.loginWithValidCredentials(ACTOR1_USER_NAME, ACTOR1_PASSWORD);
		}
				targetListPage = homePage.navigateTargetList();				
				targetListPage.clickNewTargetList(listname)
							.clickManageButton()
							.EnterCollaboratorNameTextBox(collaboratorname1)
							.clickSearchButton()
							.clickCollaboratorList(collaboratorname1)
							.EnterCollaboratorNameTextBox(collaboratorname2)
							.clickSearchButton()
							.clickCollaboratorList(collaboratorname2)
							.clickSaveCollaboratorButton();				
				targetListPage = homePage.navigateTargetList();				
				targetListPage.clickNewTargetList(listname2)
							.maximizeWindow()
							.clickManageButton()
							.EnterCollaboratorNameTextBox(collaboratorname2)
							.clickSearchButton()
							.clickCollaboratorList(collaboratorname2)
							.clickAllowCollaboratorCheckBox()
							.clickSaveCollaboratorButton();
				
			} 
	
	  @Test(dependsOnMethods = "US12830_AT_TargetList_AddCollaboratorsToTargetList",description = "Copy Opportunities to Target List", priority = 5)
	  public void US13098_AT_TargetList_Copy() {
		  login = new Login(driver);
		  if(!login.isUserLoggedIn()) { 
				homePage = login.loginWithValidCredentials(ACTOR1_USER_NAME, ACTOR1_PASSWORD);
		  }
		  targetListPage = homePage.navigateTargetList();
		  targetListPage.clickTargetList("Automated Test Target List 2");
		  String targetListURL = targetListPage.getTargetListURL();
		  targetListPage.clickfirst_store_opportunity()
		  				.clickfirstOpportunity()
		  				.copyToTargetList("Automated Test Target List")
		  				.navigateBackToTargetLists()
		  				.clickTargetListDuplicate("Automated Test Target List")
		  				.clickfirst_store_opportunity();
		  
		  logout();
		  homePage = login.loginWithValidCredentials(ACTOR2_USER_NAME, ACTOR2_PASSWORD);
		  targetListPage = homePage.navigateTargetList();
		  targetListPage.clickCreateNewList()
		  				.clickCreateNewListModal()
		  				.EnterNameTextBox("Target List Copy")
		  				.clickSaveButton()
		  				.clickSharedWithMeLink()
		  				.openTargetListUsingURL(targetListURL)
		  				.clickfirst_store_opportunity()
		  				.clickSecondOpportunity()
		  				.copyToTargetList("Target List Copy")
		  				.navigateBackToTargetLists()
		  				.clickTargetList("Target List Copy")
		  				.clickfirst_store_opportunity()
		  				.clickManageButton()
		  				.clickDelete_TargetListPage()
		  				.clickYesDelete();
	  }
	  
		@Test(dependsOnMethods = "US12828_AT_TargetList_Creation", dataProvider = "archiveTargetList", description = "Archive Target List", priority = 6)
		public void US13025_AT_TargetList_Archive(String name, String description,  String listname){
			
			login = new Login(driver);
			if(!login.isUserLoggedIn()) { 
				homePage = login.loginWithValidCredentials(ACTOR1_USER_NAME, ACTOR1_PASSWORD);
			}
					targetListPage = homePage.navigateTargetList();
					targetListPage.clickTargetListCheckBox(listname)
								.clickArchiveButton()
								.clickArchiveSpan()
								.clickArchiveTargetList(listname)
								.clickSelectAll()
								.clickDownloadButton()
								.clickWith_RationaleButton();
					
				} 
		
	
	@DataProvider(name = "createTargetListData")
	public static Object[][] data1() {
		return new Object[][] { { "US12828", "Create New Target List test", "Automated Test Target List","test","Walmart ","Automated Test Target List 2" } };
	}
	
	@DataProvider(name = "cannotDismissTargetedOpportunities")
	public static Object[][] data2() {
		return new Object[][] { { "US13001", "feedback for opportunities", "COASTAL BEV CO-NC (WILMINGTON)","Automated Test Target List 2" } };
	}
	
	@DataProvider(name = "targetListExport")
	public static Object[][] data3() {
		return new Object[][] { { "US13024", "Download opportunites from Target List", "Automated Test Target List 2" } };
	}
	
	@DataProvider(name = "addCollaboratorData")
	public static Object[][] data4() {
		return new Object[][] { { "US12830", "add collaborators to a Target List", "Automated Test Target List","eric.ramey@cbrands.com","stash.rowley@cbrands.com","Automated Test Target List 2" } };
	}
	
	@DataProvider(name = "archiveTargetList")
	public static Object[][] data5() {
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
