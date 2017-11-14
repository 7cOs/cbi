package com.cbrands.test;

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
  public void setUpSuite() {
    webAppBaseUrl = PropertiesCache.getInstance().getProperty("host.address");
  }

  @BeforeClass
  public void setUpClass() throws MalformedURLException {
    this.startUpBrowser();
  }

  @AfterClass
  public void tearDownClass() {
    this.shutDownBrowser();
  }

  /**
   * @deprecated Please use {@link #startUpBrowser(String) startUpBrowser(String)} and supply a test case name instead
   */
  @Deprecated
  protected void startUpBrowser() throws MalformedURLException {
    this.startUpBrowser("Automated Test Run");
  }

  protected void startUpBrowser(String testName) throws MalformedURLException {
    log.info("\n Browser opening...");

    driver = WebDriverFactory.createDriver(testName);
    driver.get(webAppBaseUrl);
    driver.manage().window().maximize();
    SeleniumUtils.setDriver(driver);
    SeleniumUtils.setStopAtShutdown();

    log.info("Browser opened.\n");
  }

  protected void shutDownBrowser() {
    log.info("\nBrowser closing...");
    driver.quit();
    log.info("Browser closed.\n");
  }

}
