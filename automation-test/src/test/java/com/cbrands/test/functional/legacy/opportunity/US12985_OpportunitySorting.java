package com.cbrands.test.functional.legacy.opportunity;

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
public class US12985_OpportunitySorting extends BaseSeleniumTestCase{

	@Test(retryAnalyzer = RetryAnalyzer.class, dataProvider="us12985_OpportunitySorting")
  public void US12985_AT_OpportunitySorting(String distributorName, String brand) {
	  login = new Login(driver);
	  if(!login.isUserLoggedIn()) {
			homePage = login.loginWithValidCredentials(ACTOR2_USER_NAME, ACTOR2_PASSWORD);
	  }
	  opportunitiesPage = homePage.navigateOpportunities();
	  opportunitiesPage.searchDistributor(distributorName);
	  opportunitiesPage.clickOpportunityTypeDropdown();
	  opportunitiesPage.clickOpportunityType("At Risk");
	  opportunitiesPage.clickOpporunityTypeDone();
	  opportunitiesPage.searchBrandSKU(brand);
	  opportunitiesPage.clickApplyFilters();
	  Assert.assertTrue(opportunitiesPage.verifyDefaultSegmentationSort(),"Results are not sorted by store segmentation");
	  opportunitiesPage.clickFirstResult();
	  opportunitiesPage.clickFirstResult();
	  Assert.assertTrue(opportunitiesPage.verifySortStore());
	  Assert.assertTrue(opportunitiesPage.verifySortDepletionsCYTD());
  }

	@DataProvider(name="us12985_OpportunitySorting")
	public static Object[][] data1(){
		return new Object[][]{{"Ace Bev Co - Ca (los Angeles)","CORONA EXTRA"}};
	}

  @AfterMethod
  public void signOut() {
	  logout();
  }

}
