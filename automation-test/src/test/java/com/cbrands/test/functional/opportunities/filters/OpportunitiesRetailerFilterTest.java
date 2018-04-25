package com.cbrands.test.functional.opportunities.filters;

import com.cbrands.PremiseType;
import com.cbrands.TestUser;
import com.cbrands.pages.LoginPage;
import com.cbrands.pages.LogoutPage;
import com.cbrands.pages.opportunities.OpportunitiesPage;
import com.cbrands.test.BaseTestCase;
import org.openqa.selenium.support.PageFactory;
import org.testng.Assert;
import org.testng.annotations.*;

import java.lang.reflect.Method;
import java.net.MalformedURLException;

public class OpportunitiesRetailerFilterTest extends BaseTestCase {

  private OpportunitiesPage opportunitiesPage;

  @BeforeMethod
  public void setUp(Method method) throws MalformedURLException {
    final String testDescription = method.getAnnotation(Test.class).description();
    final String testName = String.format("Functional - OpportunitiesFiltersTest - %s", testDescription);
    this.startUpBrowser(testName);
    PageFactory.initElements(driver, LoginPage.class).loginAs(TestUser.ACTOR4);

    opportunitiesPage = PageFactory.initElements(driver, OpportunitiesPage.class);
    opportunitiesPage.goToPage();
  }

  @AfterMethod
  public void tearDown() {
    PageFactory.initElements(driver, LogoutPage.class).goToPage();
    this.shutDownBrowser();
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
}
