package com.cbrands.test.functional.opportunities;

import com.cbrands.TestUser;
import com.cbrands.pages.HomePage;
import com.cbrands.pages.LoginPage;
import com.cbrands.pages.LogoutPage;
import com.cbrands.pages.opportunities.OpportunitiesPage;
import com.cbrands.pages.opportunities.SavedReportModal;
import com.cbrands.test.BaseTestCase;
import org.openqa.selenium.support.PageFactory;
import org.testng.Assert;
import org.testng.annotations.*;

import java.net.MalformedURLException;

public class OpportunitiesSavedReportsTest extends BaseTestCase {
  private static final int MAX_SAVED_REPORT_LIMIT = 10;
  static String current_time_stamp = new java.text.SimpleDateFormat("MM.dd.yyyy HH:mm:ss").format(new java.util.Date());

  private HomePage homePage;
  private OpportunitiesPage opportunitiesPage;

  @BeforeMethod
  public void setUp() throws MalformedURLException {
    this.startUpBrowser("Functional - Opportunities - Saved Reports Test");

    homePage = PageFactory.initElements(driver, LoginPage.class).loginAs(TestUser.ACTOR4);
    opportunitiesPage = PageFactory.initElements(driver, OpportunitiesPage.class);
    opportunitiesPage.goToPage();
  }

  @AfterMethod
  public void tearDown() {
    PageFactory.initElements(driver, LogoutPage.class).goToPage();
    this.shutDownBrowser();
  }

  @Test(description = "Enabling/Disabling Save Report link", dataProvider = "distributorData")
  public void enableSavedReport(String distributorSearchText) {
    Assert.assertFalse(
      opportunitiesPage.isSaveReportButtonEnabled(),
      "Save Report link failed to be disabled when no filters applied."
    );

    opportunitiesPage = opportunitiesPage
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
    description = "Attempting to create a new Saved Report when the max allowed has already been reached",
    dependsOnMethods = "enableSavedReport",
    dataProvider = "distributorData"
  )
  public void createAfterMaxLimit(String distributor) {
    this.setUpMaxNumberOfSavedReports(distributor);

    final SavedReportModal savedReportModal = opportunitiesPage
      .enterDistributorSearchText(distributor)
      .clickSearchForDistributor()
      .clickFirstDistributorResult()
      .clickApplyFiltersButton()
      .waitForLoaderToDisappear()
      .clickSaveReportLink();

    Assert.assertTrue(
      savedReportModal.isMaxSavedReportsLimitErrorDisplayed(),
      "Failed to display error message when max limit of Saved Reports already reached."
    );
  }

  @Test(
    description = "Deleting a Saved Report",
    dependsOnMethods = "createAfterMaxLimit",
    dataProvider = "deleteReportData"
  )
  public void deleteSavedReport(String reportNameToDelete, String distributor) {
    opportunitiesPage = opportunitiesPage.clickSavedReportsDropdown().clearAllSavedReports();
    opportunitiesPage = this.setUpNewSavedReport(reportNameToDelete, distributor);
    opportunitiesPage = opportunitiesPage
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

  @Test(
    description = "Creating an Opportunities Saved Report",
    dependsOnMethods = "deleteSavedReport",
    dataProvider = "createRunReportData"
  )
  public void createSavedReport(String name, String distributorSearchText) {
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
    opportunitiesPage = opportunitiesPage
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
    dataProvider = "editDuplicateReportData"
  )
  public void attemptToEditWithExistingName(String existingReportName, String distributor) {
    opportunitiesPage = this.setUpNewSavedReport(existingReportName, distributor);

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
    opportunitiesPage = this.setUpNewSavedReport(originalReportName, distributor);

    final String editedReportName = "EDITED " + originalReportName;
    opportunitiesPage = opportunitiesPage
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

  @DataProvider
  public static Object[][] distributorData() {
    return new Object[][]{
      {"Healy Wholesale"}
    };
  }

  @DataProvider
  public static Object[][] createRunReportData() {
    final String testReportName = "Functional Test: " + current_time_stamp;
    return new Object[][]{
      {"Create & Run " + testReportName, "Healy Wholesale"}
    };
  }

  @DataProvider
  public static Object[][] editDuplicateReportData() {
    final String testReportName = "Functional Test: " + current_time_stamp;
    return new Object[][]{
      {"Edit Duplicate " + testReportName, "Healy Wholesale"}
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
      .waitForModalToClose()
      .clickResetFilters();
  }

  private void setUpMaxNumberOfSavedReports(String distributor) {
    for(int i = this.getExistingNumberOfSavedReports() + 1; i <= MAX_SAVED_REPORT_LIMIT; i++) {
      this.setUpNewSavedReport("Test Max Limit - Report #" + i, distributor);
    }
  }

  private int getExistingNumberOfSavedReports() {
    final int existingNumberOfSavedReports;

    final OpportunitiesPage.SavedReportDropdown savedReportDropdown = opportunitiesPage.clickSavedReportsDropdown();
    existingNumberOfSavedReports = savedReportDropdown.getNumberOfSavedReports();
    savedReportDropdown.closeDropdown();

    return existingNumberOfSavedReports;
  }

}
