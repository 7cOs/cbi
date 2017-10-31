package com.cbrands.test.functional.opportunities;

import com.cbrands.TestUser;
import com.cbrands.pages.HomePage;
import com.cbrands.pages.Login;
import com.cbrands.pages.LogoutPage;
import com.cbrands.pages.opportunities.OpportunitiesPage;
import com.cbrands.pages.opportunities.SavedReportModal;
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

  @Test(description = "Creating an Opportunities Saved Report", dataProvider = "createRunReportData")
  public void createSavedReport(String name, String distributorSearchText) {
    opportunitiesPage.deleteAllSavedReports();
    saveNewReport(name, distributorSearchText)
      .waitForModalToClose()
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

  @Test(
    description = "Running an Opportunities Saved Report from the Opportunities page",
    dependsOnMethods = "createSavedReport",
    dataProvider = "createRunReportData"
  )
  public void runSavedReportFromOpportunitiesPage(String reportName, String distributor) {
    opportunitiesPage
      .clickSavedReportsDropdown()
      .selectSavedReportWithName(reportName)
      .waitForLoaderToDisappear();

    Assert.assertTrue(opportunitiesPage.isQueryChipPresent(distributor), "Expected filter is not present.");
    Assert.assertTrue(opportunitiesPage.hasOpportunityResults(), "Results failed to appear after applying filters.");
  }

  @Test(
    description = "Running an Opportunities Saved Report from the Home page",
    dependsOnMethods = "createSavedReport",
    dataProvider = "createRunReportData"
  )
  public void runSavedReportFromHomePage(String reportName, String distributor) {
    homePage.goToPage();
    opportunitiesPage = homePage
      .clickSavedReportsDropdown()
      .selectSavedReportWithName(reportName)
      .waitForLoaderToDisappear();
    Assert.assertTrue(opportunitiesPage.isQueryChipPresent(distributor), "Expected filter is not present.");
    Assert.assertTrue(opportunitiesPage.hasOpportunityResults(), "Results failed to appear after applying filters.");
  }

  @Test(
    description = "Attempting to edit a Saved Report to an existing name",
    dependsOnMethods = "createSavedReport",
    dataProvider = "savedReportData"
  )
  public void attemptToEditWithExistingName(String reportName, String distributor) {
    final SavedReportModal savedReportModal = opportunitiesPage
      .clickSavedReportsDropdown()
      .openModalForSavedReportWithName(reportName)
      .enterNewReportName(reportName)
      .clickSave();

    Assert.assertTrue(
      savedReportModal.isDuplicateNameErrorDisplayed(),
      "Failed to display error when attempting to use the name of an existing list."
    );
  }

  @Test(
    description = "Editing a Saved Report",
    dependsOnMethods = {"createSavedReport", "attemptToEditWithExistingName"},
    dataProvider = "savedReportData"
  )
  public void editSavedReport(String reportName, String distributor) {
    final String editedReportName = "EDITED " + reportName;
    opportunitiesPage
      .clickSavedReportsDropdown()
      .openModalForSavedReportWithName(reportName)
      .enterNewReportName(editedReportName)
      .clickSave()
      .waitForModalToClose();

    Assert.assertTrue(
      opportunitiesPage.doesSavedReportExistWithName(editedReportName),
      "Saved Report with edited name " + editedReportName +
        " failed to appear in the dropdown on the Opportunities page."
    );

    homePage.goToPage();
    Assert.assertTrue(
      homePage.clickSavedReportsDropdown().doesSavedReportExistWithName(editedReportName),
      "Saved Report with edited  name " + editedReportName + " failed to appear in the dropdown on the Home page."
    );
  }

  @DataProvider
  public static Object[][] createRunReportData() {
    final String testReportName = "Functional Test: " + current_time_stamp;
    return new Object[][]{
      {"Create & Run " + testReportName, "Healy Wholesale"}
    };
  }

  private SavedReportModal saveNewReport(String name, String distributorSearchText) {
    return opportunitiesPage
      .enterDistributorSearchText(distributorSearchText)
      .clickSearchForDistributor()
      .clickFirstDistributorResult()
      .clickApplyFiltersButton()
      .waitForLoaderToDisappear()
      .clickSaveReportLink()
      .enterReportName(name)
      .clickSave();
  }

}
