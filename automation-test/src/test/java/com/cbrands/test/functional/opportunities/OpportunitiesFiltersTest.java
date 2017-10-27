package com.cbrands.test.functional.opportunities;

import com.cbrands.TestUser;
import com.cbrands.pages.Login;
import com.cbrands.pages.LogoutPage;
import com.cbrands.pages.opportunities.OpportunitiesPage;
import com.cbrands.pages.opportunities.OpportunitiesPage.PremiseType;
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
  }

  private void loginToOpportunitiesPage(TestUser user) {
    loginPage.loginAs(user);

    opportunitiesPage = PageFactory.initElements(driver, OpportunitiesPage.class);
    opportunitiesPage.goToPage();
  }

  @AfterMethod
  public void tearDown() {
    logoutPage.goToPage();
  }

  @Test(description = "Filter Opportunities by Chain Retailer", dataProvider = "chainRetailersData")
  public void filterByChainRetailer(TestUser user, String accountName, PremiseType premiseType) {
    loginToOpportunitiesPage(user);

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
  public void filterByStoreRetailer(TestUser user, String accountName, String accountAddress, PremiseType premiseType) {
    loginToOpportunitiesPage(user);

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
  public void filterByDistributor(TestUser user, String distributor) {
    loginToOpportunitiesPage(user);

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

  @Test(description = "Account Scope filter chips", dataProvider = "accountScopeChipUserData")
  public void accountScopeFilterChips(TestUser user) {
    loginToOpportunitiesPage(user);

    Assert.assertTrue(opportunitiesPage.isMyAccountsOnlySelected(), "Account Scope filter is not selected by default.");
    Assert.assertTrue(
      opportunitiesPage.isAccountScopeChipPresent(),
      "Account Scope filter chip is not present by default."
    );

    opportunitiesPage.clickAccountScopeCheckbox();
    Assert.assertFalse(opportunitiesPage.isMyAccountsOnlySelected(), "Account Scope filter did not deselect.");
    Assert.assertFalse(
      opportunitiesPage.isAccountScopeChipPresent(),
      "Account Scope filter chip did not hide when filter was deselected."
    );

    opportunitiesPage.clickAccountScopeCheckbox();
    Assert.assertTrue(opportunitiesPage.isMyAccountsOnlySelected(), "Account Scope filter did not select.");
    Assert.assertTrue(
      opportunitiesPage.isAccountScopeChipPresent(),
      "Account Scope filter chip did not appear when filter was selected."
    );

    opportunitiesPage.removeAccountScopeChip();
    Assert.assertFalse(opportunitiesPage.isMyAccountsOnlySelected(), "Account Scope filter did not deselect.");
    Assert.assertFalse(
      opportunitiesPage.isAccountScopeChipPresent(),
      "Account Scope filter chip was not removed after clicking on the X."
    );
  }

  @Test(description = "Filtering by Account Scope for a Corporate user", dataProvider =
    "accountScopeCorporateUserData")
  public void filterByAccountScopeForCorporateUser(TestUser user, String notMyDistributor) {
    loginToOpportunitiesPage(user);

    Assert.assertTrue(opportunitiesPage.isMyAccountsOnlySelected(), "Account Scope filter is not selected by default.");

    final int filteredCount =
      opportunitiesPage
        .enterDistributorSearchText(notMyDistributor)
        .clickSearchForDistributor()
        .clickFirstDistributorResult()
        .clickApplyFiltersButton()
        .waitForLoaderToDisappear()
        .getDisplayedOpportunitiesCount();

    final int unfilteredCount =
      opportunitiesPage
        .clickAccountScopeCheckbox()
        .clickApplyFiltersButton()
        .waitForLoaderToDisappear()
        .getDisplayedOpportunitiesCount();

    Assert.assertTrue(
      unfilteredCount == filteredCount,
      "Number of filtered Opportunities not equal to the count of unfiltered Opportunities. " +
        "Corporate users should not be filtered regardless of selected Account Scope filter value." +
        "\nFiltered count: " + filteredCount +
        "\nUnfiltered count: " + unfilteredCount
    );
  }

  @Test(description = "Filtering by Account Scope for a Non-Corporate user", dataProvider =
    "accountScopeNonCorporateUserData")
  public void filterByAccountScopeForNonCorporateUser(TestUser user, String myDistributor, String notMyDistributor) {
    loginToOpportunitiesPage(user);

    Assert.assertTrue(opportunitiesPage.isMyAccountsOnlySelected(), "Account Scope filter is not selected by default.");
    final int countForMyDistributor = opportunitiesPage
      .enterDistributorSearchText(myDistributor)
      .clickSearchForDistributor()
      .clickFirstDistributorResult()
      .clickApplyFiltersButton()
      .waitForLoaderToDisappear()
      .getDisplayedOpportunitiesCount();

    Assert.assertTrue(countForMyDistributor > 0, "No opportunities present for Distributor belonging to user.");

    final int filteredCountForOtherDistributor = opportunitiesPage
      .removeChipContaining(myDistributor)
      .enterDistributorSearchText(notMyDistributor)
      .clickSearchForDistributor()
      .clickFirstDistributorResult()
      .clickApplyFiltersButton()
      .waitForLoaderToDisappear()
      .getDisplayedOpportunitiesCount();

    Assert.assertTrue(filteredCountForOtherDistributor == 0, "Opportunities present for Distributor not belonging to user.");

    final int unfilteredCountForOtherDistributor =
      opportunitiesPage
        .clickAccountScopeCheckbox()
        .clickApplyFiltersButton()
        .waitForLoaderToDisappear()
        .getDisplayedOpportunitiesCount();

    Assert.assertTrue(
      unfilteredCountForOtherDistributor > filteredCountForOtherDistributor,
      "Number of unfiltered Opportunities is not greater than the count of filtered Opportunities." +
        "\nFiltered count: " + filteredCountForOtherDistributor +
        "\nUnfiltered count: " + unfilteredCountForOtherDistributor
    );
  }

  @DataProvider
  public static Object[][] chainRetailersData() {
    return new Object[][]{
      {TestUser.ACTOR4, "Buffalo Wild Wings", PremiseType.On},
      {TestUser.ACTOR4, "Walgreens", PremiseType.Off}
    };
  }

  @DataProvider
  public static Object[][] storeRetailersData() {
    return new Object[][]{
      {TestUser.ACTOR4, "Walgreens", "2550 E 88th Ave", PremiseType.On},
      {TestUser.ACTOR4, "Walgreens", "1350 Sportsman Way", PremiseType.Off}
    };
  }

  @DataProvider
  public static Object[][] distributorsData() {
    return new Object[][]{
      {TestUser.ACTOR4, "Healy Wholesale"}
    };
  }

  @DataProvider
  public static Object[][] accountScopeChipUserData() {
    return new Object[][]{
      {TestUser.ACTOR4},
      {TestUser.CORPORATE_ACTOR}
    };
  }

  @DataProvider
  public static Object[][] accountScopeCorporateUserData() {
    return new Object[][]{
      {TestUser.CORPORATE_ACTOR, "Chicago Bev"}
    };
  }

  @DataProvider
  public static Object[][] accountScopeNonCorporateUserData() {
    return new Object[][]{
      {TestUser.ACTOR4, "Healy Wholesale", "Chicago Bev"}
    };
  }
}
