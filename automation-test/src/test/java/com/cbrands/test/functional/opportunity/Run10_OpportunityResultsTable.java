package com.cbrands.test.functional.opportunity;

import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.testng.Assert;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.Test;

import com.cbrands.BaseSeleniumTestCase;
import com.cbrands.pages.Login;

public class Run10_OpportunityResultsTable extends BaseSeleniumTestCase {

	@Test
	public void AT_Opportunities_Run10_OpportunityResultsTable() {

		// Test Step 10.1
		login = new Login(driver);
		if (!login.isUserLoggedIn()) {
			homePage = login.loginWithValidCredentials(ACTOR1_USER_NAME, ACTOR1_PASSWORD);
		}

		opportunitiesPage = homePage.navigateOpportunities();
		opportunitiesPage.selectAccountScope();
		opportunitiesPage.typeDistributor("Manhattan Beer Dist Llc - Ny (Suffern)");
		opportunitiesPage.clickApplyFilters();
		Assert.assertNotNull(opportunitiesPage.columnHeaderStoreNumber, "Store/Number column header not present");
		Assert.assertNotNull(opportunitiesPage.columnHeaderAddress, "Address header not present");
		Assert.assertNotNull(opportunitiesPage.columnHeaderOpportunitites, "Opportunities column header not present");
		Assert.assertNotNull(opportunitiesPage.columnHeaderDepletionsCYTD, "Depletions CYTD column header not present");
		Assert.assertNotNull(opportunitiesPage.columnHeaderVsYA, "Vs YA% column header not present");
		Assert.assertNotNull(opportunitiesPage.columnHeaderSegmentation, "Segmentation column header not present");
		Assert.assertNotNull(driver.findElements(By.cssSelector("v-pane-header[class='checkbox-sibling ng-isolate-scope']")).get(0), "Opportunities Results not present");
		Assert.assertNotNull(opportunitiesPage.selectAllButton, "'Select All' button not present");
		Assert.assertNotNull(opportunitiesPage.expandAllButton, "'Expand All' button not present");
		Assert.assertNotNull(opportunitiesPage.collapseAllButton, "'Collapse All' button not present");
		Assert.assertNotNull(opportunitiesPage.addToTargetListButton, "'Add to Target List' button not present");
		Assert.assertNotNull(opportunitiesPage.deleteButton, "'Delete' button not present");
		Assert.assertNotNull(opportunitiesPage.downloadButton, "'Download' button not present");

		// Test Step 10.2
		opportunitiesPage.clickOpportunitySearchFirstResult();
		opportunitiesPage.clickOpportunitySearchFirstResult();
		opportunitiesPage.clickExpandAllButton();
		opportunitiesPage.clickCollapseAllButton();

		// Test Step 10.3
		WebElement levelTwoHeader = driver.findElement(By.cssSelector("div[class='title-row ng-scope']"));
		Assert.assertNotNull(levelTwoHeader, "Level 2 header not present");
		WebElement levelOneRow = driver.findElements(By.cssSelector("div[class='cell-parent sub-item ng-scope']")).get(0);
		Assert.assertNotNull(levelOneRow, "Level 2 row not present");

		// Test Step 10.4
		WebElement brandIconSet = driver.findElement(By.cssSelector("div[class='pad-cell brand-icons']"));
		Assert.assertNotNull(brandIconSet, "Brand Icon set not present");
		WebElement levelTwoHeaderBar = driver.findElement(By.cssSelector("div[class='hero-row']"));
		Assert.assertNotNull(levelTwoHeaderBar, "Level 2 header bar not present");

		// Test Step 10.5
		WebElement velocityToolTip = driver.findElements(By.cssSelector("div.toolTip")).get(1);

		String expectedToolTipText = "Opportunity List vs YA % Monthly velocity for this account, calculated by taking the total volume over the selected time period (e.g. L90) and dividing by number of 30 day periods (3). “% vs YA” indicates the trend of velocity this year vs. same time period last year.";
		Assert.assertEquals(velocityToolTip.getAttribute("aria-label").replaceAll("\\s+", " "), expectedToolTipText);

		// Test Step 10.6
		driver.findElements(By.cssSelector("v-pane-header[class='checkbox-sibling ng-isolate-scope']")).get(0).click();
		levelOneRow.click();
		WebElement levelTwoRow = driver.findElements(By.cssSelector("div[class='cell-parent sub-item ng-scope']")).get(0);
		levelTwoRow.click();

		// Test Step 10.7
		opportunitiesPage.resetFilters();
		opportunitiesPage.pageRefresh();
		opportunitiesPage.switchPremiseToOn();
		opportunitiesPage.selectRetailerOptionStore2();
		opportunitiesPage.searchRetailerStore("5597701");
		opportunitiesPage.searchBrandPackage("Corona Extra-12 Ounce (Beer)-Can(s)");
		opportunitiesPage.selectAccountScope();
		opportunitiesPage.clickShowMoreFilter();
		opportunitiesPage.selectProductTypeFeatured();
		opportunitiesPage.clickApplyFilters_run10();
/*		WebElement opportunitiesTableFirstResult2 = driver.findElements(By.cssSelector("v-pane-header[class='checkbox-sibling ng-isolate-scope']")).get(0);
		opportunitiesTableFirstResult2.click();*/
		opportunitiesPage.clickFirstSearchResult();
		Assert.assertNotNull(opportunitiesPage.greenFlagIcon, "Green Flag icon not present");
		WebElement levelOneRow2 = driver.findElements(By.cssSelector("div[class='cell-parent sub-item ng-scope']")).get(0);
		levelOneRow2.click();
		opportunitiesPage.clickFeatureType();
		Assert.assertNotNull(opportunitiesPage.secondaryModal, "Secondary Modal not displaying");
		opportunitiesPage.closeSecondaryModal();

		// Test Step 10.8
		opportunitiesPage.resetFilters();
		opportunitiesPage.pageRefresh();
		opportunitiesPage.selectRetailerOptionStore2();
		opportunitiesPage.searchRetailerStore("0127138");
		opportunitiesPage.searchBrandSKU("Corona Ex 12pk Can");
		opportunitiesPage.selectAccountScope_run10();
		opportunitiesPage.clickApplyFilters();
/*		WebElement opportunitiesTableFirstResult3 = driver.findElements(By.cssSelector("v-pane-header[class='checkbox-sibling ng-isolate-scope']")).get(0);
		opportunitiesTableFirstResult3.click();*/
		opportunitiesPage.clickFirstSearchResult();
		Assert.assertNotNull(opportunitiesPage.yellowFlagIcon, "Yellow Flag icon not present");
		WebElement levelOneRow3 = driver.findElements(By.cssSelector("div[class='cell-parent sub-item ng-scope']")).get(0);
		levelOneRow3.click();
		opportunitiesPage.clickFeatureType();
		Assert.assertNotNull(opportunitiesPage.secondaryModal, "Secondary Modal not displaying");
		opportunitiesPage.closeSecondaryModal();

	}

	@AfterMethod
	public void signOut() {
		logout();
	}
}
