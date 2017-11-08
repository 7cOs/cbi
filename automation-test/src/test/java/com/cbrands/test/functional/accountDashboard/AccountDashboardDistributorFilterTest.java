package com.cbrands.test.functional.accountDashboard;

import com.cbrands.TestUser;
import com.cbrands.pages.AccountDashboardPage;
import com.cbrands.pages.HomePage;
import com.cbrands.pages.Login;
import com.cbrands.pages.LogoutPage;
import com.cbrands.test.BaseTestCase;
import org.openqa.selenium.support.PageFactory;
import org.testng.Assert;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.DataProvider;
import org.testng.annotations.Test;

public class AccountDashboardDistributorFilterTest extends BaseTestCase {
  private static TestUser testUser;
  private LogoutPage logoutPage;
  private AccountDashboardPage accountDashboardPage;

  @BeforeMethod
  public void setUp() {
    testUser = TestUser.ACTOR4;
    logoutPage = new LogoutPage(driver);

    log.info("\nLoading webpage...");
    driver.get(webAppBaseUrl);

    final Login loginPage = new Login(driver);
    final HomePage homePage = loginPage.loginAs(testUser);
    Assert.assertTrue(homePage.isLoaded(), "Failed to log in user: " + testUser.userName());

    accountDashboardPage = PageFactory.initElements(driver, AccountDashboardPage.class);
    accountDashboardPage.goToPage();
  }

  @AfterMethod
  public void tearDown() {
    logoutPage.goToPage();
  }

  @Test(description = "Filter by Distributor - default values")
  public void distributorFilterDefaults() {
    Assert.assertEquals(
      accountDashboardPage.getOverviewMarketLabel(),
      "Distributors",
      "Market Overview label failed to match expected default."
    );
    Assert.assertEquals(
      accountDashboardPage.getRightPanelSelectorContextLabel(),
      testUser.fullName().toUpperCase(),
      "The 'for' label for the right panel selector header failed to match expected default."
    );
    Assert.assertEquals(
      accountDashboardPage.getRightPanelHeader(),
      "DISTRIBUTORS",
      "Right panel header text failed to match expected default."
    );
  }

  @Test(description = "Filter by Distributor", dataProvider = "distributorData")
  public void filterByDistributor(String distributorName, String shortenedDistributorName) {
    accountDashboardPage
      .enterDistributorSearchText(distributorName)
      .clickSearchForDistributor()
      .selectDistributorFilterByName(distributorName)
      .clickApplyFilters()
      .waitForBrandsLoaderToDisappear()
      .waitForMarketLoaderToDisappear();

    assertDistributorLabelsMatch(distributorName, shortenedDistributorName);

    accountDashboardPage.drillIntoFirstRowInLeftPanel().waitForBrandsLoaderToDisappear();
    assertDistributorLabelsMatch(distributorName, shortenedDistributorName);

    accountDashboardPage.drillUpLeftPanel().waitForBrandsLoaderToDisappear();
    assertDistributorLabelsMatch(distributorName, shortenedDistributorName);
  }

  private void assertDistributorLabelsMatch(String distributorName, String shortenedDistributorName) {
    Assert.assertEquals(
      accountDashboardPage.getOverviewMarketLabel(),
      distributorName,
      "Market Overview label failed to match applied Distributor filter."
    );
    Assert.assertEquals(
      accountDashboardPage.getRightPanelSelectorContextLabel(),
      distributorName,
      "The 'for' label for the right panel selector header failed to match applied Distributor filter."
    );
    Assert.assertEquals(
      accountDashboardPage.getRightPanelHeader(),
      shortenedDistributorName,
      "Right panel header text failed to match applied Distributor filter."
    );
  }

  @DataProvider
  public static Object[][] distributorData() {
    return new Object[][]{
      {"HEALY WHOLESALE CO INC - NC", "HEALY WHOLESALE C..."}
    };
  }

}
