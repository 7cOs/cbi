package com.cbrands.test.smoke;

import com.cbrands.TestUser;
import com.cbrands.pages.AccountDashboard;
import com.cbrands.pages.HomePage;
import com.cbrands.pages.Login;
import com.cbrands.pages.Logout;
import org.testng.Assert;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

public class NotesTest extends BaseTestCase {

  private Login login;
  private Logout logout;
  private AccountDashboard accountDashboardPage;

  @BeforeMethod
  public void setUp() {
    final TestUser testUser = TestUser.ACTOR4;

    login = new Login(driver);
    logout = new Logout(driver);

    log.info("\nLoading webpage...");
    driver.get(webAppBaseUrl);
    HomePage homePage = login.loginWithValidCredentials(testUser.userName(), testUser.password());
    Assert.assertTrue(homePage.isOnHomePage(), "Failed to log in user: " + testUser.userName());

    accountDashboardPage = homePage.navigateToAccountDashboard(); //TODO replace with new Account Dashboard page object
  }

  @AfterMethod
  public void tearDown() {
    logout.logoutViaUrl();
  }

  @Test(description = "Create a new Note")
  public void createNote() {
    Assert.fail("Create Note test not implemented");
  }

}
