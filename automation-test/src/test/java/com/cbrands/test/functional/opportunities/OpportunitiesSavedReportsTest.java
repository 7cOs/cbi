package com.cbrands.test.functional.opportunities;

import com.cbrands.TestUser;
import com.cbrands.pages.HomePage;
import com.cbrands.pages.Login;
import com.cbrands.pages.LogoutPage;
import com.cbrands.pages.opportunities.OpportunitiesPage;
import com.cbrands.test.BaseTestCase;
import org.openqa.selenium.support.PageFactory;
import org.testng.Assert;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.DataProvider;
import org.testng.annotations.Test;

public class OpportunitiesSavedReportsTest extends BaseTestCase {
  static String current_time_stamp = new java.text.SimpleDateFormat("MM.dd.yyyy HH:mm:ss").format(new java.util.Date());

  private Login loginPage;
  private LogoutPage logoutPage;
  private HomePage homePage;
  private OpportunitiesPage opportunitiesPage;

  @BeforeMethod
  public void setUp() {
    final TestUser testUser = TestUser.ACTOR4;

    loginPage = new Login(driver);
    logoutPage = new LogoutPage(driver);

    log.info("\nLoading webpage...");
    driver.get(webAppBaseUrl);
    homePage = loginPage.loginAs(testUser);
    Assert.assertTrue(homePage.isLoaded(), "Failed to log in user: " + testUser.userName());

    opportunitiesPage = PageFactory.initElements(driver, OpportunitiesPage.class);
    opportunitiesPage.goToPage();
  }

  @AfterMethod
  public void tearDown() {
    logoutPage.goToPage();
  }

  @Test(description = "Creating an Opportunities Saved Report", dataProvider = "savedReportData")
  public void createSavedReport(String name, String distributorSearchText) {
    opportunitiesPage
      .deleteAllSavedReports()
      .enterDistributorSearchText(distributorSearchText)
      .clickSearchForDistributor()
      .clickFirstDistributorResult()
      .clickApplyFiltersButton()
      .waitForLoaderToDisappear()
      .clickSaveReportLink()
      .enterReportName(name)
      .clickSaveReportButton()
      .clickSavedReportsDropdown();

    Assert.assertTrue(
      opportunitiesPage.doesSavedReportExistWithName(name),
      "Saved Report with name " + name + " failed to appear in the dropdown on the Opportunities page."
    );

    homePage.goToPage();
    Assert.assertTrue(
      homePage.clickSavedReportsDropdown().doesSavedReportExistWithName(name),
      "Saved Report with name " + name + " failed to appear in the dropdown on the Home page."
    );
  }

  @DataProvider
  public static Object[][] savedReportData() {
    final String testReportName = "Functional Test: " + current_time_stamp;
    return new Object[][]{
      {testReportName, "Healy Wholesale"}
    };
  }

}
