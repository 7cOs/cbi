package com.cbrands.test.functional.opportunities.filters;

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

public class OpportunitiesResetFiltersTest extends BaseTestCase {

  private OpportunitiesPage opportunitiesPage;
  private String distributor;

  @BeforeMethod
  public void setUp(Method method) throws MalformedURLException {

    distributor = "Healy Wholesale";

    this.startUpBrowser(String.format("Functional - Opportunities Reset Filter Test - %s",
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

  @Test(description = "Reset filters before clicking Applying Filters button")
  public void resetBeforeApplyingFilters() {

    opportunitiesPage.enterDistributorSearchText(distributor).clickSearchForDistributor().clickFirstDistributorResult();

    Assert.assertTrue(opportunitiesPage.isQueryChipPresent(distributor),
        "Selected distributor chip IS NOT present post distributor select");

    opportunitiesPage.clickResetFilters();

    Assert.assertFalse(opportunitiesPage.isQueryChipPresent(distributor),
        "Selected distributor chip IS present post distributor select");
  }

}