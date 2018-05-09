package com.cbrands.test.functional.opportunities.filters;

import com.cbrands.PremiseType;
import com.cbrands.TestUser;
import com.cbrands.pages.LoginPage;
import com.cbrands.pages.LogoutPage;
import com.cbrands.pages.opportunities.OpportunitiesPage;
import com.cbrands.test.BaseTestCase;

import java.lang.reflect.Method;
import java.net.MalformedURLException;

import org.openqa.selenium.support.PageFactory;
import org.testng.Assert;
import org.testng.annotations.*;

public class OpportunitiesDistributorFilterTest extends BaseTestCase {

  private OpportunitiesPage opportunitiesPage;

  @BeforeMethod
  public void setUp(Method method) throws MalformedURLException {
    this.startUpBrowser(String.format("Functional - Opportunities Distributor Filter Test - %s",
      method.getAnnotation(Test.class).description()));

    PageFactory.initElements(driver, LoginPage.class).loginAs(TestUser.ACTOR4);
    opportunitiesPage = PageFactory.initElements(driver, OpportunitiesPage.class);
    opportunitiesPage.goToPage();
  }

  @AfterMethod
  public void tearDown() {
    PageFactory.initElements(driver, LogoutPage.class).goToPage();
    this.shutDownBrowser();
  }

  @Test(description = "Filter Opportunities by Distributor", dataProvider = "distributorsData")
  public void filterByDistributor(final String distributor) {
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

  @Test(description = "Reset filters before clicking Applying Filters button", dataProvider = "distributorsData")
  public void resetBeforeApplyingFilters(final String distributor) {

    opportunitiesPage.enterDistributorSearchText(distributor).clickSearchForDistributor().clickFirstDistributorResult();

    Assert.assertTrue(opportunitiesPage.isQueryChipPresent(distributor),
      "Selected distributor chip IS NOT present post distributor select");

    opportunitiesPage.clickResetFilters();

    Assert.assertFalse(opportunitiesPage.isQueryChipPresent(distributor),
      "Selected distributor chip IS present post distributor select");
  }

  @Test(description = "Apply Filters then Reset Opportunities page filters" , dataProvider = "distributorsData")
  public void applyFiltersThenReset(final String distributor) {

    opportunitiesPage.enterDistributorSearchText( distributor )
      .clickSearchForDistributor()
      .clickFirstDistributorResult();

    Assert.assertTrue( opportunitiesPage.isQueryChipPresent( distributor ),
      "Selected distributor chip IS NOT present post distributor select" );

    opportunitiesPage
      .clickApplyFiltersButton()
      .waitForLoaderToDisappear()
      .clickResetFilters();

    Assert.assertFalse( opportunitiesPage.isQueryChipPresent( distributor ),
      "Selected distributor chip IS present post distributor select" );
  }

  @DataProvider
  public static Object[][] distributorsData() {
    return new Object[][]{
      {"Healy Wholesale"}
    };
  }


}
