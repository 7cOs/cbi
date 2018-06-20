package com.cbrands.test.functional.opportunities;

import com.cbrands.TestUser;
import com.cbrands.pages.HomePage;
import com.cbrands.pages.LoginPage;
import com.cbrands.pages.LogoutPage;
import com.cbrands.pages.opportunities.OpportunitiesPage;
import com.cbrands.pages.opportunities.SavedReportModal;
import com.cbrands.test.BaseTestCase;

import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.PageFactory;
import org.testng.Assert;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.DataProvider;
import org.testng.annotations.Test;

import static com.cbrands.helper.SeleniumUtils.findElement;

import java.lang.reflect.Method;
import java.net.MalformedURLException;
import java.util.List;

public class OpportunitiesSavedReportsTest extends BaseTestCase {
  private static final int MAX_SAVED_REPORT_LIMIT = 10;
  static String current_time_stamp = new java.text.SimpleDateFormat("MM.dd.yyyy HH:mm:ss").format(new java.util.Date());

  private HomePage homePage;
  private OpportunitiesPage opportunitiesPage;

  @BeforeMethod
  public void setUp(Method method) throws MalformedURLException {
    final String testCaseName = method.getAnnotation(Test.class).description();
    final String sauceTitle = String.format("Functional - Opportunities - Saved Reports Test - %s", testCaseName);
    this.startUpBrowser(sauceTitle);

    // homePage = PageFactory.initElements(driver, LoginPage.class).loginAs(TestUser.ACTOR4);
    
    // - sdk - //
    homePage = PageFactory.initElements(driver, LoginPage.class).login(TestUser.ACTOR4);
    
    opportunitiesPage = PageFactory.initElements(driver, OpportunitiesPage.class);
    opportunitiesPage.goToPage();
    // opportunitiesPage = opportunitiesPage.clickSavedReportsDropdown().clearAllSavedReports();
    
    // - sdk - //
    // expediteAllSavedReportsDeletion();
    expediteSavedReportsCreate();
    
    Assert.assertTrue(
        opportunitiesPage.dismissStrayBackdropElement(),
        "Error resetting focus to element"
      );
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
    description = "Creating an Opportunities Saved Report",
    dependsOnMethods = "enableSavedReport",
    dataProvider = "createReportData"
  )
  public void createSavedReport(String reportName, String distributorSearchText) {
    testCreateASingleSavedReport(reportName + " #1", distributorSearchText);

    opportunitiesPage.goToPage();

    testCreateASingleSavedReport(reportName + " #2", distributorSearchText);
  }

  @Test(
    description = "Running an Opportunities Saved Report from the Opportunities page",
    dependsOnMethods = "createSavedReport",
    dataProvider = "runReportOpportunitiesPageData"
  )
  public void runSavedReportFromOpportunitiesPage(String reportName, String distributor) {
    this.setUpNewSavedReport(reportName, distributor);

    opportunitiesPage = opportunitiesPage
      .clickSavedReportsDropdown()
      .selectSavedReportWithName(reportName)
      .waitForLoaderToDisappear();

    Assert.assertTrue(opportunitiesPage.isQueryChipPresent(distributor), "Expected filter is not present.");
    Assert.assertTrue(opportunitiesPage.hasOpportunityResults(), "Results failed to appear after applying filters.");
    Assert.assertTrue( opportunitiesPage.isExpectedReportLabelDisplayed(reportName),
        "Saved report label displayed does not match report name that was run.");
  }

  @Test(
    description = "Running an Opportunities Saved Report from the Home page",
    dependsOnMethods = "createSavedReport",
    dataProvider = "runReportHomePageData"
  )
  public void runSavedReportFromHomePage(String reportName, String distributor) {
    this.setUpNewSavedReport(reportName, distributor);

    homePage.goToPage();
    opportunitiesPage = homePage
      .clickSavedReportsDropdown()
      .selectSavedReportWithName(reportName)
      .waitForLoaderToDisappear();

    Assert.assertTrue(opportunitiesPage.isQueryChipPresent(distributor), "Expected filter is not present.");
    Assert.assertTrue(opportunitiesPage.hasOpportunityResults(), "Results failed to appear after applying filters.");
    Assert.assertTrue( opportunitiesPage.isExpectedReportLabelDisplayed(reportName),
        "Saved report label displayed does not match report name that was run.");
  }

  @Test(
    description = "Editing a Saved Report",
    dependsOnMethods = "createSavedReport",
    dataProvider = "editReportData"
  )
  public void editSavedReport(String originalReportName, String distributor) {
    opportunitiesPage = this.setUpNewSavedReport(originalReportName, distributor);

    final String editedReportName = generateNewEditedReportName(originalReportName);
    opportunitiesPage = opportunitiesPage
      .clickSavedReportsDropdown()
      .openModalForSavedReportWithName(originalReportName)
      .enterNewReportName(editedReportName)
      .clickSave()
      .waitForModalToClose();

    Assert.assertTrue(
      opportunitiesPage.clickSavedReportsDropdown().doesSavedReportExistWithName(editedReportName),
      getEditFailureMessage(editedReportName, "Opportunities")
    );

    homePage.goToPage();
    Assert.assertTrue(
      homePage.clickSavedReportsDropdown().doesSavedReportExistWithName(editedReportName),
      getEditFailureMessage(editedReportName, "Home")
    );
  }

