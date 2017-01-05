package com.cbrands.test.smoke;

import static net.javacrumbs.hamcrest.logger.HamcrestLoggerMatcher.log;
import static org.hamcrest.CoreMatchers.containsString;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.equalToIgnoringCase;
import static org.hamcrest.Matchers.hasItems;

import org.testng.annotations.DataProvider;
import org.testng.annotations.Test;

import com.cbrands.BaseSeleniumTestCase;
import com.cbrands.helper.RetryAnalyzer;
import com.cbrands.pages.Login;

public class SmokeTest_TestSuite1 extends BaseSeleniumTestCase {
	
	static String current_time_stamp = new java.text.SimpleDateFormat("MM.dd.yyyy HH:mm:ss").format(new java.util.Date());

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

	@Test(retryAnalyzer=RetryAnalyzer.class,dataProvider = "reportName", description = "Save Report as Smoke Test", priority = 3)
	public void saveReport(String reportName) throws InterruptedException{
		opportunitiesPage.clickSaveReport();
		opportunitiesPage.typeSaveReportName(reportName);
		opportunitiesPage.clickDialogSaveReport();
	
		Thread.sleep(300);
		
	}

	@Test(retryAnalyzer=RetryAnalyzer.class,dataProvider = "sendOpportunityData", description = "Send Opportunity", priority = 4)
	public void sendOpportunity(String sendTo, String sent)throws InterruptedException {
		opportunitiesPage.clickOpportunitySearchFirstResult();
		opportunitiesPage.clickExpandAllButton();
		Thread.sleep(300);
		opportunitiesPage.sendOpportunityTo(sendTo);
		Thread.sleep(500);
		assertThat(opportunitiesPage.getOpportunitySent(),log(containsString(sent)));
		opportunitiesPage.reloadPage();
	}
	
	@Test(retryAnalyzer=RetryAnalyzer.class,dataProvider="deleteReport", description="Delete Saved Report", priority=5)
	public void deleteSaveReport(String reportName) throws InterruptedException{
		//opportunitiesPage = targetListPage.navigateToOpportunities();
		//Thread.sleep(2000);
		opportunitiesPage.deleteSaveReportDropdownByName(reportName);
		opportunitiesPage.clickDeleteReportBtn();
		Thread.sleep(500);
		assertThat("Report Deleted ", !opportunitiesPage.getListForSaveReport().contains(reportName));
		signOut();
	}

	@Test(retryAnalyzer=RetryAnalyzer.class,dataProvider = "targetData", description = "Create a new Target List", priority = 6)
	public void createTargetList(String name, String description, String collaborator) throws InterruptedException {
		login = new Login(driver);
		homePage = login.loginWithValidCredentials(ACTOR1_USER_NAME, ACTOR1_PASSWORD);
		targetListPage = homePage.navigateTargetList();
		Thread.sleep(10000);
		targetListPage.clickCreateNewList();
		targetListPage.clickCreateNewListModal();
		Thread.sleep(300);
		targetListPage.typeTargetName(name);
		targetListPage.typeDescription(description);
		targetListPage.addCollaborator(collaborator);
		targetListPage.clickTargetSave();
		Thread.sleep(3000);
		targetListPage.clickNewTargetList(name);
		Thread.sleep(3000);
		
		targetListPage.clickManage();
		Thread.sleep(1000);
		targetListPage.clickCollaborator();
		targetListPage.removeCollaborator();
		Thread.sleep(1000);
		targetListPage.clickManage();
		targetListPage.deleteTargetList();
		
		
		assertThat(targetListPage.getSuccessMessage(),log(containsString("Success")));
		assertThat(targetListPage.getTargetListName(), log(containsString(name)));
	
		targetListPage.reloadPage();
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
		return new Object[][] { { "Smoke Test "+current_time_stamp} };
	}

	@DataProvider(name = "sendOpportunityData")
	public static Object[][] data3() {
		return new Object[][] { { "Stanley Rowley","Opportunity Sent!" } };
	}

	@DataProvider(name = "targetData")
	public static Object[][] data4() {
		return new Object[][] { { "Smoke Test "+current_time_stamp, "test", "Stanley Rowley" } };
	}
	
	@DataProvider(name = "deleteReport")
	public static Object[][] data5(){
		return new Object[][]{{"Smoke Test "+current_time_stamp}};
	}
}

