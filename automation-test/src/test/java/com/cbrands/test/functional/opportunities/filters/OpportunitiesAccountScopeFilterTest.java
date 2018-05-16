package com.cbrands.test.functional.opportunities.filters;

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

public class OpportunitiesAccountScopeFilterTest extends BaseTestCase {

  private OpportunitiesPage opportunitiesPage;

  @BeforeMethod
  public void setUpClass(Method method) throws MalformedURLException {
    final String testDescription = method.getAnnotation(Test.class).description();
    final String testName = String.format("Functional - OpportunitiesFiltersTest - %s", testDescription);
    this.startUpBrowser(testName);
  }

  @AfterMethod
  public void tearDown() {
    PageFactory.initElements(driver, LogoutPage.class).goToPage();
    this.shutDownBrowser();
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

  private void loginToOpportunitiesPage(TestUser user) {
    PageFactory.initElements(driver, LoginPage.class).loginAs(user);

    opportunitiesPage = PageFactory.initElements(driver, OpportunitiesPage.class);
    opportunitiesPage.goToPage();
  }
}
