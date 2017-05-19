package com.cbrands.test.smoke;

import com.cbrands.TestUser;
import com.cbrands.helper.PropertiesCache;
import com.cbrands.helper.SeleniumUtils;
import com.cbrands.helper.WebDriverFactory;
import com.cbrands.pages.HomePage;
import com.cbrands.pages.Login;
import com.cbrands.pages.Logout;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.openqa.selenium.WebDriver;
import org.testng.Assert;
import org.testng.annotations.*;

import java.net.MalformedURLException;

/**
 * Automated test for logging in and out of the web app.
 */
public class LoginTest {
  private Login login;
  private Logout logout;

  private Log log = LogFactory.getLog(LoginTest.class);
  private WebDriver driver;
  private String webAppBaseUrl;

  @BeforeSuite
  public void setUpSuite() throws MalformedURLException {
    final PropertiesCache propertiesCache = PropertiesCache.getInstance();
    webAppBaseUrl = propertiesCache.getProperty("qa.host.address");

    log.info("\nBrowser opening...");

    driver = WebDriverFactory.createDriver(propertiesCache.getProperty("selenium.host.address"));
    driver.get(webAppBaseUrl);
    SeleniumUtils.setDriver(driver);
    SeleniumUtils.setStopAtShutdown();

    log.info("Browser opened.");
  }

  @AfterSuite
  public void tearDownSuite() {
    driver.quit();
    log.info("Browser closed.\n");
  }

  @BeforeMethod
  public void setUp() {
    login = new Login(driver);
    logout = new Logout(driver);

    log.info("\nLoading webpage.");
    driver.get(webAppBaseUrl);
  }

  @AfterMethod
  public void tearDown() {
    logout.logoutViaUrl();
    Assert.assertTrue(logout.isOnLogoutPage());
  }

  @Test(dataProvider = "userCredentials", description = "Testing basic login and logout")
  public void testLogin(TestUser testUser) {
    final HomePage homePage = login.loginWithValidCredentials(testUser.userName(), testUser.password());
    Assert.assertTrue(homePage.isOnHomePage(), "Login failed for userName: " + testUser.userName());

    log.info("Logged in successfully as: " + testUser.userName());
  }

  @DataProvider(name = "userCredentials")
  public static Object[][] userCredentials() {
    return new Object[][] {
      { TestUser.ACTOR2 } ,
      { TestUser.ACTOR3 } ,
      { TestUser.ACTOR4 }
    };
  }


}
