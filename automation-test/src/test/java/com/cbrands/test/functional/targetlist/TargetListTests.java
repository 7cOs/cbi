package com.cbrands.test.functional.targetlist;

import static net.javacrumbs.hamcrest.logger.HamcrestLoggerMatcher.log;
import static org.hamcrest.CoreMatchers.containsString;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.equalToIgnoringCase;
import static org.hamcrest.Matchers.hasItems;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.not;

import java.util.Date;
import java.util.List;
import java.util.concurrent.TimeUnit;

import org.hamcrest.Matchers;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.DataProvider;
import org.testng.annotations.Test;

import com.cbrands.BaseSeleniumTestCase;
import com.cbrands.helper.RetryAnalyzer;
import com.cbrands.pages.Login;
import com.cbrands.pages.NotificationContent;

public class TargetListTests extends BaseSeleniumTestCase{
	static NotificationContent content;
	
	@Test(dataProvider="depletions",description="US13107: AT_Target List_Show Depletions",priority=0)
	public void US13107_AT_TargetList_ShowDepletions(String listname) throws InterruptedException{
		login = new Login(driver);
		if(!login.isUserLoggedIn()) { 
			homePage = login.loginWithValidCredentials(ACTOR4_USER_NAME, ACTOR4_PASSWORD);
		}	
		targetListPage = homePage.navigateTargetList();
		if(targetListPage.checkTargetLists(listname)){
			assertThat(targetListPage.getDepletionSince_TargetListPage(listname), log((not(equalToIgnoringCase("0")))));
			targetListPage.clickNewTargetList(listname)
						  .getDepletionsSinceClosed();
			assertThat(targetListPage.getDepletionsSinceClosed(),log(is(not(equalTo("0CE")))));
		}
		else{
			assertThat(targetListPage.getTargetLists(), log(hasItems(not(equalToIgnoringCase(listname)))));
		}
	}

	@Test(retryAnalyzer = RetryAnalyzer.class, dataProvider = "createTargetListData", description = "Create a new Target List", priority = 1)
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
								.clickSaveButton();
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
	
