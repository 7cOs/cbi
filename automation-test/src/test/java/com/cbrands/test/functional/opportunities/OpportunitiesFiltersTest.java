package com.cbrands.test.functional.opportunities;

import com.cbrands.TestUser;
import com.cbrands.pages.Login;
import com.cbrands.pages.LogoutPage;
import com.cbrands.pages.OpportunitiesPage;
import com.cbrands.pages.OpportunitiesPage.PremiseType;
import com.cbrands.test.BaseTestCase;
import org.openqa.selenium.support.PageFactory;
import org.testng.Assert;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.DataProvider;
import org.testng.annotations.Test;

public class OpportunitiesFiltersTest extends BaseTestCase {

  private Login loginPage;
  private LogoutPage logoutPage;
  private OpportunitiesPage opportunitiesPage;

  @BeforeMethod
  public void setUp() {
    loginPage = new Login(driver);
    logoutPage = new LogoutPage(driver);

    driver.get(webAppBaseUrl);
    loginPage.loginAs(TestUser.ACTOR4);

    opportunitiesPage = PageFactory.initElements(driver, OpportunitiesPage.class);
    opportunitiesPage.goToPage();
  }

  @AfterMethod
  public void tearDown() {
    logoutPage.goToPage();
  }

  @Test(description = "Filter Opportunities by Chain Retailer", dataProvider = "chainRetailersData")
  public void filterByChainRetailer(String accountName, PremiseType premiseType) {
    opportunitiesPage
      .clickRetailerTypeDropdown()
      .selectChainRetailerType()
      .enterChainRetailerSearchText(accountName)
      .clickSearchForChainRetailer()
      .clickFirstChainRetailerResultContaining(accountName);

    Assert.assertTrue(
      opportunitiesPage.isPremiseFilterSelectedAs(premiseType),
      "Premise Type filter failed to match premise type of selected Chain"
    );
    Assert.assertTrue(
      opportunitiesPage.doesPremiseTypeChipMatch(premiseType),
      "Premise Type chip failed to match premise type of selected Chain"
    );
    Assert.assertTrue(
      opportunitiesPage.isQueryChipPresent(accountName),
      "Query chip failed to appear for selected Chain"
    );
    Assert.assertTrue(opportunitiesPage.isChainSearchTextCleared(), "Chain searchbox failed to clear after selection");

    opportunitiesPage.removeChipContaining(accountName);
    Assert.assertFalse(
      opportunitiesPage.isQueryChipPresent(accountName),
      "Query chip failed to be removed for selected Chain"
    );
  }

  @Test(description = "Filter Opportunities by Store Retailer", dataProvider = "storeRetailersData")
  public void filterByStoreRetailer(String accountName, String accountAddress, PremiseType premiseType) {
    opportunitiesPage
      .clickRetailerTypeDropdown()
      .selectStoreRetailerType()
      .enterStoreRetailerSearchText(accountName)
      .clickSearchForStoreRetailer()
      .clickFirstStoreRetailerResultContaining(accountAddress);

    Assert.assertTrue(
      opportunitiesPage.isPremiseFilterSelectedAs(premiseType),
      "Premise Type filter failed to match premise type of selected Store"
    );
    Assert.assertTrue(
      opportunitiesPage.doesPremiseTypeChipMatch(premiseType),
      "Premise Type chip failed to match premise type of selected Store"
    );
    Assert.assertTrue(
      opportunitiesPage.isQueryChipPresent(accountAddress),
      "Query chip failed to appear for selected Store"
    );
    Assert.assertTrue(opportunitiesPage.isStoreSearchTextCleared(), "Store searchbox failed to clear after selection");

    opportunitiesPage.removeChipContaining(accountAddress);
    Assert.assertFalse(
      opportunitiesPage.isQueryChipPresent(accountAddress),
      "Query chip failed to be removed for selected Store"
    );
  }

  @Test(description = "Filter Opportunities by Distributor", dataProvider = "distributorsData")
  public void filterByDistributor(String distributor) {
      opportunitiesPage
        .enterDistributorSearchText(distributor)
        .clickSearchForDistributor()
        .clickFirstDistributorResult();

    Assert.assertTrue(
      opportunitiesPage.isPremiseFilterSelectedAs(PremiseType.Off),
      "Unexpected Premise Type filter default value"
    );
    Assert.assertTrue(
      opportunitiesPage.doesPremiseTypeChipMatch(PremiseType.Off),
      "Unexpected Premise Type chip default value"
    );
    Assert.assertTrue(
      opportunitiesPage.isQueryChipPresent(distributor),
      "Query chip failed to appear for selected Distributor"
    );
    Assert.assertTrue(
      opportunitiesPage.isDistributorSearchTextCleared(),
      "Distributor searchbox failed to clear after selection"
    );

    opportunitiesPage.removeChipContaining(distributor);
    Assert.assertFalse(
      opportunitiesPage.isQueryChipPresent(distributor),
      "Query chip failed to be removed for selected Distributor"
    );
  }

  @DataProvider
  public static Object[][] chainRetailersData() {
    return new Object[][]{
      {"Buffalo Wild Wings", PremiseType.On},
      {"Walgreens", PremiseType.Off}
    };
  }

  @DataProvider
  public static Object[][] storeRetailersData() {
    return new Object[][]{
      {"Walgreens", "2550 E 88th Ave", PremiseType.On},
      {"Walgreens", "1350 Sportsman Way", PremiseType.Off}
    };
  }

  @DataProvider
  public static Object[][] distributorsData() {
    return new Object[][]{
      {"Chicago Bev"}
    };
  }
}
