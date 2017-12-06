package com.cbrands.test.smoke;

import com.cbrands.TestUser;
import com.cbrands.pages.LoginPage;
import com.cbrands.pages.LogoutPage;
import com.cbrands.test.BaseTestCase;
import org.openqa.selenium.support.PageFactory;
import org.testng.annotations.DataProvider;
import org.testng.annotations.Test;

import java.net.MalformedURLException;

/**
 * Automated test for logging in and out of the web app.
 */
public class LoginTest extends BaseTestCase {

  @Test(dataProvider = "userCredentials", description = "Testing basic login and logout")
  public void testLogin(TestUser testUser) throws MalformedURLException {
    this.startUpBrowser("Smoke - LoginTest: " + testUser.fullName());

    PageFactory.initElements(driver, LoginPage.class).loginAs(testUser);
    PageFactory.initElements(driver, LogoutPage.class).goToPage();

    this.shutDownBrowser();
  }

  @DataProvider(name = "userCredentials")
  public static Object[][] userCredentials() {
    return new Object[][]{
      {TestUser.ACTOR4},
      {TestUser.NOTES_ACTOR}
    };
  }

}
