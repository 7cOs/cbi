package com.cbrands.test.smoke;

import com.cbrands.TestUser;
import com.cbrands.pages.Home;
import com.cbrands.pages.Login;
import com.cbrands.pages.LogoutPage;
import org.testng.Assert;
import org.testng.annotations.*;

/**
 * Automated test for logging in and out of the web app.
 */
public class LoginTest extends BaseTestCase {

  private Login login;
  private LogoutPage logoutPage;

  @BeforeMethod
  public void setUp() {
    login = new Login(driver);
    logoutPage = new LogoutPage(driver);

    log.info("\nLoading webpage...");
    driver.get(webAppBaseUrl);
  }

  @AfterMethod
  public void tearDown() {
    logoutPage.goToPage();
  }

  @Test(dataProvider = "userCredentials", description = "Testing basic login and logout")
  public void testLogin(TestUser testUser) {
    final Home homePage = login.loginWithValidCredentials(testUser.userName(), testUser.password());
    Assert.assertTrue(homePage.isOnHomePage(), "Login failed for userName: " + testUser.userName());

    log.info("Logged in successfully as: " + testUser.userName());
  }

  @DataProvider(name = "userCredentials")
  public static Object[][] userCredentials() {
    return new Object[][] {
      { TestUser.ACTOR4 } ,
      { TestUser.ACTOR5 }
    };
  }


}
