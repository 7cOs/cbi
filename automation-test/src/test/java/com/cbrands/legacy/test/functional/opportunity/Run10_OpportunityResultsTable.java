package com.cbrands.legacy.test.functional.opportunity;

import static org.hamcrest.CoreMatchers.containsString;
import static org.hamcrest.CoreMatchers.not;
import static org.hamcrest.MatcherAssert.assertThat;

import org.testng.Assert;
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
public class Run10_OpportunityResultsTable extends BaseSeleniumTestCase {

	@Test(retryAnalyzer = RetryAnalyzer.class, dataProvider="AT_Opportunities_Run10_OpportunityResultsTable")
	public void US12716_AT_Opportunities_Run10_OpportunityResultsTable(String distributorName,String retailStoreName1,String retailStoreName2) {

		// Test Step 10.1
		login = new Login(driver);
		if (!login.isUserLoggedIn()) {
			homePage = login.loginWithValidCredentials(ACTOR1_USER_NAME, ACTOR1_PASSWORD);
		}

		opportunitiesPage = homePage.navigateOpportunities();
		opportunitiesPage.selectAccountScope();
		opportunitiesPage.typeDistributor(distributorName);
		opportunitiesPage.clickApplyFilters();

		String allText = getAllTextFromPage();
		assertThat("Unable to find any opportunities that met your criteria.", allText, not(containsString("Dang! We were unable to find any opportunities that met your criteria.")));

		Assert.assertNotNull(opportunitiesPage.getColumnHeaderStoreNumber(), "Store/Number column header not present");
		Assert.assertNotNull(opportunitiesPage.getColumnHeaderAddress(), "Address header not present");
		Assert.assertNotNull(opportunitiesPage.getColumnHeaderOpportunitites(), "Opportunities column header not present");
		Assert.assertNotNull(opportunitiesPage.getColumnHeaderDepletionsCYTD(), "Depletions CYTD column header not present");
		Assert.assertNotNull(opportunitiesPage.getColumnHeaderVsYA(), "Vs YA% column header not present");
		Assert.assertNotNull(opportunitiesPage.getColumnHeaderSegmentation(), "Segmentation column header not present");
		Assert.assertNotNull(opportunitiesPage.getOpportunityFirstSearchResult(), "Opportunities Results not present");
		Assert.assertNotNull(opportunitiesPage.getSelectAllButton(), "'Select All' button not present");
		Assert.assertNotNull(opportunitiesPage.getExpandAllButton(), "'Expand All' button not present");
		Assert.assertNotNull(opportunitiesPage.getCollapseAllButton(), "'Collapse All' button not present");
		Assert.assertNotNull(opportunitiesPage.getAddToTargetListButton(), "'Add to Target List' button not present");
		Assert.assertNotNull(opportunitiesPage.getDeleteButton(), "'Delete' button not present");
		Assert.assertNotNull(opportunitiesPage.getDownloadButton(), "'Download' button not present");

		// Test Step 10.2
		opportunitiesPage.clickOpportunitySearchFirstResult();
		opportunitiesPage.clickOpportunitySearchFirstResult();
		opportunitiesPage.clickExpandAllButton();
		opportunitiesPage.clickCollapseAllButton();

		// Test Step 10.3
		Assert.assertNotNull(opportunitiesPage.getLevelTwoHeader(), "Level 2 header not present");
		Assert.assertNotNull(opportunitiesPage.getLevelOneRow(), "Level 2 row not present");

		// Test Step 10.4
		Assert.assertNotNull(opportunitiesPage.getBrandIconSet(), "Brand Icon set not present");
		Assert.assertNotNull(opportunitiesPage.getLevelTwoHeaderBar(), "Brand Icon set not present");

		// Test Step 10.5
		String expectedToolTipText = "Opportunity List vs YA % Monthly velocity for this account, calculated by taking the total volume over the selected time period (e.g. L90) and dividing by number of 30 day periods (3). “% vs YA” indicates the trend of velocity this year vs. same time period last year.";
		Assert.assertEquals(opportunitiesPage.velocityToolTipText(), expectedToolTipText);

		// Test Step 10.6
		opportunitiesPage.clickOpportunitySearchFirstResult();
		opportunitiesPage.clickLevelOneRow();
		opportunitiesPage.clickLevelOneRow();

		// Test Step 10.7 - removed

		// Test Step 10.8
/*		opportunitiesPage.pageRefresh();
		//opportunitiesPage.searchRetailerChainByName(retailStoreName2);
		opportunitiesPage.searchRetailerChain(retailStoreName2);
		opportunitiesPage.clickApplyFilters();

		allText = getAllTextFromPage();
		assertThat("Unable to find any opportunities that met your criteria.", allText, not(containsString("Dang! We were unable to find any opportunities that met your criteria.")));

		opportunitiesPage.clickFirstSearchResult();
		Assert.assertNotNull(opportunitiesPage.getYellowFlagIcon(), "Yellow Flag icon not present");
		opportunitiesPage.clickLevelOneRow();*/

	}

	@DataProvider(name="AT_Opportunities_Run10_OpportunityResultsTable")
	public static Object[][] data1(){
		return new Object[][]{{"Manhattan Beer Dist Llc - Ny (Suffern)","3808767","Walmart"}};
	}

	@AfterMethod
	public void signOut() {
		logout();
	}
}
