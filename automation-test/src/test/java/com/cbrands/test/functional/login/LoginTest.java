package com.cbrands.test.functional.login;

import com.cbrands.TestUser;
import com.cbrands.pages.LoginPage;
import com.cbrands.pages.LogoutPage;
import com.cbrands.test.BaseTestCase;
import org.openqa.selenium.support.PageFactory;
import org.testng.annotations.DataProvider;
import org.testng.annotations.Test;

import java.net.MalformedURLException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * Login test for the functional suite.
 */
public class LoginTest extends BaseTestCase {

  @Test(dataProvider = "userCredentials", description = "Testing login and logout for a valid user")
  public void testUserLogin(TestUser testUser) throws MalformedURLException {
    this.startUpBrowser("Functional - Login: " + testUser.fullName());

    PageFactory.initElements(driver, LoginPage.class).loginAs(testUser);
    PageFactory.initElements(driver, LogoutPage.class).goToPage();

    this.shutDownBrowser();
  }

  @DataProvider(name = "userCredentials")
  public static Object[][] userCredentials() {
    final List<Object[]> allTestUsers = getTestUsersAsObjects(TestUser.values());
    return allTestUsers.toArray(new Object[][]{});
  }

  private static List<Object[]> getTestUsersAsObjects(TestUser[] testUsers) {
    final List<Object[]> usersParams = new ArrayList<>();
    Arrays.asList(testUsers).stream().forEach(u -> usersParams.add(new Object[]{u}));
    return usersParams;
  }

}
