package com.cbrands.test.functional.opportunity;

import org.testng.annotations.AfterMethod;
import org.testng.annotations.Test;
import org.testng.asserts.SoftAssert;

import com.cbrands.BaseSeleniumTestCase;
import com.cbrands.pages.Login;

public class Run7_OpportunitiesFilterValues extends BaseSeleniumTestCase {

	private SoftAssert softAssert = new SoftAssert();

	@Test
	public void AT_Opportunities_Run7_FilterFields() {

		login = new Login(driver);
		if (!login.isUserLoggedIn()) {
			homePage = login.loginWithValidCredentials(ACTOR1_USER_NAME, ACTOR1_PASSWORD);
		}
		opportunitiesPage = homePage.navigateOpportunities();

		// Test Step #7.1
		softAssert.assertEquals(opportunitiesPage.offPremise.getAttribute("aria-checked"), "true");
		softAssert.assertNotNull(opportunitiesPage.filterPillOffPremise, "'Off-Premise' filter pill is not present");
		opportunitiesPage.clickOnPremise();
		softAssert.assertNotNull(opportunitiesPage.filterPillOnPremise, "'On-Premise' filter pill is not present");

		// Test Step #7.2
		opportunitiesPage.clickShowMoreFilter();
		opportunitiesPage.selectOpenOpportunityStatus();
		softAssert.assertNotNull(opportunitiesPage.filterPillOpen, "'Open' filter pill is not present");
		opportunitiesPage.selectTargetedOpportunityStatus();
		softAssert.assertNotNull(opportunitiesPage.filterPillTargeted, "'Targeted' filter pill is not present");
		opportunitiesPage.selectPredictedImpactHigh();
		softAssert.assertNotNull(opportunitiesPage.filterPillHighImpact, "'High Impact' filter pill is not present");
		opportunitiesPage.selectPredictedImpactMedium();
		softAssert.assertNotNull(opportunitiesPage.filterPillMediumImpact, "'Medium Impact' filter pill is not present");
		opportunitiesPage.selectPredictedImpactLow();
		softAssert.assertNotNull(opportunitiesPage.filterPillLowImpact, "'Low Impact' filter pill is not present");
		opportunitiesPage.selectProductTypeFeatured();
		softAssert.assertNotNull(opportunitiesPage.filterPillFeatured, "'Featured' filter pill is not present");
		opportunitiesPage.selectProductTypePriorityPackages();
		softAssert.assertNotNull(opportunitiesPage.filterPillPriorityPackages, "'Priority Packages' filter pill is not present");
		opportunitiesPage.selectProductTypeAuthorized();
		// opportunitiesPage.clickOffPremise();
		opportunitiesPage = opportunitiesPage.pageRefresh();
		opportunitiesPage.clickShowMoreFilter();
		// opportunitiesPage.clickOffPremise_run7();
		opportunitiesPage.selectTradeChannelGrocery();
		softAssert.assertNotNull(opportunitiesPage.filterPillGrocery, "'Grcoery' filter pill is not present");
		opportunitiesPage.selectTradeChannelDrug();
		softAssert.assertNotNull(opportunitiesPage.filterPillDrug, "'Drug' filter pill is not present");
		opportunitiesPage.selectTradeChannelLiquor();
		softAssert.assertNotNull(opportunitiesPage.filterPillLiquor, "'Liquor' filter pill is not present");
		opportunitiesPage.selectTradeChannelRecreation();
		softAssert.assertNotNull(opportunitiesPage.filterPillRecreation, "'Liquor' filter pill is not present");
		opportunitiesPage.selectTradeChannelConvenience();
		softAssert.assertNotNull(opportunitiesPage.filterPillConvenience, "'Convenience' filter pill is not present");
		opportunitiesPage.selectTradeChannelMassMerchandiser();
		softAssert.assertNotNull(opportunitiesPage.filterPillMassMerchandiser, "'Mass Merchandiser' filter pill is not present");
		opportunitiesPage.selectTradeChannelMilitary();
		softAssert.assertNotNull(opportunitiesPage.filterPillMilitary, "'Military' filter pill is not present");
		opportunitiesPage.selectTradeChannelOther();
		softAssert.assertNotNull(opportunitiesPage.filterPillOtherTradeChannel, "'Other Trade Channel' filter pill is not present");

		opportunitiesPage.selectStoreTypeIndependent();
		softAssert.assertNotNull(opportunitiesPage.filterPillIndependent, "'Independent' filter pill is not present");
		opportunitiesPage.selectStoreTypeCBBDCHAIN();
		softAssert.assertNotNull(opportunitiesPage.filterPillCbbdChain, "'CBBD Chain' filter pill is not present");

		opportunitiesPage.selectStoreSegmentationA();
		softAssert.assertNotNull(opportunitiesPage.filterPillSegmentA, "'Segment A' filter pill is not present");
		opportunitiesPage.selectStoreSegmentationB();
		softAssert.assertNotNull(opportunitiesPage.filterPillSegmentB, "'Segment B' filter pill is not present");
		opportunitiesPage.selectStoreSegmentationC();
		softAssert.assertNotNull(opportunitiesPage.filterPillSegmentC, "'Segment C' filter pill is not present");

		// Test Step #7.3 - This step may be hard to maintain, may need to pull
		// out from the automated test
		opportunitiesPage.clearFirstRemovableFilterPill();
		softAssert.assertEquals(opportunitiesPage.opportunityStatusOpen.getAttribute("aria-checked"), "false", "'Open' filter option not removed");

		// Test Step #7.4
		opportunitiesPage.clickOnPremise();
		softAssert.assertNotNull(opportunitiesPage.tradeChannelDining, "Trade Channel option 'Dining' not present");
		softAssert.assertNotNull(opportunitiesPage.tradeChannelRecreation, "Trade Channel option 'Recreation' not present");
		softAssert.assertNotNull(opportunitiesPage.tradeChannelTransportation, "Trade Channel option 'Transportation' not present");
		softAssert.assertNotNull(opportunitiesPage.tradeChannelOther, "Trade Channel option 'Other' not present");
		softAssert.assertNotNull(opportunitiesPage.tradeChannelBar, "Trade Channel option 'Bar' not present");
		softAssert.assertNotNull(opportunitiesPage.tradeChannelLodging, "Trade Channel option 'Lodging' not present");
		softAssert.assertNotNull(opportunitiesPage.tradeChannelMilitary, "Trade Channel option 'Military' not present");

		// Test Step #7.5 - Covered in previous steps

		softAssert.assertAll();

	}

	@AfterMethod
	public void signOut() {
		logout();
	}
}
