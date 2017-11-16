package com.cbrands.test.functional.accountDashboard;

import com.cbrands.TestUser;
import com.cbrands.pages.AccountDashboardPage;
import com.cbrands.pages.HomePage;
import com.cbrands.pages.Login;
import com.cbrands.pages.LogoutPage;
import com.cbrands.test.BaseTestCase;
import org.openqa.selenium.support.PageFactory;
import org.testng.Assert;
import org.testng.annotations.*;

import java.net.MalformedURLException;

public class AccountDashboardDistributorFilterTest extends BaseTestCase {
  private static TestUser testUser;
  private LogoutPage logoutPage;
  private AccountDashboardPage accountDashboardPage;

  @BeforeClass
  public void setUpClass() throws MalformedURLException {
    this.startUpBrowser("Functional - AccountDashboard - Distributor Filter Test");
  }

  @AfterClass
  public void tearDownClass() {
    this.shutDownBrowser();
  }

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
    assertDefaultDistributorLabels();
  }

  @Test(description = "Filter by Distributor", dataProvider = "distributorData")
  public void filterByDistributor(String distributorName, String shortenedDistributorName) {
    accountDashboardPage
      .enterDistributorSearchText(distributorName)
      .clickSearchForDistributor()
      .selectDistributorFilterByName(distributorName);

    Assert.assertEquals(
      accountDashboardPage.getDistributorFieldText(),
      distributorName,
      "Failed to select Distributor"
    );

    accountDashboardPage.clickApplyFilters()
      .waitForBrandsPanelLoaderToDisappear()
      .waitForMarketPanelLoaderToDisappear();

    assertDistributorLabelsMatch(distributorName, shortenedDistributorName);

    accountDashboardPage.drillIntoFirstRowInLeftPanel().waitForBrandsPanelLoaderToDisappear();
    assertDistributorLabelsMatch(distributorName, shortenedDistributorName);

    accountDashboardPage.drillUpLeftPanel().waitForBrandsPanelLoaderToDisappear();
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

  @Test(description = "Remove Distributor filter", dataProvider = "distributorData")
  public void removeDistributorFilter(String distributorName, String shortenedDistributorName) {
    accountDashboardPage
      .enterDistributorSearchText(distributorName)
      .clickSearchForDistributor()
      .selectDistributorFilterByName(distributorName)
      .clickApplyFilters()
      .waitForBrandsPanelLoaderToDisappear()
      .waitForMarketPanelLoaderToDisappear()
      .clickRemoveDistributorFilter();

    Assert.assertTrue(accountDashboardPage.getDistributorFieldText().isEmpty(), "Clearing Distributor field failed.");

    accountDashboardPage
      .clickApplyFilters()
      .waitForBrandsPanelLoaderToDisappear()
      .waitForMarketPanelLoaderToDisappear();
    assertDefaultDistributorLabels();
  }

  @Test(
    dependsOnMethods = {"distributorFilterDefaults", "filterByDistributor"},
    description = "Reset filters when Distributor filter is applied",
    dataProvider = "distributorData"
  )
  public void resetFilters(String distributorName, String shortenedDistributorName) {
    accountDashboardPage
      .enterDistributorSearchText(distributorName)
      .clickSearchForDistributor()
      .selectDistributorFilterByName(distributorName)
      .clickApplyFilters()
      .waitForBrandsPanelLoaderToDisappear()
      .waitForMarketPanelLoaderToDisappear()
      .clickResetFilters();

    Assert.assertTrue(accountDashboardPage.getDistributorFieldText().isEmpty(), "Distributor field failed to clear.");
    assertDefaultDistributorLabels();
  }

  private void assertDefaultDistributorLabels() {
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

  @DataProvider
  public static Object[][] distributorData() {
    return new Object[][]{
      {"HEALY WHOLESALE CO INC - NC", "HEALY WHOLESALE C..."}
    };
  }

}
