package com.cbrands.test.smoke;

import com.cbrands.TestUser;
import com.cbrands.pages.AccountDashboardPage;
import com.cbrands.pages.AccountDashboardPage.LeftPanelLevel;
import com.cbrands.pages.AccountDashboardPage.RightPanelLevel;
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

    Assert.assertTrue(accountDashboardPage.isLeftPanelResultsLoadedFor(LeftPanelLevel.Brand), "Left brands panel failed to load " +
      "results");
    Assert.assertTrue(accountDashboardPage.isRightPanelResultsLoadedFor(RightPanelLevel.Accounts), "Right accounts panel failed to " +
      "load results");
  }

  @Test(description = "Drill all the way down the account hierarchy and drill back up")
  public void drillDownUpAccounts() {
    drillRightPanelToBottom();
    drillRightPanelToTop();
  }

  private void drillRightPanelToBottom() {
    accountDashboardPage.drillIntoFirstRowInRightPanel();
    Assert.assertTrue(
      accountDashboardPage.isRightPanelResultsLoadedFor(RightPanelLevel.Accounts),
      "Right panel failed to load accounts for selected distributor"
    );
    Assert.assertTrue(
      accountDashboardPage.isLeftPanelResultsLoadedFor(LeftPanelLevel.Brand),
      "Left brands panel failed to load results"
    );

    accountDashboardPage.drillIntoFirstRowInRightPanel();
    Assert.assertTrue(
      accountDashboardPage.isRightPanelResultsLoadedFor(RightPanelLevel.SubAccounts),
      "Right panel failed to load subaccounts for selected account"
    );
    Assert.assertTrue(
      accountDashboardPage.isLeftPanelResultsLoadedFor(LeftPanelLevel.Brand),
      "Left brands panel failed to reload for subaccounts"
    );

    accountDashboardPage.drillIntoFirstRowInRightPanel();
    Assert.assertTrue(
      accountDashboardPage.isRightPanelResultsLoadedFor(RightPanelLevel.Stores),
      "Right accounts panel failed to load stores for selected subaccount"
    );
    Assert.assertTrue(
      accountDashboardPage.isLeftPanelResultsLoadedFor(LeftPanelLevel.Brand),
      "Left brands panel failed to reload for stores"
    );
  }

  private void drillRightPanelToTop() {
    accountDashboardPage.drillUpRightPanel();
    Assert.assertTrue(
      accountDashboardPage.isRightPanelResultsLoadedFor(RightPanelLevel.SubAccounts),
      "Right accounts panel failed to load subaccounts"
    );
    Assert.assertTrue(
      accountDashboardPage.isLeftPanelResultsLoadedFor(LeftPanelLevel.Brand),
      "Left brands panel failed to reload for subaccounts"
    );

    accountDashboardPage.drillUpRightPanel();
    Assert.assertTrue(
      accountDashboardPage.isRightPanelResultsLoadedFor(RightPanelLevel.Accounts),
      "Right accounts panel failed to load accounts"
    );
    Assert.assertTrue(
      accountDashboardPage.isLeftPanelResultsLoadedFor(LeftPanelLevel.Brand),
      "Left brands panel failed to reload for accounts"
    );

    accountDashboardPage.drillUpRightPanel();
    Assert.assertTrue(
      accountDashboardPage.isRightPanelResultsLoadedFor(RightPanelLevel.Distributors),
      "Right accounts panel failed to load distributors"
    );
    Assert.assertTrue(
      accountDashboardPage.isLeftPanelResultsLoadedFor(LeftPanelLevel.Brand),
      "Left brands panel failed to reload for distributors"
    );
  }
}
