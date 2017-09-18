package com.cbrands.test.functional.legacy.opportunity;

import org.testng.annotations.AfterMethod;
import org.testng.annotations.Test;
import org.testng.asserts.SoftAssert;

import com.cbrands.BaseSeleniumTestCase;
import com.cbrands.helper.RetryAnalyzer;
import com.cbrands.pages.Login;

/**
 * @deprecated Legacy functional test removed from the functional suite. No longer working due to login/logout being
 * wrong. Saved for reference only. Should be deleted as soon as there is a new test to replace it.
 */
@Deprecated
public class Run7_OpportunitiesFilterValues extends BaseSeleniumTestCase {

	private SoftAssert softAssert = new SoftAssert();

	@Test(retryAnalyzer = RetryAnalyzer.class)
	public void US12714_AT_Opportunities_Run7_FilterFields() {

		login = new Login(driver);
		if (!login.isUserLoggedIn()) {
			homePage = login.loginWithValidCredentials(ACTOR1_USER_NAME, ACTOR1_PASSWORD);
		}
		opportunitiesPage = homePage.navigateOpportunities();

		// Test Step #7.1
		softAssert.assertEquals(opportunitiesPage.offPremise.getAttribute("aria-checked"), "true");
		softAssert.assertNotNull(opportunitiesPage.getFilterPillOffPremise(), "'Off-Premise' filter pill is not present");
		opportunitiesPage.clickOnPremise();
		softAssert.assertNotNull(opportunitiesPage.getFilterPillOnPremise(), "'On-Premise' filter pill is not present");

		// Test Step #7.2
		opportunitiesPage.clickShowMoreFilter();
		opportunitiesPage.selectOpenOpportunityStatus();
		softAssert.assertNotNull(opportunitiesPage.getFilterPillOpen(), "'Open' filter pill is not present");
		opportunitiesPage.selectTargetedOpportunityStatus();
		softAssert.assertNotNull(opportunitiesPage.getFilterPillTargeted(), "'Targeted' filter pill is not present");
		opportunitiesPage.selectPredictedImpactHigh();
		softAssert.assertNotNull(opportunitiesPage.getFilterPillHighImpact(), "'High Impact' filter pill is not present");
		opportunitiesPage.selectPredictedImpactMedium();
		softAssert.assertNotNull(opportunitiesPage.getFilterPillMediumImpact(), "'Medium Impact' filter pill is not present");
		opportunitiesPage.selectPredictedImpactLow();
		softAssert.assertNotNull(opportunitiesPage.getFilterPillLowImpact(), "'Low Impact' filter pill is not present");
		opportunitiesPage.selectProductTypeFeatured();
		softAssert.assertNotNull(opportunitiesPage.getFilterPillFeatured(), "'Featured' filter pill is not present");
		opportunitiesPage.selectProductTypePriorityPackages();
		softAssert.assertNotNull(opportunitiesPage.getFilterPillPriorityPackages(), "'Priority Packages' filter pill is not present");
		opportunitiesPage.selectProductTypeAuthorized();
		opportunitiesPage = opportunitiesPage.pageRefresh();
		opportunitiesPage.clickShowMoreFilter();
		//opportunitiesPage.selectTradeChannelGrocery();
		//softAssert.assertNotNull(opportunitiesPage.getFilterPillGrocery(), "'Grcoery' filter pill is not present");
		opportunitiesPage.selectTradeChannelDrug();
		softAssert.assertNotNull(opportunitiesPage.getFilterPillDrug(), "'Drug' filter pill is not present");
		opportunitiesPage.selectTradeChannelLiquor();
		softAssert.assertNotNull(opportunitiesPage.getFilterPillLiquor(), "'Liquor' filter pill is not present");
		opportunitiesPage.selectTradeChannelWholeSaleClub();
		softAssert.assertNotNull(opportunitiesPage.getFilterPillWholesaleClub(), "'Liquor' filter pill is not present");
		opportunitiesPage.selectTradeChannelConvenience();
		softAssert.assertNotNull(opportunitiesPage.getFilterPillConvenience(), "'Convenience' filter pill is not present");
		opportunitiesPage.selectTradeChannelMassMerchandiser();
		softAssert.assertNotNull(opportunitiesPage.getFilterPillMassMerchandiser(), "'Mass Merchandiser' filter pill is not present");
		opportunitiesPage.selectTradeChannelMilitary();
		softAssert.assertNotNull(opportunitiesPage.getFilterPillMilitary(), "'Military' filter pill is not present");
		opportunitiesPage.selectTradeChannelOther();
		softAssert.assertNotNull(opportunitiesPage.getFilterPillOtherTradeChannel(), "'Other Trade Channel' filter pill is not present");

		opportunitiesPage.selectStoreTypeIndependent();
		softAssert.assertNotNull(opportunitiesPage.getFilterPillIndependent(), "'Independent' filter pill is not present");
		opportunitiesPage.selectStoreTypeCBBDCHAIN();
		softAssert.assertNotNull(opportunitiesPage.getFilterPillCbbdChain(), "'CBBD Chain' filter pill is not present");

		opportunitiesPage.selectStoreSegmentationA();
		softAssert.assertNotNull(opportunitiesPage.getFilterPillSegmentA(), "'Segment A' filter pill is not present");
		opportunitiesPage.selectStoreSegmentationB();
		softAssert.assertNotNull(opportunitiesPage.getFilterPillSegmentB(), "'Segment B' filter pill is not present");
		opportunitiesPage.selectStoreSegmentationC();
		softAssert.assertNotNull(opportunitiesPage.getFilterPillSegmentC(), "'Segment C' filter pill is not present");

		// Test Step #7.3
		opportunitiesPage.clearFirstRemovableFilterPill();
		softAssert.assertEquals(opportunitiesPage.getOpportunityStatusOpen().getAttribute("aria-checked"), "false", "'Open' filter option not removed");

		// Test Step #7.4
		opportunitiesPage.clickOnPremise();
		softAssert.assertNotNull(opportunitiesPage.getTradeChannelDining(), "Trade Channel option 'Dining' not present");
		softAssert.assertNotNull(opportunitiesPage.getTradeChannelRecreation(), "Trade Channel option 'Recreation' not present");
		softAssert.assertNotNull(opportunitiesPage.getTradeChannelTransportation(), "Trade Channel option 'Transportation' not present");
		softAssert.assertNotNull(opportunitiesPage.getTradeChannelOther(), "Trade Channel option 'Other' not present");
		softAssert.assertNotNull(opportunitiesPage.getTradeChannelBar(), "Trade Channel option 'Bar' not present");
		softAssert.assertNotNull(opportunitiesPage.getTradeChannelLodging(), "Trade Channel option 'Lodging' not present");
		softAssert.assertNotNull(opportunitiesPage.getTradeChannelMilitary(), "Trade Channel option 'Military' not present");

		// Test Step #7.5 - Covered in previous steps

		softAssert.assertAll();

	}

	@AfterMethod
	public void signOut() {
		logout();
	}
}
