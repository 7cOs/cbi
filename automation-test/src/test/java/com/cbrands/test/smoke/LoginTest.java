package com.cbrands.test.smoke;

import com.cbrands.TestUser;
import com.cbrands.pages.HomePage;
import com.cbrands.pages.Login;
import com.cbrands.pages.LogoutPage;
import com.cbrands.test.BaseTestCase;
import org.testng.Assert;
import org.testng.annotations.*;

import java.net.MalformedURLException;

/**
 * Automated test for logging in and out of the web app.
 */
public class LoginTest extends BaseTestCase {

  private Login loginPage;
  private LogoutPage logoutPage;

  @BeforeMethod
  public void setUp() {
    loginPage = new Login(driver);
    logoutPage = new LogoutPage(driver);

    log.info("\nLoading webpage...");
    driver.get(webAppBaseUrl);
  }

  @AfterMethod
  public void tearDown() throws MalformedURLException {
    logoutPage.goToPage();

    shutDownBrowser();
    startUpBrowser();
  }

  @Test(dataProvider = "userCredentials", description = "Testing basic login and logout")
  public void testLogin(TestUser testUser) {
    final HomePage homePage = loginPage.loginAs(testUser);
    Assert.assertTrue(homePage.isLoaded(), "Login failed for userName: " + testUser.userName());

    log.info("Logged in successfully as: " + testUser.userName());
  }

  @DataProvider(name = "userCredentials")
  public static Object[][] userCredentials() {
    return new Object[][] {
      { TestUser.ACTOR4 } ,
      { TestUser.NOTES_ACTOR }
    };
  }

}
