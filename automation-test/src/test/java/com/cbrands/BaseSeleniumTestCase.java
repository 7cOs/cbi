package com.cbrands;

import com.cbrands.helper.PropertiesCache;
import com.cbrands.helper.SeleniumUtils;
import com.cbrands.helper.WebDriverFactory;
import com.cbrands.listener.SeleniumSnapshotRule;
import com.cbrands.pages.*;
import com.cbrands.pages.targetList.TargetList;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.openqa.selenium.*;
import org.testng.annotations.AfterSuite;
import org.testng.annotations.BeforeSuite;
import org.testng.annotations.Listeners;

import java.util.ArrayList;
import java.util.List;

import static net.javacrumbs.hamcrest.logger.HamcrestLoggerMatcher.log;
import static org.hamcrest.CoreMatchers.containsString;
import static org.hamcrest.MatcherAssert.assertThat;

/**
 * @deprecated Moving away from using this class to reduce low cohesion that interferes with modularity.
 * Methods in this class will be extracted to their appropriate page object or utility classes.
 * The new base test class should contain only code relevant to setup and teardown of test suites.
 *
 * @see com.cbrands.test.smoke.BaseTestCase
 */
@Deprecated
@Listeners(value = SeleniumSnapshotRule.class)
public abstract class BaseSeleniumTestCase implements IConstant {

	protected Log log = LogFactory.getLog(BaseSeleniumTestCase.class);

	protected static WebDriver driver = null;
	protected Login login;
	protected Home homePage;
	protected Opportunities opportunitiesPage;
	protected TargetList targetListPage;
	protected AccountDashboard accountDashboardPage;
	protected MyScorecards myScorecards;

	@BeforeSuite
	public void setUp() throws Exception {
		log.info("Browser Opening.");
		driver = WebDriverFactory.createDriver(PropertiesCache.getInstance().getProperty("selenium.host.address"));
		driver.get(PropertiesCache.getInstance().getProperty("host.address"));
		SeleniumUtils.setDriver(driver);
		SeleniumUtils.setStopAtShutdown();
	}

	@AfterSuite
	public void tearDown() {
		driver.quit();
		log.info("Browser closed.");
	}

  @Deprecated
	public void LoginTest() {
		login = new Login(driver);
		homePage = login.loginWithValidCredentials(ACTOR1_USER_NAME, ACTOR1_PASSWORD);
		assertThat(homePage.showUserInfo(), log(containsString(ACTOR1_FIRST_NAME)));
	}

  @Deprecated
	public List<String> getFilterList() {
		List<WebElement> results = driver
				.findElements(By.xpath("//div[@class='md-chip-content']/md-chip-template/div"));
		List<String> filters = new ArrayList<String>();
		for (WebElement webElement : results) {
			filters.add(webElement.getText());
		}
		return filters;
	}

  @Deprecated
	public String getAllTextFromPage() {
		return driver.findElement(By.tagName("body")).getText();
	}

  @Deprecated
	protected void logout(){
		driver.get("https://compass-qa.cbrands.com/auth/logout");
		try {
			login = new Login(driver);
			login.logOut();
			login.get();
		} catch (NoSuchElementException | TimeoutException e ) {
			log.info("**************Failed to logout and return to signin page.");
		} finally {
			log.info("Re-Trying navigation to signin page....");
			driver.get("https://compass-qa.cbrands.com");
		}

	}
}
