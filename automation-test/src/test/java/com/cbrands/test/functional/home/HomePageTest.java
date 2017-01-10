package com.cbrands.test.functional.home;

import static net.javacrumbs.hamcrest.logger.HamcrestLoggerMatcher.log;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.equalToIgnoringCase;
import static org.hamcrest.Matchers.hasItems;

import org.testng.annotations.AfterMethod;
import org.testng.annotations.DataProvider;
import org.testng.annotations.Test;

import com.cbrands.BaseSeleniumTestCase;
import com.cbrands.pages.Login;

public class HomePageTest extends BaseSeleniumTestCase {
	
	@Test(dataProvider = "findOpportunity1Test", testName="US12704", description = "AT_Opportunities_Run 1_Home Page Opportunity Search", priority = 2)
	public void US12704_AT_Opportunities_Run_1_Home_Page_Opportunity_Search_1(String premise, String OpportunityType, String item, String retailer) {
		login = new Login(driver);
		homePage = login.loginWithValidCredentials(ACTOR1_USER_NAME, ACTOR1_PASSWORD);
		homePage = (premise.equalsIgnoreCase("On-Premise")) ? homePage.clickOnPremise() : homePage.clickOffPremise();

		homePage.selectOpporunityType(OpportunityType)
				.typeBrandMasterSku(item)
				.typeRetailer(retailer)
				.submitFindOpportunities();
		
		assertThat(getFilterList(), log(hasItems(equalToIgnoringCase(item))));
		assertThat(getFilterList(), log(hasItems(equalToIgnoringCase(OpportunityType))));
		assertThat(getFilterList(), log(hasItems(equalToIgnoringCase(premise))));
	}

	@Test(dataProvider = "findOpportunity2Test", testName="US12704", description = "AT_Opportunities_Run 1_Home Page Opportunity Search", priority = 3)
	public void US12704_AT_Opportunities_Run_1_Home_Page_Opportunity_Search_2(String premise, String brandName, String retailer) {
		login = new Login(driver);
		homePage = login.loginWithValidCredentials(ACTOR1_USER_NAME, ACTOR1_PASSWORD);
		homePage = (premise.equalsIgnoreCase("On-Premise")) ? homePage.clickOnPremise() : homePage.clickOffPremise();
		
		homePage.typeBrandMasterSku(brandName)
				.typeRetailer(retailer)
				.submitFindOpportunities();
		
		assertThat(getFilterList(), log(hasItems(equalToIgnoringCase(premise))));
		assertThat(getFilterList(), log(hasItems(equalToIgnoringCase(brandName))));
		assertThat(getFilterList(), log(hasItems(equalToIgnoringCase(retailer))));
	}

	@DataProvider(name = "findOpportunity1Test")
	public static Object[][] data1() {
		return new Object[][] { { "Off-Premise", "Non-Buy", "Corona Extra", "Walmart Store" } };
	}

	@DataProvider(name = "findOpportunity2Test")
	public static Object[][] data2() {
		return new Object[][] { { "On-Premise", "Pacifico 7oz 6pk Bt", "Walmart Store" } };
	}

	@AfterMethod
	public void signOut() {
		logout();
	}
}
