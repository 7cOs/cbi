package com.cbrands.test.smoke;

import com.cbrands.TestUser;
import com.cbrands.pages.AccountDashboardPage;
import com.cbrands.pages.AccountDashboardPage.BrandSnapshotPanel;
import com.cbrands.pages.AccountDashboardPage.TopBottomPanel;
import com.cbrands.pages.LoginPage;
import com.cbrands.pages.LogoutPage;
import com.cbrands.test.BaseTestCase;
import org.openqa.selenium.support.PageFactory;
import org.testng.Assert;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.DataProvider;
import org.testng.annotations.Test;

import java.lang.reflect.Method;
import java.net.MalformedURLException;

public class AccountDashboardTest extends BaseTestCase {
  private AccountDashboardPage accountDashboardPage;

  @BeforeMethod
  public void setUp(Method testMethod) throws MalformedURLException {
    final String testName = String.format(
      "Smoke - AccountDashboard Test - %s",
      testMethod.getAnnotation(Test.class).description()
    );
    this.startUpBrowser(testName);

    PageFactory.initElements(driver, LoginPage.class).loginAs(TestUser.ACTOR4);
    accountDashboardPage = PageFactory.initElements(driver, AccountDashboardPage.class);
    accountDashboardPage.goToPage();
  }

  @AfterMethod
  public void tearDown() {
    PageFactory.initElements(driver, LogoutPage.class).goToPage();
    this.shutDownBrowser();
  }

  @Test(description = "Search for accounts", dataProvider = "searchData")
  public void searchAccounts(String distributorSearchText, String secondarySearchText) {
    accountDashboardPage
      .filterForm.enterDistributorSearchText(distributorSearchText)
      .filterForm.clickSearchForDistributor()
      .filterForm.selectDistributorFilterContaining(secondarySearchText)
      .filterForm.clickApplyFilters()
      .brandSnapshotPanel.waitForLoaderToDisappear()
      .topBottomPanel.waitForLoaderToDisappear();

    Assert.assertTrue(
      accountDashboardPage
        .brandSnapshotPanel.waitForLoaderToDisappear()
        .brandSnapshotPanel.areResultsLoadedFor(BrandSnapshotPanel.DrillLevel.Brand),
      "Left brands panel failed to load results"
    );
    Assert.assertTrue(
      accountDashboardPage
        .topBottomPanel.areResultsLoadedFor(TopBottomPanel.DrillLevel.Accounts),
      "Right accounts panel failed to load results"
    );
  }

  @Test(description = "Account hierarchy - Drill all the way down and drill back up")
  public void drillDownUpAccounts() {
    drillRightPanelToBottom();
    drillRightPanelToTop();
  }

  private void drillRightPanelToBottom() {
    accountDashboardPage
      .topBottomPanel.drillIntoFirstRow();
    Assert.assertTrue(
      accountDashboardPage
        .topBottomPanel.areResultsLoadedFor(TopBottomPanel.DrillLevel.Accounts),
      "Right panel failed to load accounts for selected distributor"
    );
    Assert.assertTrue(
      accountDashboardPage
        .brandSnapshotPanel.waitForLoaderToDisappear()
        .brandSnapshotPanel.areResultsLoadedFor(BrandSnapshotPanel.DrillLevel.Brand),
      "Left brands panel failed to load results"
    );

    accountDashboardPage.topBottomPanel.drillIntoFirstRow();
    Assert.assertTrue(
      accountDashboardPage
        .topBottomPanel.areResultsLoadedFor(TopBottomPanel.DrillLevel.SubAccounts),
      "Right panel failed to load subaccounts for selected account"
    );
    Assert.assertTrue(
      accountDashboardPage
        .brandSnapshotPanel.areResultsLoadedFor(BrandSnapshotPanel.DrillLevel.Brand),
      "Left brands panel failed to reload for subaccounts"
    );

    accountDashboardPage.topBottomPanel.drillIntoFirstRow();
    Assert.assertTrue(
      accountDashboardPage
        .topBottomPanel.areResultsLoadedFor(TopBottomPanel.DrillLevel.Stores),
      "Right accounts panel failed to load stores for selected subaccount"
    );
    Assert.assertTrue(
      accountDashboardPage
        .brandSnapshotPanel.waitForLoaderToDisappear()
        .brandSnapshotPanel.areResultsLoadedFor(BrandSnapshotPanel.DrillLevel.Brand),
      "Left brands panel failed to reload for stores"
    );
  }

