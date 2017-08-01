package com.cbrands.test.smoke;

import com.cbrands.TestUser;
import com.cbrands.pages.HomePage;
import com.cbrands.pages.Login;
import com.cbrands.pages.LogoutPage;
import com.cbrands.pages.OpportunitiesPage;
import org.openqa.selenium.support.PageFactory;
import org.testng.Assert;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

public class OpportunitiesTest extends BaseTestCase {
  private LogoutPage logoutPage;
  private OpportunitiesPage opportunitiesPage;

  @BeforeMethod
  public void setUp() {
    final TestUser testUser = TestUser.ACTOR4;

    final Login login = new Login(driver);
    logoutPage = new LogoutPage(driver);

    log.info("\nLoading webpage...");
    driver.get(webAppBaseUrl);
    final HomePage homePage = login.loginWithValidCredentials(testUser.userName(), testUser.password());
    Assert.assertTrue(homePage.isOnHomePage(), "Failed to log in user: " + testUser.userName());

    opportunitiesPage = PageFactory.initElements(driver, OpportunitiesPage.class);
    opportunitiesPage.goToPage();
  }

  @AfterMethod
  public void tearDown() {
    logoutPage.goToPage();
  }

  @Test(description = "Search Opportunities")
  public void searchOpportunities() {
    Assert.assertTrue(opportunitiesPage.isLoaded());
  }

}
