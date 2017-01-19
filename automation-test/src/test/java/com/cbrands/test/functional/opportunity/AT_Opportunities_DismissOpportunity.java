package com.cbrands.test.functional.opportunity;

import org.testng.annotations.AfterMethod;
import org.testng.annotations.Test;

import com.cbrands.BaseSeleniumTestCase;
import com.cbrands.helper.RetryAnalyzer;
import com.cbrands.pages.Login;

public class AT_Opportunities_DismissOpportunity extends BaseSeleniumTestCase {

	@Test(retryAnalyzer = RetryAnalyzer.class)
	public void US13355_AT_Opportunities_DismissOpportunity() {
		login = new Login(driver);
		if(!login.isUserLoggedIn()) { 
			homePage = login.loginWithValidCredentials(ACTOR1_USER_NAME, ACTOR1_PASSWORD);
		}
		opportunitiesPage = homePage.navigateOpportunities();
		opportunitiesPage.clickOffPremise()
						.searchRetailerChainByName("walmart")
						//.selectOpenOpportunityStatus()
						.clickApplyFilters();
		
		opportunitiesPage.clickFirstResult()
						 .dismiss("This opportunity is no longer relevant for this store");
		//assertThat("Dismiss link is not visiable", true, log(equalTo(opportunitiesPage.isDismissVisiable())));
		
	}
	
	@AfterMethod
	public void signOut() {
		logout();
	}
}
