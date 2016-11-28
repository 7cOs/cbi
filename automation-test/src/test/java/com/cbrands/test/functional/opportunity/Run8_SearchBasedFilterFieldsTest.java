package com.cbrands.test.functional.opportunity;

import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.testng.Assert;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.Test;
import org.testng.asserts.SoftAssert;

import com.cbrands.BaseSeleniumTestCase;
import com.cbrands.pages.Login;

public class Run8_SearchBasedFilterFieldsTest extends BaseSeleniumTestCase {

	private SoftAssert softAssert = new SoftAssert();

	@Test
	public void AT_Opportunities_Run8_OpportunitytypeSearchFilterBehavior() {

		login = new Login(driver);
		if (!login.isUserLoggedIn()) {
			homePage = login.loginWithValidCredentials(ACTOR1_USER_NAME, ACTOR1_PASSWORD);
		}
		opportunitiesPage = homePage.navigateOpportunities();

		// Test Step 8.1
		opportunitiesPage.selectOpenOpportunityStatus();
		opportunitiesPage.clearFirstRemovableFilterPill();
		Assert.assertEquals(opportunitiesPage.opportunityStatusOpen.getAttribute("aria-checked"), "false", "'Open' filter option not removed");

		// Test Step 8.2
		opportunitiesPage.clickShowMoreFilter();
		Assert.assertEquals(opportunitiesPage.brandMasterSkuSearchBox.getAttribute("placeholder"), "Brand or SKU", "Helper text incorrect");
		opportunitiesPage.clickOnPremise();
		Assert.assertEquals(opportunitiesPage.brandPackageSearchBox.getAttribute("placeholder"), "Brand or Package", "Helper text incorrect");
		Assert.assertEquals(opportunitiesPage.retailerSearchBoxChain.getAttribute("placeholder"), "Account or Subaccount Name", "Helper text incorrect");
		opportunitiesPage.selectRetailerOptionStore();
		Assert.assertEquals(opportunitiesPage.retailerSearchBoxStore.getAttribute("placeholder"), "Name, Address, TDLinx, or Store#", "Helper text incorrect");
		Assert.assertEquals(opportunitiesPage.locationSearchBox.getAttribute("placeholder"), "City or Zip", "Helper text incorrect");
		// The below step is to validate the helper text for CBBD Search box
		// field
		Assert.assertEquals(opportunitiesPage.searchBoxwithPlaceHolderValueName.get(1).getAttribute("placeholder"), "Name", "Helper text incorrect");

		// Test Step 8.3
		opportunitiesPage.clickOffPremise();
		// Commenting the below step, as we have no way to validate brands vs
		// SKU in search results, through the front end
		/*
		 * List<WebElement> brandSearchResults =
		 * opportunitiesPage.BrandSKUSearchResults("Corona"); for (int x =
		 * brandSearchResults.size()-1; x>0; x = x-1 ){
		 * softAssert.assertFalse(brandSearchResults.get(x).getText().contains(
		 * "oz"), "Brand Search Results contain packages;");
		 * 
		 * }
		 */

		// Test Step 8.4
		opportunitiesPage.clickOnPremise();
		//// Commenting the below step, as we have no way to validate brands vs
		//// SKU in search results, through the front end
		/*
		 * List<WebElement> packageSearchResults =
		 * opportunitiesPage.BrandPackageSearchResults("Corona"); for (int x =
		 * packageSearchResults.size()-1; x>0; x = x-1 ){
		 * Assert.assertFalse(packageSearchResults.get(x).getText().contains(
		 * "pk"), "Brand Search Results contain packages;"); }
		 */

		// Test 8.7
		opportunitiesPage.clickOpportunityTypeDropdown();
		Assert.assertEquals(opportunitiesPage.opportunityTypeAllTypes.getAttribute("selected"), "true", "'All Types not selected by default'");
		opportunitiesPage.clickOpporunityType("Non-Buy");
		opportunitiesPage.clickOpporunityType("At Risk");
		opportunitiesPage.clickOpporunityType("Low Velocity");
		opportunitiesPage.clickOpporunityType("New Placement (Quality)");
		opportunitiesPage.clickOpporunityType("New Placement (No Rebuy)");
		opportunitiesPage.clickOpporunityType("Custom");
		opportunitiesPage.clickOpporunityTypeDone();
		Assert.assertNotNull(opportunitiesPage.filterPillNonBuy, "'At Risk' filter pill not displaying");
		opportunitiesPage.clearFirstRemovableFilterPill();
		WebElement HomeLink = driver.findElement(By.xpath("//a[contains(.,'Home')]"));
		HomeLink.click();
		homePage = opportunitiesPage.navigateToHome();
		homePage.clickOpportunityTypeDropdown();
		Assert.assertEquals(homePage.opportunityTypeAllTypes.getAttribute("selected"), "true", "'All Types not selected by default'");
		homePage.clickOpporunityType("Non-Buy");
		homePage.clickOpporunityType("At Risk");
		homePage.clickOpporunityType("Low Velocity");
		homePage.clickOpporunityType("New Placement (Quality)");
		homePage.clickOpporunityType("New Placement (No Rebuy)");
		homePage.clickOpporunityType("Custom");

		softAssert.assertAll();

	}

	@AfterMethod
	public void signOut() {
		logout();
	}

}
