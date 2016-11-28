package com.cbrands.test.functional.opportunity;

import java.util.List;

import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.testng.Assert;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.Test;

import com.cbrands.BaseSeleniumTestCase;
import com.cbrands.pages.Login;

public class Run6_OpportunitiesFilterTest extends BaseSeleniumTestCase{
	
	@Test
	public void AT_Opportunities_Run6_OpportunityFilters() {
		
		login = new Login(driver);
		if(!login.isUserLoggedIn()) { 
			homePage = login.loginWithValidCredentials(ACTOR1_USER_NAME, ACTOR1_PASSWORD);
		}

		//Test Step #6.1
		opportunitiesPage = homePage.navigateOpportunities();
		
		//Test Step #6.2
		opportunitiesPage.clickShowMoreFilter();
		opportunitiesPage.clickShowLessFilters();

		
		//Test Step #6.3
		Assert.assertNotNull(opportunitiesPage.filterPillMyAccountsOnly, "'My Accounts Only' filter pill is not present");
		Assert.assertNotNull(opportunitiesPage.filterPillOffPremise, "'Off-Premise' filter pill is not present");
		Assert.assertNotNull(opportunitiesPage.filterPillAllTypes, "'All Types' filter pill is not present");
		opportunitiesPage.selectOpenOpportunityStatus();
		opportunitiesPage.resetFilters();
		Assert.assertNotNull(opportunitiesPage.filterPillMyAccountsOnly, "'My Accounts Only' filter pill is not present");
		Assert.assertNotNull(opportunitiesPage.filterPillOffPremise, "'Off-Premise' filter pill is not present");
		Assert.assertNotNull(opportunitiesPage.filterPillAllTypes, "'All Types' filter pill is not present");
		
		
		//Test Step #6.4
		Assert.assertNotNull(opportunitiesPage.filterInstruction, "Fillter selection instruction is not displaying");
		opportunitiesPage.clickOffPremise();
		opportunitiesPage.searchRetailerChain("Walmart Supercenter");
		Assert.assertNotNull(opportunitiesPage.applyFilters, "'Apply Filter' button is not enabled");
		Assert.assertNotNull(opportunitiesPage.SaveReportLinkDisabled, "'Save Report' link is enabled");
		
		//Test Step 6.5
		Assert.assertNotNull(opportunitiesPage.distributor,"Distributor Search box not present");		
		Assert.assertNotNull(opportunitiesPage.accountScope,"Account Scope radio button not present");	
		Assert.assertNotNull(opportunitiesPage.opportunityStatusOpen,"Opportunity Status radio buttons not present");
		Assert.assertNotNull(opportunitiesPage.opportunityTypeDropDown,"Opportunity Type drop down not present");
		Assert.assertNotNull(opportunitiesPage.brandMasterSkuSearchBox,"Brand/SKU search box not present");
		Assert.assertNotNull(opportunitiesPage.storeTypeIndependentRadioButton,"Store Type radio buttons not present");
		
		//Test Step #6.6
		List<WebElement> allToolTips = driver.findElements(By.className("tooltip"));
		WebElement toolTip = allToolTips.get(0);
		String expectedTooTiptext = "Filter Set "+"Opportunity Type "+"Non-buy: No depletions within L90 AND reporting depletions at Similar Stores; for chain mandates, no depletions within L30 "+"At Risk: Reported depletions within L90 but not L60 "+"New Placement (Quality): First depletion within L60-90 AND has been reordered "+"New Placement (No Rebuy): First depletion within L60-90 AND has not been reordered "+"Low Velocity: Velocity in bottom 25% percentile vs. Similar Stores "+"Custom: Field-generated opportunity";
		Assert.assertEquals(toolTip.getAttribute("aria-label").replaceAll("\\s+", " "), expectedTooTiptext);
		
		//Test Step 6.7
		opportunitiesPage.clickShowMoreFilter();
		Assert.assertNotNull(opportunitiesPage.predictedImpactHigh,"Pedicted Impact radio buttons not present");
		Assert.assertNotNull(opportunitiesPage.productTypeAuthorized,"Product Type radio buttons not present");
		Assert.assertNotNull(opportunitiesPage.tradeChannelGrocery,"Store Segmentation radio buttons not present");
		Assert.assertNotNull(opportunitiesPage.storeSegmentationA,"Trade Channel radio buttons not present");
		Assert.assertNotNull(opportunitiesPage.locationSearchBox,"Location search box not present");
		Assert.assertNotNull(opportunitiesPage.stateDropDown,"'State' drop down not present");
		Assert.assertNotNull(opportunitiesPage.searchBoxwithPlaceHolderValueName.get(1),"CBBD Contact search box not present");
	
	  }
	
	@AfterMethod
	public void signOut() {
		logout();
	}

}