package com.cbrands.test.smoke;

import static net.javacrumbs.hamcrest.logger.HamcrestLoggerMatcher.log;
import static org.hamcrest.CoreMatchers.containsString;
import static org.hamcrest.CoreMatchers.not;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.equalToIgnoringCase;
import static org.hamcrest.Matchers.hasItems;

import org.openqa.selenium.By;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.annotations.DataProvider;
import org.testng.annotations.Test;

import com.cbrands.BaseSeleniumTestCase;
import com.cbrands.pages.Login;

public class SmokeTest_TestSuite1 extends BaseSeleniumTestCase {

	@Test(dataProvider = "findOpportunity", description = "Search for the opportunity on Home Page", priority = 1)
	public void findOpportunity(String Distributor) {
		login = new Login(driver);
		homePage = login.loginWithValidCredentials(ACTOR1_USER_NAME, ACTOR1_PASSWORD);
		homePage.typeDistributor(Distributor);
		opportunitiesPage = homePage.submitFindOpportunities();

		assertThat(getFilterList(), log(hasItems(equalToIgnoringCase(Distributor))));

	}

	@Test(dataProvider = "addFilter", description = "Add filters for Opportunity Type = 'Non-Buy' and Status = Open", priority = 2)
	public void addfilterForOpportunityType(String type, String status) {
		opportunitiesPage.selectOpporunityType(type);

		if (status.equals("Open")) {
			opportunitiesPage.selectOpenOpportunityStatus();
		}

		opportunitiesPage.clickApplyFilters();

		assertThat(getFilterList(), log(hasItems(equalToIgnoringCase(type))));
		assertThat(getFilterList(), log(hasItems(equalToIgnoringCase(status))));
		
	}

	@Test(dataProvider = "reportName", description = "Save Report as Smoke Test", priority = 3)
	public void saveReport(String reportName) throws InterruptedException{
		opportunitiesPage.clickSaveReport();
		opportunitiesPage.typeSaveReportName(reportName);
		opportunitiesPage.clickDialogSaveReport();
	
		Thread.sleep(300);
		
	}

	@Test(dataProvider = "sendOpportunityData", description = "Send Opportunity", priority = 4)
	public void sendOpportunity(String sendTo, String sent)throws InterruptedException {
		opportunitiesPage.clickOpportunitySearchFirstResult();
		opportunitiesPage.clickExpandAllButton();
		Thread.sleep(300);
		opportunitiesPage.sendOpportunityTo(sendTo);
		Thread.sleep(300);
		assertThat(opportunitiesPage.getOpportunitySent(),log(containsString(sent)));
		opportunitiesPage.reloadPage();
	}

	@Test(dataProvider = "targetData", description = "Create a new Target List", priority = 5)
	public void createTargetList(String name, String description, String collaborator) throws InterruptedException {
		
		targetListPage = opportunitiesPage.navigateToTargetList();
		targetListPage.clickCreateNewList();
		targetListPage.clickCreateNewListModal();
		Thread.sleep(300);
		targetListPage.typeTargetName(name);
		targetListPage.typeDescription(description);
		targetListPage.addCollaborator(collaborator);
		targetListPage.clickTargetSave();
		targetListPage.reloadPage();
		targetListPage.clickNewTargetList(name);
		
		targetListPage.getTargetList(name);
		
		targetListPage.clickManage();
		targetListPage.clickCollaborator();
		targetListPage.removeCollaborator();
		Thread.sleep(1000);
		targetListPage.clickManage();
		targetListPage.deleteTargetList();
		
		assertThat(targetListPage.getTargetListName(), log(containsString(name)));
		assertThat(targetListPage.getSuccessMessage(),log(containsString("Success")));
	
		targetListPage.reloadPage();
	}
	
	@Test(dataProvider="deleteReport", description="Delete Saved Report", priority=6)
	public void deleteSaveReport(String reportName) throws InterruptedException{
		opportunitiesPage = targetListPage.navigateToOpportunities();
		opportunitiesPage.deleteSaveReportDropdownByName(reportName);
		opportunitiesPage.clickDeleteReportBtn();
		Thread.sleep(500);
		assertThat("Report Deleted ", !opportunitiesPage.getListForSaveReport().contains(reportName));
			
	}
	

	public void signOut() {
		logout();
	}
	
	@DataProvider(name = "findOpportunity")
	public static Object[][] data() {

		return new Object[][] { { "Harbor Dist Llc - Ca (Sylmar)" } };
	}

	@DataProvider(name = "addFilter")
	public static Object[][] data1() {
		return new Object[][] { { "Non-Buy", "Open" } };
	}

	@DataProvider(name = "reportName")
	public static Object[][] data2() {
		return new Object[][] { { "Smoke Test"} };
	}

	@DataProvider(name = "sendOpportunityData")
	public static Object[][] data3() {
		return new Object[][] { { "Stanley Rowley","Opportunity Sent!" } };
	}

	@DataProvider(name = "targetData")
	public static Object[][] data4() {
		return new Object[][] { { "Smoke Test", "test", "Stanley Rowley" } };
	}
	
	@DataProvider(name = "deleteReport")
	public static Object[][] data5(){
		return new Object[][]{{"Smoke Test"}};
	}
	
	
}