	@Test(dependsOnMethods = "US12828_AT_TargetList_Creation", dataProvider="addRemoveOpportunityData", description="US12829: I can add or remove opportunities to an existing Target List", priority=4)
	public void US12829_AT_TargetList_Add_RemoveOpportunities(String chain, String targetListName1, String newTargetList, String targetListName2) throws InterruptedException {
		login = new Login(driver);
		homePage = login.loginWithValidCredentials(ACTOR1_USER_NAME, ACTOR1_PASSWORD);
		targetListPage = homePage.navigateTargetList();
		if (targetListPage.checkTargetNameExists(targetListName2)) {
			targetListPage.clickNewTargetList(targetListName2);
			if (targetListPage.getExpandAll().isEnabled()) {
				targetListPage.clickSelectAll();
				targetListPage.deleteOpportunity();
				//Thread.sleep(2000);
				//assertThat("Existing Opportunities deleted", !targetListPage.getExpandAll().isEnabled());
			}
		}
		targetListPage.reloadPage();
		opportunitiesPage = targetListPage.navigateToOpportunities();

		opportunitiesPage.searchRetailerChainByName(chain);
		opportunitiesPage.clickApplyFilters();

		assertThat(getFilterList(), log(hasItems(equalToIgnoringCase(chain))));

		opportunitiesPage.clickOpportunitySearchFirstResult();
		opportunitiesPage.clickExpandAllButton();

		assertThat("Add to target list button is disabled ", !opportunitiesPage.getAddToTargetListButton().isEnabled());

		opportunitiesPage.selectFirstStore();

		opportunitiesPage.clickAddToTargetListButton();

		if (opportunitiesPage.checkTargetListExists(targetListName1) && opportunitiesPage.checkTargetListExists(targetListName2)) {

			opportunitiesPage.selectDropdownFromTargetList(targetListName1);
			//Thread.sleep(500);

			assertThat(opportunitiesPage.getOpputunitiesAddedConfirmToast(), log(containsString("Opportunity")));

			opportunitiesPage.selectFirstStore();
			// opportunitiesPage.selectFirstStore();
			opportunitiesPage.selectMultipleStore();
			opportunitiesPage.clickAddToTargetListButton();

			opportunitiesPage.selectDropdownFromTargetList(targetListName2);
			//Thread.sleep(500);
			assertThat(opportunitiesPage.getOpputunitiesAddedConfirmToast(), log(containsString("Opportunities")));

			opportunitiesPage.pageRefresh();
			//Thread.sleep(10000);
			targetListPage = opportunitiesPage.navigateToTargetList();
			//Thread.sleep(10000);
			targetListPage.clickNewTargetList(targetListName1);
			targetListPage.selectFirstOpportunity();
			targetListPage.deleteOpportunity();
			//Thread.sleep(1000);
			//assertThat("All Opportunities Deleted ", !targetListPage.getRemoveOpportunity().isEnabled());

			targetListPage.reloadPage();
			targetListPage.navigateToTargetList();
			targetListPage.clickNewTargetList(targetListName2);
			targetListPage.clickExpandAll();
			//Thread.sleep(2000);
		} else if (!opportunitiesPage.checkTargetListExists(targetListName1)) {
			assertThat("Target List Does not exists. Create Target List " + targetListName1, !opportunitiesPage.checkTargetListExists(targetListName1));
		} else if (!opportunitiesPage.checkTargetListExists(targetListName2)) {
			assertThat("Target List Does not exists. Create Target List " + targetListName2, !opportunitiesPage.checkTargetListExists(targetListName2));
		} else {
			assertThat("Target List Does not exists. Create Target List " + targetListName1 + " and " + targetListName2, !opportunitiesPage.checkTargetListExists(targetListName1));
		}

	}
	
	
	@Test(dependsOnMethods = "US12828_AT_TargetList_Creation", dataProvider="shareOpportunityData", description="US12999: AT_Target List_Share An Opportunity",priority=5)
	public void US12999_AT_TargetList_ShareAnOpportunity(String listname,String sendTo1, String sendTo2) throws InterruptedException{
		login = new Login(driver);
		homePage = login.loginWithValidCredentials(ACTOR1_USER_NAME, ACTOR1_PASSWORD);
		
		targetListPage = homePage.navigateTargetList();
		if(targetListPage.checkTargetListExists(listname)){
			targetListPage.clickNewTargetList(listname);
			
			if(targetListPage.getExpandAll().isEnabled()){
			targetListPage.clickExpandAll();
			targetListPage.selectFirstRecord();
			
			content = targetListPage.getWebElementOfFirstItem();
			
			content.setSentByPersonName(ACTOR1_FIRST_NAME+" "+ ACTOR1_LAST_NAME );
			content.setProductSku(content.getProductSku() + " " + "Non-Buy");
			
			targetListPage.clickSendTo(sendTo1, sendTo2);
			Date date1  = new Date();
			
			assertThat(targetListPage.getOpportunitySent(),log(containsString("Opportunity Sent!")));
			
			signOut();
			login = new Login(driver);
			homePage = login.loginWithValidCredentials(ACTOR2_USER_NAME, ACTOR2_PASSWORD);
			
			opportunitiesPage = homePage.navigateOpportunities();
			
			List<NotificationContent> notificationContents ;
			opportunitiesPage.clickNotification();
			notificationContents =opportunitiesPage.getFirtNotifications();
			
			Date date2 = new Date();
			long diff = date2.getTime() - date1.getTime();
			
			long minutes = TimeUnit.MILLISECONDS.toMinutes(diff);
			
			
			content.setSentByDate((minutes) + " MINUTE AGO");
			
			
			assertThat(notificationContents, log(Matchers.hasItem(content)));
									
			signOut();
			login = new Login(driver);
			homePage = login.loginWithValidCredentials(ACTOR3_USER_NAME, ACTOR3_PASSWORD);
			opportunitiesPage = homePage.navigateOpportunities();
			opportunitiesPage.clickNotification();
			
			notificationContents =opportunitiesPage.getFirtNotifications();
			
			Date date3 = new Date();
			diff = date3.getTime() - date1.getTime();
			
			minutes = TimeUnit.MILLISECONDS.toMinutes(diff);
			
			if(minutes == 0 || minutes ==1){
				content.setSentByDate(minutes + " MINUTE AGO");
			}
			else{
				content.setSentByDate(minutes + " MINUTES AGO");
			}
			
			
			assertThat(notificationContents, log(Matchers.hasItem(content)));
			
			}
			else{
				assertThat("There is no opportunity in Target List" + listname, !targetListPage.getExpandAll().isEnabled());
			}
		}
		else{
			assertThat(targetListPage.getTargetLists(), log(hasItems(not(equalToIgnoringCase(listname)))));
		}
	}
	
	@Test(dependsOnMethods = "US12828_AT_TargetList_Creation",dataProvider = "addCollaboratorData", description = "Add Colaborators to Target List", priority = 6)
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
	
	  @Test(dependsOnMethods = "US12830_AT_TargetList_AddCollaboratorsToTargetList",description = "Copy Opportunities to Target List", priority = 7)
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
	  
