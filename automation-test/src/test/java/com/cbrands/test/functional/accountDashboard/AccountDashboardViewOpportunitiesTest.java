package com.cbrands.test.functional.accountDashboard;

import com.cbrands.PremiseType;
import com.cbrands.TestUser;
import com.cbrands.pages.AccountDashboardPage;
import com.cbrands.pages.LoginPage;
import com.cbrands.pages.LogoutPage;
import com.cbrands.pages.opportunities.OpportunitiesPage;
import com.cbrands.test.BaseTestCase;
import org.openqa.selenium.support.PageFactory;
import org.testng.Assert;
import org.testng.annotations.*;

import java.net.MalformedURLException;

public class AccountDashboardViewOpportunitiesTest extends BaseTestCase {
  private AccountDashboardPage accountDashboardPage;

  @BeforeClass
  public void setUpClass() throws MalformedURLException {
    this.startUpBrowser("Functional - AccountDashboard - View Opportunities Test");
  }

  @AfterClass
  public void tearDownClass() {
    this.shutDownBrowser();
  }

  @BeforeMethod
  public void setUp() {
    PageFactory.initElements(driver, LoginPage.class).loginAs(TestUser.ACTOR4);

    accountDashboardPage = PageFactory.initElements(driver, AccountDashboardPage.class);
    accountDashboardPage.goToPage();
  }

  @AfterMethod
  public void tearDown() {
    PageFactory.initElements(driver, LogoutPage.class).goToPage();
  }

  @Test(
    description = "Enabling/Disabling the View Opportunities link from Account Dashboard page",
    dataProvider = "filterData"
  )
  public void enableOpportunitiesLink(PremiseType premiseType, String distributorName) {
    Assert.assertFalse(
      accountDashboardPage.isOpportunitiesLinkEnabled(),
      "Opportunities link failed to be disabled by default, when no filters are applied."
    );

    accountDashboardPage
      .filterForm.selectPremiseType(premiseType)
      .enterDistributorSearchText(distributorName)
      .clickSearchForDistributor()
      .selectDistributorFilterContaining(distributorName);

    Assert.assertFalse(
      accountDashboardPage.isOpportunitiesLinkEnabled(),
      "Opportunities link enabled pre-maturely. Should not be enabled until after filters are applied."
    );

    accountDashboardPage
      .clickApplyFilters()
      .waitForBrandsPanelLoaderToDisappear()
      .waitForMarketPanelLoaderToDisappear();

    Assert.assertTrue(
      accountDashboardPage.isOpportunitiesLinkEnabled(),
      "Opportunities link failed to be enabled after valid Premise Type and Distributor filters are applied."
    );
  }

  @Test(
    description = "View Opportunities using the current Account Dashboard filters",
    dataProvider = "filterData"
  )
  public void viewOpportunities(PremiseType premiseType, String distributorName) {
    final OpportunitiesPage opportunitiesPage = accountDashboardPage
      .filterForm.selectPremiseType(premiseType)
      .enterDistributorSearchText(distributorName)
      .clickSearchForDistributor()
      .selectDistributorFilterContaining(distributorName)
      .clickApplyFilters()
      .waitForBrandsPanelLoaderToDisappear()
      .waitForMarketPanelLoaderToDisappear()
      .clickSeeAllOpportunitiesLink()
      .waitForLoaderToDisappear();

    Assert.assertTrue(
      opportunitiesPage.isQueryChipPresent(distributorName),
      "The following distributor filter failed to be applied to Opportunities: " + distributorName
    );
    Assert.assertTrue(
      opportunitiesPage.doesPremiseTypeChipMatch(premiseType),
      "The following Premise Type filter failed to be applied to Opportunities: " + premiseType.name()
    );
  }

  @DataProvider
  public static Object[][] filterData() {
    return new Object[][]{
      new Object[]{PremiseType.Off, "Healy Wholesale"},
      new Object[]{PremiseType.On, "Healy Wholesale"}
    };
  }

}
