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
import org.testng.annotations.DataProvider;
import org.testng.annotations.Test;

import com.cbrands.BaseSeleniumTestCase;
import com.cbrands.helper.RetryAnalyzer;
import com.cbrands.pages.Login;
import com.cbrands.pages.NotificationContent;

public class ShareOpportunity_TargetList extends BaseSeleniumTestCase {
	static NotificationContent content;
	
	@Test(dataProvider = "createTargetListData", description = "Create a new Target List", priority = 0)
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
	
	@Test(dataProvider="targetlistData1", description="US12999: AT_Target List_Share An Opportunity",priority=1)
	public void US12999_AT_TargetList_ShareAnOpportunity(String listname,String sendTo1, String sendTo2) throws InterruptedException{
		login = new Login(driver);
		homePage = login.loginWithValidCredentials(ACTOR1_USER_NAME, ACTOR1_PASSWORD);
		
		targetListPage = homePage.navigateTargetList();
		//Thread.sleep(10000);
		if(targetListPage.checkTargetListExists(listname)){
			targetListPage.clickNewTargetList(listname);
			
			if(targetListPage.getExpandAll().isEnabled()){
			targetListPage.clickExpandAll();
			targetListPage.selectFirstRecord();
			
			content = targetListPage.getWebElementOfFirstItem();
			
			content.setSentByPersonName(ACTOR1_FIRST_NAME+" "+ ACTOR1_LAST_NAME );
			content.setProductSku(content.getProductSku() + " " + "Non-Buy");
			
			targetListPage.clickSendTo(sendTo1);
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
	
	@Test( enabled = true,retryAnalyzer=RetryAnalyzer.class,description="US13109: AT_Target List_Remove a Collaborator", dataProvider="targetlistData2", priority=2 )
	public void US13109_AT_TargetList_RemoveACollaborator(String listname) throws InterruptedException{
		login = new Login(driver);
		homePage = login.loginWithValidCredentials(ACTOR1_USER_NAME, ACTOR1_PASSWORD);
		
		targetListPage = homePage.navigateTargetList();
		//Thread.sleep(6000);
		
		targetListPage.checkNumberofCollaborator(listname);
		
		if(targetListPage.checkTargetListExists(listname)){
			if(targetListPage.checkNumberofCollaborator(listname).trim().equalsIgnoreCase("3 COLLABORATORS")){
				targetListPage.clickNewTargetList(listname);
				targetListPage.clickManage();
				targetListPage.clickCollaborator();
				targetListPage.removeCollaborator();
				//Thread.sleep(1000);
				
				targetListPage.clickManage();
				targetListPage.clickCollaborator();
				targetListPage.removeCollaborator();
				//Thread.sleep(1000);
				
				targetListPage.navigateBackToTargetLists();
				
				assertThat(targetListPage.checkNumberofCollaborator(listname),log(containsString("1 COLLABORATOR")));
				
				signOut();
				login = new Login(driver);
				homePage = login.loginWithValidCredentials(ACTOR2_USER_NAME, ACTOR2_PASSWORD);
				
				targetListPage = homePage.navigateTargetList();
				
				//Thread.sleep(3000);
				
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
	
	
	@Test(retryAnalyzer=RetryAnalyzer.class,description="US13107: AT_Target List_Show Depletions",dataProvider="targetlistData3",priority=3)
	public void US13107_AT_TargetList_ShowDepletions(String listname) throws InterruptedException{
		login = new Login(driver);
		homePage = login.loginWithValidCredentials(ACTOR4_USER_NAME, ACTOR4_PASSWORD);
		
		targetListPage = homePage.navigateTargetList();
		//Thread.sleep(7000);

		if(targetListPage.checkTargetListExists(listname)){
			
			assertThat(targetListPage.getDepletionSince_TargetListPage(listname), log((not(equalToIgnoringCase("0")))));
			targetListPage.clickNewTargetList(listname);
			
			targetListPage.getDepletionsSinceClosed();
			
			assertThat(targetListPage.getDepletionsSinceClosed(),log(is(not(equalTo("0CE")))));
		}
		else{
			assertThat(targetListPage.getTargetLists(), log(hasItems(not(equalToIgnoringCase(listname)))));
		}
	}

	
	@Test(enabled = true,description="US13108:AT_Target List_Transfer Ownership",dataProvider="targetlistData4", priority=4)
	public void US13108_AT_TargetList_TransferOwnership(String listname,String strName) throws InterruptedException{
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
	
	@Test(description="US13113:AT_Target List_Delete List", dataProvider="targetlistData5",dependsOnMethods="US13109_AT_TargetList_RemoveACollaborator")
	public void US13113_AT_TargetList_DeleteList(String listname, String listname1) throws InterruptedException{
		login = new Login(driver);
		homePage = login.loginWithValidCredentials(ACTOR1_USER_NAME, ACTOR1_PASSWORD);
		
		targetListPage = homePage.navigateTargetList();
		//Thread.sleep(10000);
		
		
		
		targetListPage.clickSharedWithMe();
		//Thread.sleep(10000);
		
		
		
		if(targetListPage.checkSharedTargetListExists(listname).trim().equalsIgnoreCase(listname)){
			targetListPage.clickTargetList(listname);
			//Thread.sleep(1000);
			targetListPage.clickManage();
			//Thread.sleep(1000);
			assertThat(targetListPage.checkDeleteListExists(), log(equalToIgnoringCase("Delete List does not exists")));
			targetListPage.cancelManageTargetList();
			
			targetListPage.navigateBackToTargetLists();
			
		
			if(targetListPage.checkTargetListExists(listname1)){
				
				if(!targetListPage.getDeleteTarget().isEnabled()){
			
				targetListPage.selectTargetList(listname1);
				
				targetListPage.clickDelete_TargetListPage();
				//Thread.sleep(300);
				assertThat(targetListPage.getDeleteListText(), log(equalToIgnoringCase("Target List Deleted!")));
				
				signOut();
				login = new Login(driver);
				homePage = login.loginWithValidCredentials(ACTOR2_USER_NAME, ACTOR2_PASSWORD);
				
				targetListPage = homePage.navigateTargetList();
				
				//Thread.sleep(3000);
				
				if(targetListPage.checkTargetListExists(listname)){
					
					targetListPage.selectTargetList(listname);
					
					targetListPage.clickDelete_TargetListPage();
					//Thread.sleep(300);
					assertThat(targetListPage.getCannotDeleteListText(), log(equalToIgnoringCase("Sorry, you cannot delete a Target List that has Collaborators. Please remove all Collaborators from that list and try again.")));
					
					targetListPage.clickNewTargetList(listname);
					//Thread.sleep(1000);
					targetListPage.clickManage();
					//Thread.sleep(1000);
					
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
	
	@DataProvider(name = "createTargetListData")
	public static Object[][] data0() {
		return new Object[][] { { "US12828", "Create New Target List test", "Automated Test Target List","test","Walmart ","Automated Test Target List 2" } };
	}

	
	@DataProvider(name="targetlistData1")
	public static Object[][] data1(){
		return new Object[][]{{"Automated Test Target List 2", "Stan Rowley","Eric Ramey"}};
	}
	
	@DataProvider(name="targetlistData2")
	public static Object[][] data2(){
		return new Object[][]{{"Automated Test Target List"}};
	}
	
	@DataProvider(name="targetlistData3")
	public static Object[][] data3(){
		return new Object[][]{{"Closed Oppty Test - DO NOT DELETE"}};
	}
	
	@DataProvider(name="targetlistData4")
	public static Object[][] data4(){
		return new Object[][]{{"Automated Test Target List 2","Stanley Rowley"}};
	}
	
	@DataProvider(name="targetlistData5")
	public static Object[][] data5(){
		return new Object[][]{{"Automated Test Target List 2","Automated Test Target List"}};
	}
	
	@AfterMethod
	public void signOut() {
		logout();
	}



}