	  @Test(dependsOnMethods = "US12830_AT_TargetList_AddCollaboratorsToTargetList",description="US13109: AT_Target List_Remove a Collaborator", dataProvider="removeCollaboratorData", priority=8 )
		public void US13109_AT_TargetList_RemoveACollaborator(String listname){
			login = new Login(driver);
			homePage = login.loginWithValidCredentials(ACTOR1_USER_NAME, ACTOR1_PASSWORD);			
			targetListPage = homePage.navigateTargetList();			
			targetListPage.checkNumberofCollaborator(listname);		
			if(targetListPage.checkTargetListExists(listname)){
				if(targetListPage.checkNumberofCollaborator(listname).trim().equalsIgnoreCase("3 COLLABORATORS")){
					targetListPage.clickNewTargetList(listname);
					targetListPage.clickManage();
					targetListPage.clickCollaborator();
					targetListPage.removeCollaborator();				
					targetListPage.clickManage();
					targetListPage.clickCollaborator();
					targetListPage.removeCollaborator();					
					targetListPage.navigateBackToTargetLists();					
					assertThat(targetListPage.checkNumberofCollaborator(listname),log(containsString("1 COLLABORATOR")));				
					signOut();
					login = new Login(driver);
					homePage = login.loginWithValidCredentials(ACTOR2_USER_NAME, ACTOR2_PASSWORD);					
					targetListPage = homePage.navigateTargetList();
					targetListPage.clickSharedWithMe();					
					assertThat(targetListPage.checkSharedTargetListExists(listname), log(containsString("does not exist")));
				}
				else{
					assertThat("Target list " + listname + " does not have 3 collaborators", true);
				}
			}
			else{
				assertThat(targetListPage.getTargetLists(), log(hasItems(not(equalToIgnoringCase(listname)))));
			}
		}
	  
	  @Test(dependsOnMethods = "US12830_AT_TargetList_AddCollaboratorsToTargetList",description="US13108:AT_Target List_Transfer Ownership",dataProvider="transferOwnershipData", priority=9)
		public void US13108_AT_TargetList_TransferOwnership(String listname,String strName) {
			login = new Login(driver);
			homePage = login.loginWithValidCredentials(ACTOR1_USER_NAME, ACTOR1_PASSWORD);
			
			targetListPage = homePage.navigateTargetList();
			//Thread.sleep(10000);
			
			System.out.println(targetListPage.checkTargetListExists(listname));

			if(targetListPage.checkTargetListExists(listname)){
				targetListPage.clickNewTargetList(listname);
				//Thread.sleep(1000);
				targetListPage.clickManage();
				//Thread.sleep(1000);
				targetListPage.clickCollaborator();
				targetListPage.makeOwner();
				
				assertThat(targetListPage.getmakeOwnerConfirmationToast(), log(((equalToIgnoringCase("This will cause you to lose editing rights.  Continue Transfer")))));

				targetListPage.cancelMakeOwnerConfirmationToast();
				
				targetListPage.clickCollaborator();
				targetListPage.makeOwner();
				targetListPage.clickContinueTransfer();
				
				
				targetListPage.cancelManageTargetList();
				targetListPage.navigateBackToTargetLists();
				//Thread.sleep(7000);
				assertThat(targetListPage.getTargetLists(), log(hasItems(not(equalToIgnoringCase(listname)))));
				
				targetListPage.clickSharedWithMeLink();
				//Thread.sleep(10000);
				assertThat(targetListPage.checkSharedTargetListExists(listname), log(containsString(listname)));
				
				signOut();
				
				login = new Login(driver);
				homePage = login.loginWithValidCredentials(ACTOR2_USER_NAME, ACTOR2_PASSWORD);
				
				targetListPage = homePage.navigateTargetList();
				//Thread.sleep(10000);
				
				assertThat(targetListPage.getTargetLists(), log(hasItems((equalToIgnoringCase(listname)))));
				
				targetListPage.clickSharedWithMe();
				//Thread.sleep(10000);
				assertThat(targetListPage.checkSharedTargetListExists(listname), log(not(containsString(listname))));
			}
			else{
				assertThat(targetListPage.getTargetLists(), log(hasItems(not(equalToIgnoringCase(listname)))));
			}
		}
	  
