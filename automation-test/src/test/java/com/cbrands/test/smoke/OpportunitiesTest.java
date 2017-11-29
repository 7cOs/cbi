package com.cbrands.test.smoke;

import com.cbrands.TestUser;
import com.cbrands.pages.LoginPage;
import com.cbrands.pages.LogoutPage;
import com.cbrands.pages.opportunities.OpportunitiesPage;
import com.cbrands.test.BaseTestCase;
import org.openqa.selenium.support.PageFactory;
import org.testng.Assert;
import org.testng.annotations.*;

import java.net.MalformedURLException;

public class OpportunitiesTest extends BaseTestCase {
  private OpportunitiesPage opportunitiesPage;

  @BeforeClass
  public void setUpClass() throws MalformedURLException {
    this.startUpBrowser("Smoke - Opportunities Test");
  }

  @AfterClass
  public void tearDownClass() {
    this.shutDownBrowser();
  }

  @BeforeMethod
  public void setUp() {
    PageFactory.initElements(driver, LoginPage.class).loginAs(TestUser.ACTOR4);

    opportunitiesPage = PageFactory.initElements(driver, OpportunitiesPage.class);
    opportunitiesPage.goToPage();
  }

  @AfterMethod
  public void tearDown() {
    PageFactory.initElements(driver, LogoutPage.class).goToPage();
  }

  @Test(description = "Search Opportunities")
  public void searchOpportunities() {
    opportunitiesPage
      .enterChainRetailerSearchText("Walgreens")
      .clickSearchForChainRetailer()
      .clickFirstChainRetailerResult()
      .clickApplyFiltersButton()
      .waitForLoaderToDisappear();

    Assert.assertTrue(opportunitiesPage.hasOpportunityResults(), "No results returned after opportunities search. " +
      "Results expected.");
  }

}
