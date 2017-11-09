package com.cbrands.test.functional.accountDashboard;

import com.cbrands.PremiseType;
import com.cbrands.pages.AccountDashboardPage;

import com.cbrands.TestUser;
import com.cbrands.pages.HomePage;
import com.cbrands.pages.Login;
import com.cbrands.pages.LogoutPage;
import com.cbrands.pages.opportunities.OpportunitiesPage;
import com.cbrands.test.BaseTestCase;
import org.openqa.selenium.support.PageFactory;
import org.testng.Assert;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.DataProvider;
import org.testng.annotations.Test;

public class AccountDashboardViewOpportunitiesTest extends BaseTestCase {
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

  @Test(
    description = "Enabling the View Opportunities link from Account Dashboard page",
    dataProvider = "filterData"
  )
  public void enableOpportunitiesLink(PremiseType premiseType, String distributorName) {
    Assert.assertFalse(
      accountDashboardPage.isOpportunitiesLinkEnabled(),
      "Opportunities link failed to be disabled by default, when no filters are applied."
    );

    accountDashboardPage
      .selectPremiseType(premiseType)
      .enterDistributorSearchText(distributorName)
      .clickSearchForDistributor()
      .selectDistributorFilterByName(distributorName);

    Assert.assertFalse(
      accountDashboardPage.isOpportunitiesLinkEnabled(),
      "Opportunities link enabled pre-maturely. Should not be enabled until after filters are applied."
    );

    accountDashboardPage
      .clickApplyFilters()
      .waitForBrandsLoaderToDisappear()
      .waitForMarketLoaderToDisappear();

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
      .selectPremiseType(premiseType)
      .enterDistributorSearchText(distributorName)
      .clickSearchForDistributor()
      .selectDistributorFilterByName(distributorName)
      .clickApplyFilters()
      .waitForBrandsLoaderToDisappear()
      .waitForMarketLoaderToDisappear()
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
