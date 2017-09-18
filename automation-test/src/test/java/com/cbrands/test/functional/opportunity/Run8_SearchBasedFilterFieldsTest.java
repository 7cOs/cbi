package com.cbrands.test.functional.opportunity;

import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.testng.Assert;
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
public class Run8_SearchBasedFilterFieldsTest extends BaseSeleniumTestCase {

	private SoftAssert softAssert = new SoftAssert();

	@Test(retryAnalyzer = RetryAnalyzer.class)
	public void US12715_AT_Opportunities_Run8_OpportunityTypeSearchFilterBehavior() {

		login = new Login(driver);
		if (!login.isUserLoggedIn()) {
			homePage = login.loginWithValidCredentials(ACTOR1_USER_NAME, ACTOR1_PASSWORD);
		}
		opportunitiesPage = homePage.navigateOpportunities();

		// Test Step 8.1
		opportunitiesPage.selectOpenOpportunityStatus();
		opportunitiesPage.clearFirstRemovableFilterPill();
		Assert.assertEquals(opportunitiesPage.getOpportunityStatusOpen().getAttribute("aria-checked"), "false", "'Open' filter option not removed");

		// Test Step 8.2
		opportunitiesPage.clickShowMoreFilter();
		Assert.assertEquals(opportunitiesPage.getBrandMasterSkuSearchBox().getAttribute("placeholder"), "Brand or SKU", "Helper text incorrect");
		opportunitiesPage.clickOnPremise();
		Assert.assertEquals(opportunitiesPage.getBrandPackageSearchBox().getAttribute("placeholder"), "Brand or Package", "Helper text incorrect");
		Assert.assertEquals(opportunitiesPage.getRetailerSearchBoxChain().getAttribute("placeholder"), "Account or Subaccount Name", "Helper text incorrect");
		opportunitiesPage.selectRetailerOptionStore();
		Assert.assertEquals(opportunitiesPage.getRetailerSearchBoxStore().getAttribute("placeholder"), "Name, Address, TDLinx", "Helper text incorrect");
		Assert.assertEquals(opportunitiesPage.getLocationSearchBox().getAttribute("placeholder"), "City or Zip", "Helper text incorrect");
		// The below step is to validate the helper text for CBBD Search box
		// field
		Assert.assertEquals(opportunitiesPage.getSearchBoxwithPlaceHolderValueName().get(1).getAttribute("placeholder"), "Name", "Helper text incorrect");

		// Test Step 8.3
		opportunitiesPage.clickOffPremise();

		// Test Step 8.4
		opportunitiesPage.clickOnPremise();


		// Test 8.7
		opportunitiesPage.clickOpportunityTypeDropdown();
		Assert.assertEquals(opportunitiesPage.getOpportunityTypeAllTypes().getAttribute("selected"), "true", "'All Types not selected by default'");
		opportunitiesPage.clickOpportunityType("Non-Buy");
		opportunitiesPage.clickOpportunityType("At Risk");
		opportunitiesPage.clickOpportunityType("Low Velocity");
		opportunitiesPage.clickOpportunityType("New Placement (Quality)");
		opportunitiesPage.clickOpportunityType("New Placement (No Rebuy)");
		opportunitiesPage.clickOpportunityType("Custom");
		opportunitiesPage.clickOpporunityTypeDone();
		Assert.assertNotNull(opportunitiesPage.getFilterPillNonBuy(), "'At Risk' filter pill not displaying");
		opportunitiesPage.clearFirstRemovableFilterPill();

		softAssert.assertAll();

	}

	@AfterMethod
	public void signOut() {
		logout();
	}

}
