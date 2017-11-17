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
import org.testng.annotations.*;

import java.net.MalformedURLException;

public class OpportunitiesSavedReportsTest extends BaseTestCase {
  static String current_time_stamp = new java.text.SimpleDateFormat("MM.dd.yyyy HH:mm:ss").format(new java.util.Date());

  private Login loginPage;
  private LogoutPage logoutPage;
  private HomePage homePage;
  private OpportunitiesPage opportunitiesPage;

  @BeforeClass
  public void setUpClass() throws MalformedURLException {
    this.startUpBrowser("Functional - Opportunities - Saved Reports Test");
  }

  @AfterClass
  public void tearDownClass() {
    this.shutDownBrowser();
  }

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

  @Test(description = "Enabling/Disabling Save Report link", dataProvider = "createRunReportData")
  public void enableSavedReport(String name, String distributorSearchText) {
    Assert.assertFalse(
      opportunitiesPage.isSaveReportButtonEnabled(),
      "Save Report link failed to be disabled when no filters applied."
    );

    opportunitiesPage
      .enterDistributorSearchText(distributorSearchText)
      .clickSearchForDistributor()
      .clickFirstDistributorResult()
      .clickApplyFiltersButton()
      .waitForLoaderToDisappear();

    Assert.assertTrue(
      opportunitiesPage.isSaveReportButtonEnabled(),
      "Save Report link failed to be enabled after filters applied."
    );
  }

  @Test(
    description = "Creating an Opportunities Saved Report",
    dependsOnMethods = "enableSavedReport",
    dataProvider = "createRunReportData"
  )
  public void createSavedReport(String name, String distributorSearchText) {
    opportunitiesPage.clickSavedReportsDropdown().deleteAllSavedReports();

    opportunitiesPage = this.setUpNewSavedReport(name, distributorSearchText);

    Assert.assertTrue(
      opportunitiesPage.clickSavedReportsDropdown().doesSavedReportExistWithName(name),
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
    dataProvider = "duplicateReportData"
  )
  public void attemptToEditWithExistingName(String existingReportName, String distributor) {
    this.setUpNewSavedReport(existingReportName, distributor);

    final SavedReportModal savedReportModal = opportunitiesPage
      .clickSavedReportsDropdown()
      .openModalForSavedReportWithName(existingReportName)
      .enterNewReportName(existingReportName)
      .clickSave();

    Assert.assertTrue(
      savedReportModal.isDuplicateNameErrorDisplayed(),
      "Failed to display error when attempting to use the name of an existing list."
    );
  }

  @Test(
    description = "Editing a Saved Report",
    dependsOnMethods = "createSavedReport",
    dataProvider = "editReportData"
  )
  public void editSavedReport(String originalReportName, String distributor) {
    this.setUpNewSavedReport(originalReportName, distributor);

    final String editedReportName = "EDITED " + originalReportName;
    opportunitiesPage
      .clickSavedReportsDropdown()
      .openModalForSavedReportWithName(originalReportName)
      .enterNewReportName(editedReportName)
      .clickSave()
      .waitForModalToClose();

    Assert.assertTrue(
      opportunitiesPage.clickSavedReportsDropdown().doesSavedReportExistWithName(editedReportName),
      "Saved Report with edited name " + editedReportName +
        " failed to appear in the dropdown on the Opportunities page."
    );

    homePage.goToPage();
    Assert.assertTrue(
      homePage.clickSavedReportsDropdown().doesSavedReportExistWithName(editedReportName),
      "Saved Report with edited  name " + editedReportName + " failed to appear in the dropdown on the Home page."
    );
  }

  @Test(
    description = "Deleting a Saved Report",
    dependsOnMethods = "createSavedReport",
    dataProvider = "deleteReportData"
  )
  public void deleteSavedReport(String reportNameToDelete, String distributor) {
    this.setUpNewSavedReport(reportNameToDelete, distributor);
    opportunitiesPage
      .clickSavedReportsDropdown()
      .openModalForSavedReportWithName(reportNameToDelete)
      .clickSavedReportDeleteLink()
      .waitForModalToClose();

    Assert.assertFalse(
      opportunitiesPage.clickSavedReportsDropdown().doesSavedReportExistWithName(reportNameToDelete),
      "Saved Report with name " + reportNameToDelete +
        " failed to be removed from the dropdown on the Opportunities page."
    );

    homePage.goToPage();
    Assert.assertFalse(
      homePage.clickSavedReportsDropdown().doesSavedReportExistWithName(reportNameToDelete),
      "Saved Report with name " + reportNameToDelete +
        " failed to be removed from the dropdown on the Home page."
    );
  }

  @DataProvider
  public static Object[][] createRunReportData() {
    final String testReportName = "Functional Test: " + current_time_stamp;
    return new Object[][]{
      {"Create & Run " + testReportName, "Healy Wholesale"}
    };
  }

  @DataProvider
  public static Object[][] duplicateReportData() {
    final String testReportName = "Functional Test: " + current_time_stamp;
    return new Object[][]{
      {"Duplicate " + testReportName, "Healy Wholesale"}
    };
  }

  @DataProvider
  public static Object[][] editReportData() {
    final String testReportName = "Functional Test: " + current_time_stamp;
    return new Object[][]{
      {"Edit Me " + testReportName, "Healy Wholesale"}
    };
  }

  @DataProvider
  public static Object[][] deleteReportData() {
    final String testReportName = "Functional Test: " + current_time_stamp;
    return new Object[][]{
      {"Delete Me " + testReportName, "Healy Wholesale"}
    };
  }

  private OpportunitiesPage setUpNewSavedReport(String reportName, String distributorSearchText) {
    return opportunitiesPage
      .enterDistributorSearchText(distributorSearchText)
      .clickSearchForDistributor()
      .clickFirstDistributorResult()
      .clickApplyFiltersButton()
      .waitForLoaderToDisappear()
      .clickSaveReportLink()
      .enterReportName(reportName)
      .clickSave()
      .waitForModalToClose();
  }

}
