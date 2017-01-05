package com.cbrands.test.functional.opportunity;

import static net.javacrumbs.hamcrest.logger.HamcrestLoggerMatcher.log;
import static org.hamcrest.CoreMatchers.containsString;
import static org.hamcrest.MatcherAssert.assertThat;

import java.util.List;

import org.hamcrest.Matchers;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.DataProvider;
import org.testng.annotations.Test;

import com.cbrands.BaseSeleniumTestCase;
import com.cbrands.pages.Login;
import com.cbrands.pages.NotificationContent;


public class OpportunityResultTest extends BaseSeleniumTestCase{
	static NotificationContent content;
	
	@Test(dataProvider = "sendOpportunityData", description = "Run - 13:  I can Share an Opportunity to another Employee.", priority=1)
	public void AT_Opportunities_Run13_ShareOpportunities(String sendTo, String sent) {
		login = new Login(driver);
		if(!login.isUserLoggedIn()) { 
			login = new Login(driver);
			homePage = login.loginWithValidCredentials(ACTOR1_USER_NAME, ACTOR1_PASSWORD);
		}
		
		opportunitiesPage = homePage.navigateOpportunities()
									.searchRetailerChainByName("Real Mex")
									.selectOpporunityType("Non-Buy")
									.clickOnPremise()
									.clickApplyFilters();
		
		content = opportunitiesPage.clickFirstResult()
								   .getWebElementOfFirstItem();
		
		content.setSentByPersonName(ACTOR1_FIRST_NAME+" "+ ACTOR1_LAST_NAME );
		content.setProductSku(content.getProductSku() + " " + "Non-Buy");
		content.setSentByDate("0 MINUTE AGO");
		opportunitiesPage.sendOpportunityTo(ACTOR2_USER_NAME);
		assertThat(opportunitiesPage.getOpportunitySent(),log(containsString(sent)));
	}
	
	@Test(dependsOnMethods = "AT_Opportunities_Run13_ShareOpportunities", description = "Run - 18:  When I send an Opportunity to an employee, they receive a notification.", priority=2)
	public void AT_Opportunities_Run18_ShareOpportunities(){
		login = new Login(driver);
		if(!login.isUserLoggedIn()) { 
			login = new Login(driver);
			homePage = login.loginWithValidCredentials(ACTOR2_USER_NAME, ACTOR2_PASSWORD);
			
			opportunitiesPage = homePage.navigateOpportunities();
			
			List<NotificationContent> notificationContents = opportunitiesPage.clickNotification().getListOfNotifications();
			
			assertThat(notificationContents, log(Matchers.hasItem(content)));
		}
	}
	
	@DataProvider(name = "sendOpportunityData")
	public static Object[][] data3() {
		return new Object[][] { { "Carrie Reid", "Opportunity Sent!" } };
	}
	
	@AfterMethod
	public void signOut() {
		logout();
	}
}
