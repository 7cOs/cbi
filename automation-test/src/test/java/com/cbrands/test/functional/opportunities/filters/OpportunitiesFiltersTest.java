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

import java.net.MalformedURLException;

public class OpportunitiesFiltersTest extends BaseTestCase {

  private OpportunitiesPage opportunitiesPage;

  @BeforeClass
  public void setUpClass() throws MalformedURLException {
    this.startUpBrowser("Functional - OpportunitiesFiltersTest");
  }

  @AfterClass
  public void tearDownClass() {
    this.shutDownBrowser();
  }

  @AfterMethod
  public void tearDown() {
    PageFactory.initElements(driver, LogoutPage.class).goToPage();
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

  @DataProvider
  public static Object[][] distributorsData() {
    return new Object[][]{
      {TestUser.ACTOR4, "Healy Wholesale"}
    };
  }

  private void loginToOpportunitiesPage(TestUser user) {
    PageFactory.initElements(driver, LoginPage.class).loginAs(user);

    opportunitiesPage = PageFactory.initElements(driver, OpportunitiesPage.class);
    opportunitiesPage.goToPage();
  }
}
