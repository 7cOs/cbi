package com.cbrands.test.functional.legacy.opportunity;

import static net.javacrumbs.hamcrest.logger.HamcrestLoggerMatcher.log;
import static org.hamcrest.CoreMatchers.containsString;
import static org.hamcrest.CoreMatchers.not;
import static org.hamcrest.MatcherAssert.assertThat;

import java.util.List;

import org.hamcrest.Matchers;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.DataProvider;
import org.testng.annotations.Test;

import com.cbrands.BaseSeleniumTestCase;
import com.cbrands.helper.RetryAnalyzer;
import com.cbrands.pages.Login;
import com.cbrands.pages.NotificationContent;


/**
 * @deprecated Legacy functional test removed from the functional suite. No longer working due to login/logout being
 * wrong. Saved for reference only. Should be deleted as soon as there is a new test to replace it.
 */
@Deprecated
public class OpportunityResultTest extends BaseSeleniumTestCase{
	static NotificationContent content;

	@Test(retryAnalyzer = RetryAnalyzer.class, dataProvider = "sendOpportunityData", description = "Run - 13:  I can Share an Opportunity to another Employee.", priority=1)
	public void US12719_AT_Opportunities_Run13_ShareOpportunities(String sendTo, String sent) throws InterruptedException {
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

		String allText = getAllTextFromPage();
		assertThat("Unable to find any opportunities that met your criteria.", allText, not(containsString("Dang! We were unable to find any opportunities that met your criteria.")));

		content = opportunitiesPage.clickFirstResult()
								   .getWebElementOfFirstItem();

		content.setSentByPersonName(ACTOR1_FIRST_NAME+" "+ ACTOR1_LAST_NAME );
		content.setProductSku(content.getProductSku() + " " + "Non-Buy");
		content.setSentByDate("0 MINUTE AGO");
		opportunitiesPage.sendOpportunityTo(sendTo);
		assertThat(opportunitiesPage.getOpportunitySent(),log(containsString(sent)));
	}

	@Test(retryAnalyzer = RetryAnalyzer.class, dependsOnMethods = "US12719_AT_Opportunities_Run13_ShareOpportunities", description = "Run - 18:  When I send an Opportunity to an employee, they receive a notification.", priority=2)
	public void US12720_AT_Opportunities_Run18_SharedOpportunityNotification(){
		login = new Login(driver);
		if(!login.isUserLoggedIn()) {
			login = new Login(driver);
			homePage = login.loginWithValidCredentials(ACTOR3_USER_NAME, ACTOR3_PASSWORD);

			opportunitiesPage = homePage.navigateOpportunities();

			List<NotificationContent> notificationContents = opportunitiesPage.clickNotification().getListOfNotifications();

			assertThat(notificationContents, log(Matchers.hasItem(content)));
		}
	}

	@DataProvider(name = "sendOpportunityData")
	public static Object[][] data3() {
		return new Object[][] { { "eric.ramey@cbrands.com", "Opportunity Sent!" } };
	}

	@AfterMethod
	public void signOut() {
		logout();
	}
}
