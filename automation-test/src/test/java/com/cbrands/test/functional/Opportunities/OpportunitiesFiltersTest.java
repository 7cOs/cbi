package com.cbrands.test.functional.opportunities;

import com.cbrands.TestUser;
import com.cbrands.pages.Login;
import com.cbrands.pages.LogoutPage;
import com.cbrands.pages.OpportunitiesPage;
import com.cbrands.test.BaseTestCase;
import org.openqa.selenium.support.PageFactory;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;

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

}
