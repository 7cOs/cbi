package com.cbrands.legacy.test.smoke;

import static net.javacrumbs.hamcrest.logger.HamcrestLoggerMatcher.log;
import static org.hamcrest.CoreMatchers.containsString;
import static org.hamcrest.CoreMatchers.not;
import static org.hamcrest.CoreMatchers.startsWith;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.equalToIgnoringCase;
import static org.hamcrest.Matchers.hasItems;

import org.testng.annotations.AfterMethod;
import org.testng.annotations.DataProvider;
import org.testng.annotations.Test;
import org.testng.asserts.SoftAssert;

import com.cbrands.legacy.BaseSeleniumTestCase;
import com.cbrands.legacy.pages.Login;

public class SmokeTests extends BaseSeleniumTestCase{
	
	static String current_time_stamp = new java.text.SimpleDateFormat("MM.dd.yyyy HH:mm:ss").format(new java.util.Date());
	
	@Test(dataProvider = "opportunityPage1Test", description = "Run - 2: I can select Save Report to save a set of filter criteria for reuse.", priority = 1)
	public void US12705_AT_Opportunities_Run2_CreateSavedReport(String premise, String distributor, String opporunityType, String reportName) {
		login = new Login(driver);
		if(!login.isUserLoggedIn()) { 
			homePage = login.loginWithValidCredentials(ACTOR3_USER_NAME, ACTOR3_PASSWORD);
			homePage.get();
		}
		opportunitiesPage = homePage.navigateOpportunities();
		opportunitiesPage = (premise.equalsIgnoreCase("On-Premise")) ? opportunitiesPage.clickOnPremise() : opportunitiesPage.clickOffPremise();
		opportunitiesPage.typeDistributor(distributor)
						 .selectOpporunityType(opporunityType)
						 .clickApplyFilters();
		
		assertThat(getFilterList(), log(hasItems(equalToIgnoringCase(premise))));
		assertThat(getFilterList(), log(hasItems(equalToIgnoringCase(distributor))));
		assertThat(getFilterList(), log(hasItems(equalToIgnoringCase(opporunityType))));
		
		if(opportunitiesPage.getListForSaveReport().contains(reportName)){
			System.out.println("Report name already exist. skipping creating save report steps.");
			return;
		} else {
			opportunitiesPage.escpageFromDropdown();
		}
		
		opportunitiesPage.clickSaveReport()
						.typeSaveReportName(reportName)
						.clickDialogSaveReport()
						.reloadPage();
		
		assertThat("Saved report name did not matched.", opportunitiesPage.getListForSaveReport(), log(hasItems(containsString(reportName))));
		
	}
	
	@Test(dependsOnMethods = "US12705_AT_Opportunities_Run2_CreateSavedReport", dataProvider = "opportunityPage1Test", description = "Run - 4: I can get from the Home page to the Opportunities Page using a Saved Filter available on the Home Page and find the opportunity results that correspond to the Home Page Search." , priority = 3)
	public void US12707_AT_Opportunities_Run4_HomePageSavedReport(String premise, String distributor, String opporunityType, String reportName){
		login = new Login(driver);
		if(!login.isUserLoggedIn()) { 
			homePage = login.loginWithValidCredentials(ACTOR3_USER_NAME, ACTOR3_PASSWORD);
			homePage.get();
		}
		opportunitiesPage = homePage.selectSaveReportDropdown(reportName);
		
		assertThat("Premise filters is not selected", getFilterList(), log(hasItems(equalToIgnoringCase(premise))));
		assertThat("Distributor filters is not selected", getFilterList(), log(hasItems( startsWith(distributor))));
		assertThat("Opporunity Type filters is not selected", getFilterList(), log(hasItems(equalToIgnoringCase(opporunityType))));
	}
	
