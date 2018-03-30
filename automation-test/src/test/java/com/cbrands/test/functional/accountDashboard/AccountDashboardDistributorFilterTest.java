package com.cbrands.test.functional.accountDashboard;

import com.cbrands.TestUser;
import com.cbrands.pages.AccountDashboardPage;
import com.cbrands.pages.LoginPage;
import com.cbrands.pages.LogoutPage;
import com.cbrands.test.BaseTestCase;
import org.openqa.selenium.support.PageFactory;
import org.testng.Assert;
import org.testng.annotations.*;

import java.lang.reflect.Method;
import java.net.MalformedURLException;

public class AccountDashboardDistributorFilterTest extends BaseTestCase {
  private static TestUser testUser;
  private AccountDashboardPage accountDashboardPage;

  @BeforeMethod
  public void setUp(Method method) throws MalformedURLException {
    testUser = TestUser.ACTOR4;

    final String testCaseName = method.getAnnotation(Test.class).description();
    final String sauceTitle = String.format("Functional - AccountDashboard - Distributor Filter Test - %s", testCaseName);
    this.startUpBrowser(sauceTitle);
    PageFactory.initElements(driver, LoginPage.class).loginAs(testUser);

    accountDashboardPage = PageFactory.initElements(driver, AccountDashboardPage.class);
    accountDashboardPage.goToPage();
  }

  @AfterMethod
  public void tearDown() {
    PageFactory.initElements(driver, LogoutPage.class).goToPage();
    this.shutDownBrowser();
  }

  @Test(description = "Filter by Distributor - default values")
  public void distributorFilterDefaults() {
    assertDefaultDistributorLabels();
  }

  @Test(description = "Filter by Distributor", dataProvider = "distributorData")
  public void filterByDistributor(String distributorName, String shortenedDistributorName) {
    accountDashboardPage
      .filterForm.enterDistributorSearchText(distributorName)
      .filterForm.clickSearchForDistributor()
      .filterForm.selectDistributorFilterContaining(distributorName);

    Assert.assertEquals(
      accountDashboardPage.filterForm.getDistributorFieldText(),
      distributorName,
      "Failed to select Distributor"
    );

    accountDashboardPage
      .filterForm.clickApplyFilters()
      .brandSnapshotPanel.waitForBrandsPanelLoaderToDisappear()
      .waitForMarketPanelLoaderToDisappear();

    assertDistributorLabelsMatch(distributorName, shortenedDistributorName);

    accountDashboardPage
      .brandSnapshotPanel.drillIntoFirstRow()
      .brandSnapshotPanel.waitForBrandsPanelLoaderToDisappear();
    assertDistributorLabelsMatch(distributorName, shortenedDistributorName);

    accountDashboardPage
      .brandSnapshotPanel.drillUp().brandSnapshotPanel.waitForBrandsPanelLoaderToDisappear();
    assertDistributorLabelsMatch(distributorName, shortenedDistributorName);
  }

  @Test(description = "Remove Distributor filter", dataProvider = "distributorData")
  public void removeDistributorFilter(String distributorName, String shortenedDistributorName) {
    accountDashboardPage
      .filterForm.enterDistributorSearchText(distributorName)
      .filterForm.clickSearchForDistributor()
      .filterForm.selectDistributorFilterContaining(distributorName)
      .filterForm.clickApplyFilters()
      .brandSnapshotPanel.waitForBrandsPanelLoaderToDisappear()
      .waitForMarketPanelLoaderToDisappear()
      .filterForm.clickRemoveDistributorFilter();

    Assert.assertTrue(accountDashboardPage.filterForm.getDistributorFieldText().isEmpty(), "Clearing Distributor field failed.");

    accountDashboardPage
      .filterForm.clickApplyFilters()
      .brandSnapshotPanel.waitForBrandsPanelLoaderToDisappear()
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
      .filterForm.enterDistributorSearchText(distributorName)
      .filterForm.clickSearchForDistributor()
      .filterForm.selectDistributorFilterContaining(distributorName)
      .filterForm.clickApplyFilters()
      .brandSnapshotPanel.waitForBrandsPanelLoaderToDisappear()
      .waitForMarketPanelLoaderToDisappear()
      .clickResetFilters();

    Assert.assertTrue(accountDashboardPage.filterForm.getDistributorFieldText().isEmpty(), "Distributor field failed to clear.");
    assertDefaultDistributorLabels();
  }

  @DataProvider
  public static Object[][] distributorData() {
    return new Object[][]{
      {"HEALY WHOLESALE CO INC - NC", "HEALY WHOLESALE C..."}
    };
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

}
