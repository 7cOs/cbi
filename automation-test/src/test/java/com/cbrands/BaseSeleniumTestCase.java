package com.cbrands;

import static com.cbrands.SeleniumUtils.waitForVisible;
import static net.javacrumbs.hamcrest.logger.HamcrestLoggerMatcher.log;
import static org.hamcrest.CoreMatchers.containsString;
import static org.hamcrest.MatcherAssert.assertThat;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.openqa.selenium.By;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.testng.annotations.AfterSuite;
import org.testng.annotations.BeforeSuite;
import org.testng.annotations.Listeners;

import com.cbrands.listener.SeleniumSnapshotRule;
import com.cbrands.pages.HomePage;
import com.cbrands.pages.Login;
import com.cbrands.pages.Opportunities;
import com.cbrands.pages.TargetList;

@Listeners(value = SeleniumSnapshotRule.class)
public abstract class BaseSeleniumTestCase implements IConstant {
	
	private Log log = LogFactory.getLog(BaseSeleniumTestCase.class);
	
	protected static WebDriver driver = null;
	protected Login login;
	protected HomePage homePage;
	protected Opportunities opportunitiesPage;
	protected TargetList targetListPage;

	@BeforeSuite
	public void setUp() throws Exception {
		log.info("Browser Opening.");
		driver = WebDriverFactory.createDriver(PropertiesCache.getInstance().getProperty("selenium.host.address"));
		driver.get(PropertiesCache.getInstance().getProperty("qa.host.address"));
		SeleniumUtils.setDriver(driver);
		SeleniumUtils.setStopAtShutdown();
	}

	@AfterSuite
	public void tearDown() {
		driver.quit();
		log.info("Browser closed.");
	}

	public void LoginTest() {
		login = new Login(driver);
		homePage = login.loginWithValidCredentials(ACTOR1_USER_NAME, ACTOR1_PASSWORD);
		assertThat(homePage.showUserInfo(), log(containsString(ACTOR1_FIRST_NAME)));
	}

	public List<String> getFilterList() {
		List<WebElement> results = driver
				.findElements(By.xpath("//div[@class='md-chip-content']/md-chip-template/div"));
		List<String> filters = new ArrayList<String>();
		for (WebElement webElement : results) {
			filters.add(webElement.getText());
		}
		return filters;
	}
	
	protected void logout(){
		driver.get("https://orion-qa.cbrands.com/auth/logout");
		driver.get("https://orion-qa.cbrands.com/auth/logout");
		try {
			waitForVisible (By.id("username"));	
		} catch (NoSuchElementException e) {
			log.info("**************Logout failed.");
		} finally {
			log.info("Re-Trying....");
			driver.get("https://orion-qa.cbrands.com/auth/logout");
			log.info("Logout successfully.");
		}
		
	}
}