  private void drillRightPanelToTop() {
    accountDashboardPage.topBottomPanel.drillUp();
    Assert.assertTrue(
      accountDashboardPage
        .topBottomPanel.areResultsLoadedFor(TopBottomPanel.DrillLevel.SubAccounts),
      "Right accounts panel failed to load subaccounts"
    );
    Assert.assertTrue(
      accountDashboardPage
        .brandSnapshotPanel.waitForLoaderToDisappear()
        .brandSnapshotPanel.areResultsLoadedFor(BrandSnapshotPanel.DrillLevel.Brand),
      "Left brands panel failed to reload for subaccounts"
    );

    accountDashboardPage.topBottomPanel.drillUp();
    Assert.assertTrue(
      accountDashboardPage
        .topBottomPanel.areResultsLoadedFor(TopBottomPanel.DrillLevel.Accounts),
      "Right accounts panel failed to load accounts"
    );
    Assert.assertTrue(
      accountDashboardPage
        .brandSnapshotPanel.waitForLoaderToDisappear()
        .brandSnapshotPanel.areResultsLoadedFor(BrandSnapshotPanel.DrillLevel.Brand),
      "Left brands panel failed to reload for accounts"
    );

    accountDashboardPage.topBottomPanel.drillUp();
    Assert.assertTrue(
      accountDashboardPage
        .topBottomPanel.areResultsLoadedFor(TopBottomPanel.DrillLevel.Distributors),
      "Right accounts panel failed to load distributors"
    );
    Assert.assertTrue(
      accountDashboardPage
        .brandSnapshotPanel.waitForLoaderToDisappear()
        .brandSnapshotPanel.areResultsLoadedFor(BrandSnapshotPanel.DrillLevel.Brand),
      "Left brands panel failed to reload for distributors"
    );
  }

  @Test(description = "Brands hierarchy - Drill all the way down and drill back up")
  public void drillDownDrillUpBrands() {
    accountDashboardPage
      .brandSnapshotPanel.drillIntoFirstRow()
      .brandSnapshotPanel.waitForLoaderToDisappear()
      .topBottomPanel.waitForLoaderToDisappear();
    Assert.assertTrue(
      accountDashboardPage
        .brandSnapshotPanel.areResultsLoadedFor(BrandSnapshotPanel.DrillLevel.SkuPackage),
      "Left brands panel failed to load for SKU/Packages"
    );
    Assert.assertTrue(
      accountDashboardPage.topBottomPanel.areResultsLoadedFor(TopBottomPanel.DrillLevel.Distributors),
      "Right accounts panel failed to reload for SKU/Packages"
    );

    accountDashboardPage
      .brandSnapshotPanel.drillUp()
      .brandSnapshotPanel.waitForLoaderToDisappear()
      .topBottomPanel.waitForLoaderToDisappear();
    Assert.assertTrue(
      accountDashboardPage
        .brandSnapshotPanel.areResultsLoadedFor(BrandSnapshotPanel.DrillLevel.Brand),
      "Left brands panel failed to load for Brands"
    );
    Assert.assertTrue(
      accountDashboardPage.topBottomPanel.areResultsLoadedFor(TopBottomPanel.DrillLevel.Distributors),
      "Right accounts panel failed to reload for Brands"
    );
  }

  @DataProvider public static Object[][] searchData() {
    return new Object[][]{
      {"COASTAL BEV CO", "WILMINGTON"}
    };
  }
}