	  @Test(description="US13113:AT_Target List_Delete List", dataProvider="deleteListData",dependsOnMethods="US13109_AT_TargetList_RemoveACollaborator", priority = 10)
		public void US13113_AT_TargetList_DeleteList(String listname, String listname1) throws InterruptedException{
			login = new Login(driver);
			homePage = login.loginWithValidCredentials(ACTOR1_USER_NAME, ACTOR1_PASSWORD);			
			targetListPage = homePage.navigateTargetList();
			targetListPage.clickSharedWithMe();		
			if(targetListPage.checkSharedTargetListExists(listname).trim().equalsIgnoreCase(listname)){
				targetListPage.clickTargetList(listname);
				targetListPage.clickManage();
				assertThat(targetListPage.checkDeleteListExists(), log(equalToIgnoringCase("Delete List does not exists")));
				targetListPage.cancelManageTargetList();				
				targetListPage.navigateBackToTargetLists();		
				if(targetListPage.checkTargetListExists(listname1)){					
					if(!targetListPage.getDeleteTarget().isEnabled()){				
					targetListPage.selectTargetList(listname1);					
					targetListPage.clickDelete_TargetListPage();
					assertThat(targetListPage.getDeleteListText(), log(equalToIgnoringCase("Target List Deleted!")));			
					signOut();
					login = new Login(driver);
					homePage = login.loginWithValidCredentials(ACTOR2_USER_NAME, ACTOR2_PASSWORD);					
					targetListPage = homePage.navigateTargetList();					
					if(targetListPage.checkTargetListExists(listname)){						
						targetListPage.selectTargetList(listname);
						targetListPage.clickDelete_TargetListPage();
						assertThat(targetListPage.getCannotDeleteListText(), log(equalToIgnoringCase("Sorry, you cannot delete a Target List that has Collaborators. Please remove all Collaborators from that list and try again.")));						
						targetListPage.clickNewTargetList(listname);
						targetListPage.clickManage();					
						assertThat(targetListPage.checkDeleteListExists(), log(equalToIgnoringCase("Delete List does not exists")));						
						targetListPage.cancelManageTargetList();
					}
					}
					else{
						assertThat(targetListPage.getTargetLists(), log(hasItems(not(equalToIgnoringCase(listname)))));
					}
					
				}
				else{
					assertThat(targetListPage.getTargetLists(), log(hasItems(not(equalToIgnoringCase(listname1)))));
				}
			}
			else{
				assertThat(targetListPage.checkSharedTargetListExists(listname), log(not(containsString("does not exist"))));
			}
			
		}
	  
		@Test(dependsOnMethods = "US12829_AT_TargetList_Add_RemoveOpportunities", dataProvider = "archiveTargetList", description = "Archive Target List", priority = 11)
		public void US13025_AT_TargetList_Archive(String name, String description,  String chainName, String listname){
			
			login = new Login(driver);
			if(!login.isUserLoggedIn()) { 
				homePage = login.loginWithValidCredentials(ACTOR1_USER_NAME, ACTOR1_PASSWORD);
			}
			
			targetListPage = homePage.navigateTargetList();
			targetListPage.clickCreateNewList();
			opportunitiesPage = targetListPage.clickSearchOpportunityButton();
			opportunitiesPage.searchRetailerChainByName(chainName)
							.clickApplyFilters()
							.clickfirst_store_opportunity()
							.clickfirstOpportunity()
							.clickSecondOpportunity()
							.clickAddToTargetListButton()
							.clickCreatNewListButton()
							.EnterNameTextBox(listname)
							.clickSaveButton();
			targetListPage = opportunitiesPage.navigateToTargetList();
					targetListPage = homePage.navigateTargetList();
					targetListPage.clickTargetListCheckBox(listname)
								.clickArchiveButton()
								.clickArchiveSpan()
								.clickArchiveTargetList(listname)
								.clickSelectAll()
								.clickDownloadButton()
								.clickWith_RationaleButton();
					
				} 
		
	
	@DataProvider(name="depletions")
	public static Object[][] data0(){
	return new Object[][]{{"Closed Oppty Test - DO NOT DELETE"}};
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
	
	@DataProvider(name="shareOpportunityData")
	public static Object[][] data4(){
		return new Object[][]{{"Automated Test Target List 2", "Stan Rowley","Eric Ramey"}};
	}
	
	@DataProvider(name = "addCollaboratorData")
	public static Object[][] data5() {
		return new Object[][] { { "US12830", "add collaborators to a Target List", "Automated Test Target List","eric.ramey@cbrands.com","stash.rowley@cbrands.com","Automated Test Target List 2" } };
	}
	
	@DataProvider(name="removeCollaboratorData")
	public static Object[][] data_remove_collaborator(){
		return new Object[][]{{"Automated Test Target List 2"}};
	}
	
	@DataProvider(name="transferOwnershipData")
	public static Object[][] data7(){
		return new Object[][]{{"Automated Test Target List 2","Stanley Rowley"}};
	}
	
	@DataProvider(name="deleteListData")
	public static Object[][] data_deleteList(){
		return new Object[][]{{"Automated Test Target List 2","Automated Test Target List"}};
	}
	
	@DataProvider(name = "archiveTargetList")
	public static Object[][] data8() {
		return new Object[][] { { "US13025", "Archive Target List", "Walmart", "Automated Test Target List 2"} };
	}
	
	@DataProvider(name="addRemoveOpportunityData")
	public static Object[][] data_add_remove(){
		return new Object[][]{{"Walmart","Automated Test Target List","Create New List","Automated Test Target List 2"}};
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
