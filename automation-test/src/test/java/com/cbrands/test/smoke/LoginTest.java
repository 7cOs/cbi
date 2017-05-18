package com.cbrands.test.smoke;

import com.cbrands.TestUser;
import com.cbrands.pages.HomePage;
import com.cbrands.pages.Login;
import org.openqa.selenium.NoSuchElementException;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.DataProvider;
import org.testng.annotations.Test;

/**
 * Automated test for logging in and out of the web app.
 */
public class LoginTest extends BaseTestCase {

  @BeforeMethod
  public void loadPage() {
    log.info("Loading webpage.");
    driver.get(webAppBaseUrl);
  }

  @AfterMethod
  public void logOut() {
    driver.get(webAppBaseUrl + "/auth/logout/");
    log.info("Logged out.");
  }

  @Test(dataProvider = "userCredentials", description = "Testing basic login and logout")
  public void testLogin(TestUser testUser) {
    final HomePage homePage = new Login(driver).loginWithValidCredentials(testUser.userName(), testUser.password());

    try {
      homePage.get();
    } catch (final NoSuchElementException e) {
      log.info("Login failed for userName: " + testUser.userName());
      throw e;
    }
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
