package com.cbrands.test.smoke;

import com.cbrands.helper.PropertiesCache;
import com.cbrands.helper.SeleniumUtils;
import com.cbrands.helper.WebDriverFactory;
import com.cbrands.listener.SeleniumSnapshotRule;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.openqa.selenium.WebDriver;
import org.testng.annotations.*;

import java.net.MalformedURLException;

@Listeners(value = SeleniumSnapshotRule.class)
public abstract class BaseTestCase {
  protected static WebDriver driver;
  protected static String webAppBaseUrl;

  protected Log log = LogFactory.getLog(BaseTestCase.class);

  @BeforeSuite
  public void setUpSuite() throws MalformedURLException {
    final PropertiesCache propertiesCache = PropertiesCache.getInstance();
    webAppBaseUrl = propertiesCache.getProperty("qa.host.address");

    log.info("\n Browser opening...");

    driver = WebDriverFactory.createDriver(propertiesCache.getProperty("selenium.host.address"));
    driver.get(webAppBaseUrl);
    SeleniumUtils.setDriver(driver);
    SeleniumUtils.setStopAtShutdown();

    log.info("Browser opened.\n");
  }

  @AfterSuite
  public void tearDownSuite() {
    log.info("\nBrowser closing...");
    driver.quit();
    log.info("Browser closed.\n");
  }

}