	@Test(dependsOnMethods = "US12707_AT_Opportunities_Run4_HomePageSavedReport", dataProvider = "opportunityPage1Test", description = "Run - 3: I can edit or delete an existing Saved Report filter criteria and resave and I can ‘Reset’ my filter selection while working with filters." , priority = 2)
	public void US12706_AT_Opportunities_Run3_Edit_DeleteSavedReport(String premise, String distributor, String opporunityType, String reportName) {

		login = new Login(driver);
		if(!login.isUserLoggedIn()) { 
			homePage = login.loginWithValidCredentials(ACTOR3_USER_NAME, ACTOR3_PASSWORD);
			homePage.get();
		}
		opportunitiesPage = homePage.navigateOpportunities();
		
		opportunitiesPage.selectSaveReportDropdownByName(reportName);
		
		assertThat("Premise filters is not selected", getFilterList(), log(hasItems(equalToIgnoringCase(premise))));
		assertThat("Distributor filters is not selected", getFilterList(), log(hasItems(equalToIgnoringCase(distributor))));
		assertThat("Opporunity Type filters is not selected", getFilterList(), log(hasItems(equalToIgnoringCase(opporunityType))));
		
		opportunitiesPage.selectOpenOpportunityStatus()
						.clickApplyFilters()
						.clickSaveReport()
						.selectDropdownFromSaveReportPopup(reportName)
						.clickDialogUpdateReport();

		opportunitiesPage.resetFilters();
		
		assertThat("Premise filters is not selected", getFilterList(), log(hasItems(not(equalToIgnoringCase(premise)))));
		assertThat("Distributor filters is not selected", getFilterList(), log(hasItems(not(equalToIgnoringCase(distributor)))));
		assertThat("Opporunity Type filters is not selected", getFilterList(), log(hasItems(not(equalToIgnoringCase(opporunityType)))));
		
		
		opportunitiesPage.reloadPage().selectSaveReportDropdownByName(reportName);
		
		assertThat("Open filters is not selected", getFilterList(), log(hasItems(equalToIgnoringCase("Open"))));
		assertThat("Premise filters is not selected", getFilterList(), log(hasItems(equalToIgnoringCase(premise))));
		assertThat("Distributor filters is not selected", getFilterList(), log(hasItems(equalToIgnoringCase(distributor))));
		assertThat("Opporunity Type filters is not selected", getFilterList(), log(hasItems(equalToIgnoringCase(opporunityType))));
		
		
		opportunitiesPage.deleteSaveReportDropdownByName(reportName)
		 				 .clickDeleteReportBtn()
		 				 .reloadPage();
		
		assertThat("Deleted report name still existed.", opportunitiesPage.getListForSaveReport(), log(hasItems(not(containsString(reportName)))));
	}
	
	
	@Test(dataProvider = "sendOpportunityData", description = "Run - 13:  I can Share an Opportunity to another Employee.", priority = 7)
	public void US12719_AT_Opportunities_Run13_ShareOpportunities(String sendTo, String sent) throws InterruptedException {
		login = new Login(driver);
		if(!login.isUserLoggedIn()) { 
			login = new Login(driver);
			homePage = login.loginWithValidCredentials(ACTOR1_USER_NAME, ACTOR1_PASSWORD);
			homePage.get();
		}
		
		opportunitiesPage = homePage.navigateOpportunities()
									.searchRetailerChainByName("Real Mex")
									.selectOpporunityType("Non-Buy")
									.clickOnPremise()
									.clickApplyFilters();
		
		String allText = getAllTextFromPage();
		assertThat("Unable to find any opportunities that met your criteria.", allText, not(containsString("Dang! We were unable to find any opportunities that met your criteria.")));
		
		opportunitiesPage.sendOpportunityTo(sendTo);
		
		SoftAssert softAssert = new SoftAssert();
		
		softAssert.assertSame(opportunitiesPage.getOpportunitySent(), sent);
	}
	
	
	@Test(dataProvider = "targetData", description = "Create a new Target List", priority = 9)
	public void createTargetList(String name, String description, String collaborator) throws InterruptedException {
		login = new Login(driver);
		homePage = login.loginWithValidCredentials(ACTOR1_USER_NAME, ACTOR1_PASSWORD);
		homePage.get();
		targetListPage = homePage.navigateTargetList();		
		targetListPage.clickCreateNewListButton()
					.clickCreateNewListButtonInModal()
					.EnterNameTextBox(name)
					.typeDescription(description)
					.addCollaborator(collaborator)
					.clickSaveButton()
					.navigateToTargetList()
					.clickTargetList(name)
					.clickManage()
					.clickCollaborator()
					.removeCollaborator()
					.clickSaveCollaboratorButton()
					.navigateToTargetList()
					.clickTargetList(name)
					.clickManage()
					.clickDelete_TargetListPage()
					.clickYesDelete();
		
		
		assertThat(targetListPage.getSuccessMessage(),log(containsString("Success")));
		assertThat(targetListPage.getTargetListName(), log(containsString(name)));
	
		targetListPage.reloadPage();
	}
	
	
	@DataProvider(name = "opportunityPage1Test")
	public static Object[][] data1() {
		return new Object[][] {
				{ "On-Premise", "Coastal Bev Co-nc (wilmington)", "At Risk", "Chris On Coastal (Wil) At Risk 1" }, };
	}

	@DataProvider(name = "sendOpportunityData")
	public static Object[][] data3() {
		return new Object[][] { { "stash.rowley", "Opportunity Sent!" } };
	}

	@DataProvider(name = "targetData")
	public static Object[][] data4() {
		return new Object[][] { { "Smoke Test " + current_time_stamp, "test", "Stanley Rowley" } };
	}

	@AfterMethod
	public void signOut() {
		logout();
	}
}
