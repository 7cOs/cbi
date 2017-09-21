package com.cbrands.test.functional.login;

import com.cbrands.TestUser;
import com.cbrands.pages.HomePage;
import com.cbrands.pages.Login;
import com.cbrands.pages.LogoutPage;
import com.cbrands.test.BaseTestCase;
import org.testng.Assert;
import org.testng.annotations.*;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * Login test for the functional suite.
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
  public void tearDown() {
    logoutPage.goToPage();
  }

  @Test(dataProvider = "userCredentials", description = "Testing login and logout for a valid user")
  public void testUserLogin(TestUser testUser) {
    final HomePage homePage = loginPage.loginAs(testUser);
    Assert.assertTrue(homePage.isLoaded(), "Login failed for userName: " + testUser.userName());

    log.info("Logged in successfully as: " + testUser.userName());
  }

  @DataProvider(name = "userCredentials")
  public static Object[][] userCredentials() {
    final List<Object[]> allTestUsers = getTestUsersAsObjects(TestUser.values());
    return allTestUsers.toArray(new Object[][] {});
  }

  private static List<Object[]> getTestUsersAsObjects(TestUser[] testUsers) {
    final List<Object[]> usersParams =  new ArrayList<>();
    Arrays.asList(testUsers).stream().forEach(u -> usersParams.add(new Object[]{u}));
    return usersParams;
  }

}
