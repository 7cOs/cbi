package com.cbrands.test.smoke;

import com.cbrands.helper.PropertiesCache;
import com.cbrands.helper.SeleniumUtils;
import com.cbrands.helper.WebDriverFactory;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.openqa.selenium.WebDriver;
import org.testng.annotations.AfterSuite;
import org.testng.annotations.BeforeSuite;

import java.net.MalformedURLException;

public abstract class BaseTestCase {

  protected Log log = LogFactory.getLog(BaseTestCase.class);
  protected WebDriver driver;
  protected String webAppBaseUrl;

  @BeforeSuite
  public void setUpSuite() throws MalformedURLException {
    final PropertiesCache propertiesCache = PropertiesCache.getInstance();
    webAppBaseUrl = propertiesCache.getProperty("qa.host.address");

    log.info("Browser opening...");

    driver = WebDriverFactory.createDriver(propertiesCache.getProperty("selenium.host.address"));
    driver.get(webAppBaseUrl);
    SeleniumUtils.setDriver(driver);
    SeleniumUtils.setStopAtShutdown();

    log.info("Browser opened.");
  }

  @AfterSuite
  public void tearDownSuite() {
    driver.quit();
    log.info("Browser closed.");
  }

}
