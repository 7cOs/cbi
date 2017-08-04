package com.cbrands.test.smoke;

import com.cbrands.TestUser;
import com.cbrands.pages.AccountDashboardPage;
import com.cbrands.pages.HomePage;
import com.cbrands.pages.Login;
import com.cbrands.pages.LogoutPage;
import org.openqa.selenium.support.PageFactory;
import org.testng.Assert;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

public class AccountDashboardTest extends BaseTestCase {
  private Login loginPage;
  private LogoutPage logoutPage;
  private AccountDashboardPage accountDashboardPage;

  @BeforeMethod
  public void setUp() {
    final TestUser testUser = TestUser.ACTOR4;

    loginPage = new Login(driver);
    logoutPage = new LogoutPage(driver);

    log.info("\nLoading webpage...");
    driver.get(webAppBaseUrl);
    final HomePage homePage = loginPage.loginAs(testUser);
    Assert.assertTrue(homePage.isLoaded(), "Failed to log in user: " + testUser.userName());

    accountDashboardPage = PageFactory.initElements(driver, AccountDashboardPage.class);
    accountDashboardPage.goToPage();
  }

  @AfterMethod
  public void tearDown() {
    logoutPage.goToPage();
  }

  @Test(description = "Search for accounts")
  public void searchAccounts() {
    accountDashboardPage.enterDistributorSearchText("Coastal")
      .clickSearchForDistributor()
      .selectDistributorFilterByName("COASTAL BEV CO-NC (WILMINGTON)")
      .clickApplyFilters();

    Assert.assertTrue(accountDashboardPage.isLeftPanelResultsLoaded(), "Left brands panel failed to load results");
    Assert.assertTrue(accountDashboardPage.isRightPanelResultsLoaded(), "Right accounts panel failed to load results");
  }

  @Test(description = "Drill all the way down the account hierarchy and drill back up")
  public void drillDownUpAccounts() {
    Assert.fail("Test not implemented");
  }
}