  @Test(
    description = "Deleting a Saved Report",
    dependsOnMethods = "createSavedReport",
    dataProvider = "deleteReportData"
  )
  public void deleteSavedReport(String reportNameToDelete, String distributor) {
    opportunitiesPage = this.setUpNewSavedReport(reportNameToDelete, distributor);

    opportunitiesPage = opportunitiesPage
      .clickSavedReportsDropdown()
      .openModalForSavedReportWithName(reportNameToDelete)
      .clickSavedReportDeleteLink()
      .waitForModalToClose();

    Assert.assertFalse(
      opportunitiesPage.clickSavedReportsDropdown().doesSavedReportExistWithName(reportNameToDelete),
      getDeleteFailureMessage(reportNameToDelete, "Opportunities")
    );

    homePage.goToPage();
    Assert.assertFalse(
      homePage.clickSavedReportsDropdown().doesSavedReportExistWithName(reportNameToDelete),
      getDeleteFailureMessage(reportNameToDelete, "Home")
    );
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
      "Failed to display error when attempting to use the name of an existing report."
    );

    opportunitiesPage = savedReportModal.enterNewReportName(
          generateNewEditedReportName(existingReportName))
        .clickSave()
        .waitForModalToClose();

    Assert.assertFalse(opportunitiesPage.isQueryChipPresent(distributor), 
        "Opportunites filtered when attempting to use name of existing report");    
  }

  @Test(
      description = "Attempt to create saved report with duplicate name, then save with valid name",
      dependsOnMethods = "createSavedReport",
      dataProvider = "createDuplicateReportData"
  )
  public void attemptToCreateWithDuplicateName(String existingReportName, String distributor) {    
    opportunitiesPage = this.setUpNewSavedReport(existingReportName, distributor);

    final SavedReportModal savedReportModal = opportunitiesPage
            .enterDistributorSearchText(distributor)
            .clickSearchForDistributor()
            .clickFirstDistributorResult()
            .clickApplyFiltersButton()
            .waitForLoaderToDisappear()
            .clickSaveReportLink()
            .enterReportName(existingReportName)
            .clickSave();

    Assert.assertTrue(
      savedReportModal.isDuplicateNameErrorDisplayed(),
      "Failed to display error when attempting to use the name of an existing report."
    );

    final String nonDuplicateReportName = generateNewEditedReportName(existingReportName);
    opportunitiesPage = savedReportModal.enterReportName(nonDuplicateReportName)
       .clickSave()
       .waitForModalToClose();
    
    Assert.assertTrue(
        opportunitiesPage.clickSavedReportsDropdown().doesSavedReportExistWithName(nonDuplicateReportName),
        getCreateFailureMessage(nonDuplicateReportName, "Opportunities")
      );

    homePage.goToPage();
    Assert.assertTrue(
      homePage.clickSavedReportsDropdown().doesSavedReportExistWithName(nonDuplicateReportName),
      getCreateFailureMessage(nonDuplicateReportName, "Home")
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

  @DataProvider
  public static Object[][] distributorData() {
    return new Object[][]{
      {"Healy Wholesale"}
    };
  }

  @DataProvider
  public static Object[][] createReportData() {
    final String testReportName = "Functional Test: " + current_time_stamp;
    return new Object[][]{
      {"Create " + testReportName, "Healy Wholesale"}
    };
  }

  @DataProvider
  public static Object[][] runReportData() {
    final String testReportName = "Functional Test: " + current_time_stamp;
    return new Object[][]{
      {"Run " + testReportName, "Healy Wholesale"}
    };
  }
  
  @DataProvider
  public static Object[][] runReportOpportunitiesPageData() {
    final String testReportName = "Functional Test: " + current_time_stamp;
    return new Object[][]{
      {"Run " + testReportName + " from Opportunities page", "Healy Wholesale"}
    };
  }  

  @DataProvider
  public static Object[][] runReportHomePageData() {
    final String testReportName = "Functional Test: " + current_time_stamp;
    return new Object[][]{
      {"Run " + testReportName + " from Home page", "Healy Wholesale"}
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
  public static Object[][] createDuplicateReportData() {
    final String testReportName = "Functional Test: " + current_time_stamp;
    return new Object[][]{
      {"Create Duplicate " + testReportName, "Healy Wholesale"}
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

  private String getCreateFailureMessage(String reportName, String pageName) {
    return String.format(
      "Saved Report with name %s failed to appear in the dropdown on the %s page.",
      reportName,
      pageName
    );
  }

  private String getEditFailureMessage(String editedReportName, String pageName) {
    return  String.format(
      "Saved Report with edited name %s failed to appear in the dropdown on the %s page.",
      editedReportName,
      pageName
    );
  }

  private String getDeleteFailureMessage(String reportNameToDelete, String pageName) {
    return String.format("Saved Report with name %s failed to be removed from the dropdown on the %s page.",
      reportNameToDelete,
      pageName
    );
  }

  private void testCreateASingleSavedReport(String reportName, String distributorSearchText) {
    opportunitiesPage = this.setUpNewSavedReport(reportName, distributorSearchText);

    Assert.assertTrue(
      opportunitiesPage.clickSavedReportsDropdown().doesSavedReportExistWithName(reportName),
      getCreateFailureMessage(reportName, "Opportunities")
    );

    homePage.goToPage();
    Assert.assertTrue(
      homePage.clickSavedReportsDropdown().doesSavedReportExistWithName(reportName),
      getCreateFailureMessage(reportName, "Home")
    );
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
      .clickResetFilters()
      .waitForChipToDisappear(distributorSearchText);
  }

  private void setUpMaxNumberOfSavedReports(String distributor) {
    for(int i = this.getExistingNumberOfSavedReports() + 1; i <= MAX_SAVED_REPORT_LIMIT; i++) {
      final String reportName = String.format("Test Max Limit - Report #%s - %s", i, current_time_stamp);
      this.setUpNewSavedReport(reportName, distributor);
    }
  }

  private int getExistingNumberOfSavedReports() {
    final int existingNumberOfSavedReports;

    final OpportunitiesPage.SavedReportDropdown savedReportDropdown = opportunitiesPage.clickSavedReportsDropdown();
    existingNumberOfSavedReports = savedReportDropdown.getNumberOfSavedReports();
    savedReportDropdown.closeDropdown();

    return existingNumberOfSavedReports;
  }

  /**
   * Returns new report name prefaced with "EDITED "
   * @param existingReportName
   * @return String
   * @author SKARNEH
   */
  public String generateNewEditedReportName(String existingReportName) {
    return "EDITED " + existingReportName;
  }

  
  
  /**
   * Expedite saved report(s) creation
   * @author sdk
   */
  public void expediteSavedReportsCreate() {
	  final int MAX_REPORTS = 10;
	  int totalReports = MAX_REPORTS- getTotalSavedReports();
	  for(int i = 0; i <= totalReports; i++) {
		  final String reportName = String.format("Test Max Limit - Report #%s - %s", i, 
				  new java.text.SimpleDateFormat("MM.dd.yyyy HH:mm:ss").format(new java.util.Date()));
		  System.out.println( reportName );
		  // - Enter/search Distributor - //
		  // WebElement distField = findElement(By.xpath("//label[text()='Distributor']/..//input"));
		  // BaseTestCase.jse.executeScript("arguments[0].value='"+distributorData()[0][0]+"';", distField);
		  enterSearchDistributor(distributorData()[0][0].toString());

		  // - Seek/click 'Search' icon - //
		  BaseTestCase.jse.executeScript("arguments[0].value='"+distributorData()[0][0]+"';", distField);
	  }
  }
  
  public void enterSearchDistributor(String name) {
	  WebElement distField = findElement(By.xpath("//label[text()='Distributor']/..//input"));
	  BaseTestCase.jse.executeScript("arguments[0].value='"+name+"';", distField);
	  distField.sendKeys(""); // Ensure 'Search' icon is displayed
  }
  
  /**
   * Expedite saved report(s) deletions
   * @author sdk
   */
  public void expediteAllSavedReportsDeletion() {
	  int totalReports = getTotalSavedReports();
	  
	  for(int i=0; i<totalReports; i++) {
		  WebElement btn = driver.findElement(By.xpath("//*[@class='saved-reports-edit-icon']"));
		  // - Click edit report button - //
		  BaseTestCase.jse.executeScript("arguments[0].click();", btn);
		  // - Click 'Delete Report' button
		  BaseTestCase.jse.executeScript("arguments[0].click();", 
				  findElement(By.xpath("//*[text()='Delete Report']")));
		  // - Display list of saved reports options - //
		  displaySavedReportsOptions(); 
	  }
  }
  
  public int getTotalSavedReports() {
	// - Display list of saved reports options - //
	  displaySavedReportsOptions(); 
	  
	  // - Gather list of  saved reports - //
	  String xp = "//md-option[contains(@class, 'saved-filter-option')]";
	  List<WebElement> ls = driver.findElements(By.xpath(xp));
	  //- Peek - //
	  if( ls.size() == 1 && ls.get(ls.size()-1).getText().equals("No saved reports")) {
		  return 0;
	  }

	  return ls.size();
  }
  
  public WebElement displaySavedReportsOptions() {
	  // - Display Saved Report options - //
	  String xp = "//*[@class='saved-filter-select']//md-select";
	  WebElement dropdown = findElement(By.xpath(xp));
	  BaseTestCase.jse.executeScript("arguments[0].click();", dropdown);

	  return dropdown;
  }
}
