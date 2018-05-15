package com.cbrands.legacy.test.functional.opportunity;

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

import com.cbrands.legacy.BaseSeleniumTestCase;
import com.cbrands.helper.RetryAnalyzer;
import com.cbrands.legacy.pages.Login;


/**
 * @deprecated Legacy functional test removed from the functional suite. No longer working due to login/logout being
 * wrong. Saved for reference only. Should be deleted as soon as there is a new test to replace it.
 */
@Deprecated
public class OpportunityTest extends BaseSeleniumTestCase {

	@Test(retryAnalyzer = RetryAnalyzer.class, dataProvider = "opportunityPage1Test", description = "Run - 2: I can select Save Report to save a set of filter criteria for reuse.", priority = 1)
	public void US12705_AT_Opportunities_Run2_CreateSavedReport(String premise, String distributor, String opporunityType, String reportName) {
		login = new Login(driver);
		if(!login.isUserLoggedIn()) {
			homePage = login.loginWithValidCredentials(ACTOR3_USER_NAME, ACTOR3_PASSWORD);
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

	@Test(retryAnalyzer = RetryAnalyzer.class, dependsOnMethods = "US12705_AT_Opportunities_Run2_CreateSavedReport", dataProvider = "opportunityPage1Test", description = "Run - 4: I can get from the Home page to the Opportunities Page using a Saved Filter available on the Home Page and find the opportunity results that correspond to the Home Page Search." , priority = 3)
	public void US12707_AT_Opportunities_Run4_HomePageSavedReport(String premise, String distributor, String opporunityType, String reportName){
		login = new Login(driver);
		if(!login.isUserLoggedIn()) {
			homePage = login.loginWithValidCredentials(ACTOR3_USER_NAME, ACTOR3_PASSWORD);
		}
		opportunitiesPage = homePage.selectSaveReportDropdown(reportName);

		assertThat("Premise filters is not selected", getFilterList(), log(hasItems(equalToIgnoringCase(premise))));
		assertThat("Distributor filters is not selected", getFilterList(), log(hasItems( startsWith(distributor))));
		assertThat("Opporunity Type filters is not selected", getFilterList(), log(hasItems(equalToIgnoringCase(opporunityType))));
	}

	@Test(retryAnalyzer = RetryAnalyzer.class, dependsOnMethods = "US12707_AT_Opportunities_Run4_HomePageSavedReport", dataProvider = "opportunityPage1Test", description = "Run - 3: I can edit or delete an existing Saved Report filter criteria and resave and I can ‘Reset’ my filter selection while working with filters." , priority = 2)
	public void US12706_AT_Opportunities_Run3_Edit_DeleteSavedReport(String premise, String distributor, String opporunityType, String reportName) {

		login = new Login(driver);
		if(!login.isUserLoggedIn()) {
			homePage = login.loginWithValidCredentials(ACTOR3_USER_NAME, ACTOR3_PASSWORD);
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


	/*@Test(dataProvider="opportunityPage2Test", description="US12829: I can add or remove opportunities to an existing Target List", priority=4)
	public void US12829_AT_TargetList_Add_RemoveOpportunities(String chain, String targetListName1, String newTargetList, String targetListName2) throws InterruptedException {
		login = new Login(driver);

		homePage = login.loginWithValidCredentials(ACTOR1_USER_NAME, ACTOR1_PASSWORD);

		targetListPage = homePage.navigateTargetList();
		Thread.sleep(10000);

		if (targetListPage.checkTargetNameExists(targetListName2)) {

			targetListPage.clickNewTargetList(targetListName2);

			if (targetListPage.getExpandAll().isEnabled()) {
				targetListPage.clickSelectAll();
				targetListPage.deleteOpportunity();
				Thread.sleep(2000);
				assertThat("Existing Opportunities deleted", !targetListPage.getExpandAll().isEnabled());
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

		if (opportunitiesPage.doesTargetListExist(targetListName1) && opportunitiesPage.doesTargetListExist(targetListName2)) {

			opportunitiesPage.selectDropdownFromTargetList(targetListName1);
			Thread.sleep(500);

			assertThat(opportunitiesPage.getOpputunitiesAddedConfirmToast(), log(containsString("Opportunity")));

			opportunitiesPage.selectFirstStore();
			// opportunitiesPage.selectFirstStore();
			opportunitiesPage.selectMultipleStore();
			opportunitiesPage.clickAddToTargetListButton();

			opportunitiesPage.selectDropdownFromTargetList(targetListName2);
			Thread.sleep(500);
			assertThat(opportunitiesPage.getOpputunitiesAddedConfirmToast(), log(containsString("Opportunities")));

			opportunitiesPage.pageRefresh();
			Thread.sleep(10000);
			targetListPage = opportunitiesPage.navigateToTargetList();
			Thread.sleep(10000);
			targetListPage.clickNewTargetList(targetListName1);
			targetListPage.selectFirstOpportunity();
			targetListPage.deleteOpportunity();
			Thread.sleep(1000);
			assertThat("All Opportunities Deleted ", !targetListPage.getRemoveOpportunity().isEnabled());

			targetListPage.reloadPage();
			targetListPage.navigateToTargetList();
			targetListPage.clickNewTargetList(targetListName2);
			targetListPage.clickExpandAll();
			Thread.sleep(2000);
		} else if (!opportunitiesPage.doesTargetListExist(targetListName1)) {
			assertThat("Target List Does not exists. Create Target List " + targetListName1, !opportunitiesPage.doesTargetListExist(targetListName1));
		} else if (!opportunitiesPage.doesTargetListExist(targetListName2)) {
			assertThat("Target List Does not exists. Create Target List " + targetListName2, !opportunitiesPage.doesTargetListExist(targetListName2));
		} else {
			assertThat("Target List Does not exists. Create Target List " + targetListName1 + " and " + targetListName2, !opportunitiesPage.doesTargetListExist(targetListName1));
		}

	}*/

	@DataProvider(name = "opportunityPage1Test")
	public static Object[][] data1() {
		return new Object[][] {
			{ "On-Premise","Coastal Bev Co-nc (wilmington)", "At Risk" ,"Chris On Coastal (Wil) At Risk 1"},
			//{ "Off-Premise","Coastal Bev Co-nc (wilmington)", "Non-Buy" ,"Chris Off Coastal (Wil) At Non-Buy 2"}
		};
	}

	@DataProvider(name="opportunityPage2Test")
	public static Object[][] data2(){
		return new Object[][]{{"Walmart","Automated Test Target List","Create New List","Automated Test Target List 2"}};
	}


	@AfterMethod
	public void signOut() {
		logout();
	}
}
