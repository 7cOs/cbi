package com.cbrands.test.smoke;

import com.cbrands.TestUser;
import com.cbrands.pages.HomePage;
import com.cbrands.pages.Login;
import com.cbrands.pages.LogoutPage;
import com.cbrands.pages.opportunities.OpportunitiesPage;
import com.cbrands.test.BaseTestCase;
import org.openqa.selenium.support.PageFactory;
import org.testng.Assert;
import org.testng.annotations.*;

import java.net.MalformedURLException;

public class OpportunitiesTest extends BaseTestCase {
  private LogoutPage logoutPage;
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
    final TestUser testUser = TestUser.ACTOR4;

    final Login loginPage = new Login(driver);
    logoutPage = new LogoutPage(driver);

    log.info("\nLoading webpage...");
    driver.get(webAppBaseUrl);
    final HomePage homePage = loginPage.loginAs(testUser);
    Assert.assertTrue(homePage.isLoaded(), "Failed to log in user: " + testUser.userName());

    opportunitiesPage = PageFactory.initElements(driver, OpportunitiesPage.class);
    opportunitiesPage.goToPage();
  }

  @AfterMethod
  public void tearDown() {
    logoutPage.goToPage();
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
