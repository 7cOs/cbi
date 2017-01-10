package com.cbrands.test.functional.myperformance;

import org.testng.annotations.Test;

import com.cbrands.BaseSeleniumTestCase;
import com.cbrands.pages.Login;

import org.testng.Assert;
import org.testng.annotations.AfterMethod;

public class US13484_AccountDashboard_ApplyFilters_SeeAllOpportunities extends BaseSeleniumTestCase{
  
	@Test
  	public void us13484_AT_AccountDashboard_ApplyFilters_SeeAllOpportunities() {
	  	login = new Login(driver);
		if(!login.isUserLoggedIn()) { 
			homePage = login.loginWithValidCredentials(ACTOR1_USER_NAME, ACTOR1_PASSWORD);
		}
		accountDashboardPage = homePage.navigateToAccountDashboard();
		Assert.assertEquals(accountDashboardPage.seeAllOpportunitiesLinkState(), "true");
		Assert.assertEquals(accountDashboardPage.textBelowOpportunitiesLink(), "SELECT A PREMISE TYPE FOLLOWED BY A RETAILER AND/OR DISTRIBUTOR TO VIEW OPPORTUNITIES");
		accountDashboardPage.clickOffPremise();
		accountDashboardPage.searchDistributor("Coastal Bev Co-NC (Wilmington)");
		accountDashboardPage.clickApplyFiltersButton();
		opportunitiesPage = accountDashboardPage.clickSeeAllOpportunitiesLink();
		Assert.assertNotNull(opportunitiesPage.getFilterPillAllTypes(), "'All Types' filter pill not displaying");
		Assert.assertNotNull(opportunitiesPage.getFilterPillOffPremise(), "'Off-Premise' filter pill not displaying");
  }
	@AfterMethod
  	public void signOut() {
	  logout();
  }
}
