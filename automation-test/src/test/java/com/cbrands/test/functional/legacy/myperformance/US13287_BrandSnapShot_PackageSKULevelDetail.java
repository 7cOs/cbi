package com.cbrands.test.functional.legacy.myperformance;

import org.testng.Assert;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.DataProvider;
import org.testng.annotations.Test;

import com.cbrands.BaseSeleniumTestCase;
import com.cbrands.helper.RetryAnalyzer;
import com.cbrands.pages.Login;

/**
 * @deprecated Legacy functional test removed from the functional suite. No longer working due to login/logout being
 * wrong. Saved for reference only. Should be deleted as soon as there is a new test to replace it.
 */
@Deprecated
public class US13287_BrandSnapShot_PackageSKULevelDetail extends BaseSeleniumTestCase{
  @Test(retryAnalyzer = RetryAnalyzer.class, dataProvider="AT_US13287_BrandSnapShot_PackageSKULevelDetail")
  public void US13287_AT_BrandSnapshot_Package_SKULevelDetail(String brandName) {
	  login = new Login(driver);
		if(!login.isUserLoggedIn()) {
			homePage = login.loginWithValidCredentials(ACTOR1_USER_NAME, ACTOR1_PASSWORD);
		}
		accountDashboardPage = homePage.navigateToAccountDashboard();
		Assert.assertTrue(accountDashboardPage.verifyDefaultEndingTimePeriod(), "'Current Month to Date' is not the default selected option for Ending Time Period");
		Assert.assertEquals(accountDashboardPage.depletionsTimePeriodDefaultOption(), "FYTD", "'FYTD' is not the default selected option for Depletions Time Period'");
		Assert.assertEquals(accountDashboardPage.distributionTimePeriodDefaultOption(), "L90 Days", "'L90 Days' is not the default selected option for Depletions Time Period'");
		accountDashboardPage.clickBrand(brandName);
		Assert.assertEquals(accountDashboardPage.allBrandsFirstColumnHeaderText(), "SKU / PACKAGE", "When product was selected, the first column header did not change as expected'");
		accountDashboardPage.selectVelocity();
		Assert.assertEquals(accountDashboardPage.allBrandsThirdColumnHeaderText(), "VELOCITY - L90 DAYS", "When 'Velocity' was selected, the third column header did not change as expected");
		accountDashboardPage.clickOffPremise();
		Assert.assertEquals(accountDashboardPage.allBrandsFirstColumnHeaderText(), "SKU", "When 'Off-Premise' was selected, the first column header did not change as expected'");
		accountDashboardPage.clickOnPremise();
		Assert.assertEquals(accountDashboardPage.allBrandsFirstColumnHeaderText(), "PACKAGE", "When 'On-Premise' was selected, the first column header did not change as expected'");
		accountDashboardPage.selectDepletionTimePeriod("CYTD");
		Assert.assertEquals(accountDashboardPage.depletionsColumnHeaderText(), "CYTD", "When 'CYTD' was selected as the Depletions Time Period, the first column header did not change as expected");
		accountDashboardPage.selectDepletionTimePeriod("MTD");
		Assert.assertEquals(accountDashboardPage.depletionsColumnHeaderText(), "MTD", "When 'MTD' was selected as the Depletions Time Period, the first column header did not change as expected");
		accountDashboardPage.selectDistributionTimePeriod("L60");
		Assert.assertEquals(accountDashboardPage.depletionsDaysHeaderText(), "L60", "When 'L60' was selected as the Distribution Time Period, the corresponding column header did not change as expected");
		accountDashboardPage.selectDistributionTimePeriod("L120");
		Assert.assertEquals(accountDashboardPage.depletionsDaysHeaderText(), "L120", "When 'L60' was selected as the Distribution Time Period, the corresponding column header did not change as expected");
		accountDashboardPage.selectLastClosedMonth();
		Assert.assertEquals(accountDashboardPage.depletionsTimePeriodDropdownOptions(), "Clo Mth"+"CYTM"+"FYTM","'Depletions Time Period' drop down options do not change when 'Last Closed Month' is selected as the Ending Time Period");
		Assert.assertEquals(accountDashboardPage.distributionsTimePeriodDropdownOptions(), "L03 Mth","'Distribution Time Period' drop down options do not change when 'Last Closed Month' is selected as the Ending Time Period");
  }

	@DataProvider(name="AT_US13287_BrandSnapShot_PackageSKULevelDetail")
	public static Object[][] data1(){
		return new Object[][]{{"CORONA LIGHT"}};
	}

	@AfterMethod
	public void signOut() {
		logout();
	}
}
