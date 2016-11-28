package com.cbrands.test.functional.opportunity;

import org.testng.annotations.Test;

import org.testng.annotations.BeforeMethod;
import org.testng.annotations.DataProvider;
import org.testng.Assert;
import org.testng.annotations.AfterMethod;

import com.cbrands.BaseSeleniumTestCase;
import com.cbrands.pages.Login;

public class US12985_OpportunitySorting extends BaseSeleniumTestCase{
  @Test(dataProvider="us12985_OpportunitySorting")
  public void us12985_OpportunitySorting(String distributorName) {
	  login = new Login(driver);
	  if(!login.isUserLoggedIn()) { 
			homePage = login.loginWithValidCredentials(ACTOR2_USER_NAME, ACTOR2_PASSWORD);
	  }
	  opportunitiesPage = homePage.navigateOpportunities();
	  opportunitiesPage.searchDistributor(distributorName);
	  opportunitiesPage.clickApplyFilters();
	  Assert.assertTrue(opportunitiesPage.verifySegmentationSort(),"Results are not sorted by store segmentation");
	  opportunitiesPage.clickFirstResult();
	  Assert.assertTrue(opportunitiesPage.verifySortPackageSKU());
	  opportunitiesPage.clickFirstResult();
	  Assert.assertTrue(opportunitiesPage.verifySortStore());
	  Assert.assertTrue(opportunitiesPage.verifySortDepletionsCYTD());
  
  }
  
	@DataProvider(name="us12985_OpportunitySorting")
	public static Object[][] data1(){
		return new Object[][]{{"Ace Bev Co - Ca (los Angeles)"}};
	}
  
  @BeforeMethod
  public void beforeMethod() {
	  logout();
  }

  @AfterMethod
  public void signOut() {
	  logout();
  }

}