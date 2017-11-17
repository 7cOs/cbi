package com.cbrands.pages.opportunities;

import com.cbrands.PremiseType;
import com.cbrands.pages.TestNGBasePage;
import org.openqa.selenium.By;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.How;
import org.openqa.selenium.support.PageFactory;

import static com.cbrands.helper.SeleniumUtils.*;

public class OpportunitiesPage extends TestNGBasePage {
  private static final String FILTER_FORM_XPATH = "//form[contains(@class, 'filters')]";

  private final WebDriver driver;

  @FindBy(how = How.XPATH, using = FILTER_FORM_XPATH)
  private WebElement filterContainer;

  @FindBy(how = How.XPATH, using = FILTER_FORM_XPATH + "//md-select[contains(@ng-model, 'retailer')]")
  private WebElement retailerTypeFilter;

  @FindBy(how = How.XPATH, using = FILTER_FORM_XPATH + "//inline-search[@type='chain']")
  private WebElement chainRetailerFilter;

  @FindBy(how = How.XPATH, using = FILTER_FORM_XPATH + "//inline-search[@type='store']")
  private WebElement storeRetailerFilter;

  @FindBy(how = How.XPATH, using = FILTER_FORM_XPATH + "//inline-search[@type='distributor']")
  private WebElement distributorFilter;

  @FindBy(how = How.XPATH, using = FILTER_FORM_XPATH + "//md-checkbox[contains(@ng-model,'myAccountsOnly')]")
  private WebElement accountScopeFilter;

  @FindBy(how = How.XPATH, using = "//button[@value='Apply Filters']")
  private WebElement applyFiltersButton;

  @FindBy(how = How.XPATH, using = FILTER_FORM_XPATH + "//a[contains(., 'Save Report')]")
  private WebElement saveReportButton;

  @FindBy(how = How.XPATH, using = "//md-select[@placeholder='Select Saved Report']")
  private WebElement savedReportsDropdown;

  public OpportunitiesPage(WebDriver driver) {
    this.driver = driver;
    PageFactory.initElements(driver, this);
  }

  @Override
  protected void load() {
    driver.get(webAppBaseUrl + "/opportunities");
  }

  @Override
  public boolean isLoaded() {
    waitForVisibleFluentWait(filterContainer);
    return filterContainer.isDisplayed();
  }

  public boolean isPremiseFilterSelectedAs(PremiseType premiseType) {
    final WebElement checkbox = findElement(
      By.xpath("//md-radio-button[contains(@aria-label, '" + premiseType.name() + "')]")
    );
    return "true".equalsIgnoreCase(checkbox.getAttribute("aria-checked"));
  }

  public OpportunitiesPage clickRetailerTypeDropdown() {
    waitForElementToClickable(retailerTypeFilter, true).click();
    return this;
  }

  public OpportunitiesPage selectChainRetailerType() {
    selectRetailerType("Chain");
    return this;
  }

  public OpportunitiesPage selectStoreRetailerType() {
    selectRetailerType("Store");
    return this;
  }

  private void selectRetailerType(String retailerType) {
    final WebElement typeOption = retailerTypeFilter.findElement(By.xpath(
      "//md-option[contains(@ng-repeat, 'retailer')]/div[contains(.,'" + retailerType + "')]"));
    waitForElementToClickable(typeOption, true).click();
    waitForElementToClickable(typeOption, false);
  }

  public OpportunitiesPage enterChainRetailerSearchText(String searchText) {
    enterSearchTextFor(chainRetailerFilter, searchText);
    return this;
  }

  public OpportunitiesPage enterStoreRetailerSearchText(String searchText) {
    enterSearchTextFor(storeRetailerFilter, searchText);
    return this;
  }

  public OpportunitiesPage enterDistributorSearchText(String searchText) {
    enterSearchTextFor(distributorFilter, searchText);
    return this;
  }

  private void enterSearchTextFor(WebElement searchFilter, String searchText) {
    final WebElement searchField = getSearchFilterTextBox(searchFilter);
    waitForElementToClickable(searchField, true).click();
    searchField.sendKeys(searchText);
  }

  public OpportunitiesPage clickSearchForChainRetailer() {
    clickSearchInFilter(chainRetailerFilter);
    return this;
  }

  public OpportunitiesPage clickSearchForStoreRetailer() {
    clickSearchInFilter(storeRetailerFilter);
    return this;
  }

  public OpportunitiesPage clickSearchForDistributor() {
    clickSearchInFilter(distributorFilter);
    return this;
  }

  private void clickSearchInFilter(WebElement filter) {
    waitForElementToClickable(
      filter.findElement(By.xpath(".//input[contains(@class, 'submit-btn visible')]")),
      true
    ).click();
  }

  public boolean isChainSearchTextCleared() {
    return isSearchFilterCleared(chainRetailerFilter);
  }

  public boolean isStoreSearchTextCleared() {
    return isSearchFilterCleared(storeRetailerFilter);
  }

  public boolean isDistributorSearchTextCleared() {
    return isSearchFilterCleared(distributorFilter);
  }

  private boolean isSearchFilterCleared(WebElement searchFilter) {
    return getSearchFilterTextBox(searchFilter).getAttribute("value").isEmpty();
  }

  private WebElement getSearchFilterTextBox(WebElement searchFilter) {
    return searchFilter.findElement(By.xpath(".//input[@placeholder]"));
  }

  public OpportunitiesPage clickFirstChainRetailerResult() {
    clickFirstSearchFilterResult(chainRetailerFilter);
    return this;
  }

  public OpportunitiesPage clickFirstDistributorResult() {
    clickFirstSearchFilterResult(distributorFilter);
    return this;
  }

  public OpportunitiesPage clickFirstChainRetailerResultContaining(String name) {
    clickFirstResultInFilterContaining(chainRetailerFilter, name);
    return this;
  }

  public OpportunitiesPage clickFirstStoreRetailerResultContaining(String name) {
    clickFirstResultInFilterContaining(storeRetailerFilter, name);
    return this;
  }

  private void clickFirstSearchFilterResult(WebElement searchFilter) {
    final WebElement result = getSearchFilterResults(searchFilter)
      .findElement(By.xpath(".//li"));
    waitForElementToClickable(result, true).click();
  }

  private void clickFirstResultInFilterContaining(WebElement searchFilter, String name) {
    final WebElement result = getSearchFilterResults(searchFilter)
      .findElement(By.xpath(".//li[contains(., '" + name + "')]"));
    waitForElementToClickable(result, true).click();
  }

  private WebElement getSearchFilterResults(WebElement searchFilter) {
    return searchFilter.findElement(By.xpath(".//div[@class='results-container open']"));
  }

  public OpportunitiesPage clickAccountScopeCheckbox() {
    waitForElementToClickable(accountScopeFilter, true).click();
    return this;
  }

  public OpportunitiesPage clickApplyFiltersButton() {
    waitForElementToClickable(applyFiltersButton, true);
    waitForVisibleFluentWait(applyFiltersButton).click();

    return this;
  }

  public SavedReportModal clickSaveReportLink() {
    waitForElementToClickable(saveReportButton, true).click();
    return PageFactory.initElements(driver, SavedReportModal.class);
  }

  public OpportunitiesPage waitForLoaderToDisappear() {
    waitForElementToDisappear(By.xpath("//div[contains(@class, 'loader-wrap')]"));
    return this;
  }

  public boolean hasOpportunityResults() {
    boolean hasResults;

    try {
      findElement(By.xpath("//v-pane[contains(@ng-repeat, 'list.opportunitiesService.model.opportunities')]"));
      hasResults = true;
    } catch (NoSuchElementException e) {
      hasResults = false;
    }

    return hasResults;
  }

  public boolean doesPremiseTypeChipMatch(PremiseType premiseType) {
    return isChipPresent(premiseType.name() + "-premise");
  }

  public boolean isAccountScopeChipPresent() {
    return isChipPresent("My Accounts Only");
  }

  public boolean isQueryChipPresent(String chipTitle) {
    return isChipPresent(chipTitle);
  }

  private boolean isChipPresent(String chipTitle) {
    return isElementPresent(By.xpath("//md-chip[contains(., '" + chipTitle + "')]"));
  }

  public OpportunitiesPage removeAccountScopeChip() {
    removeChipContaining("My Accounts Only");
    return this;
  }

  public OpportunitiesPage removeChipContaining(String substring) {
    WebElement chipToBeRemoved = findElement(
      By.xpath("//md-chip[contains(., '" + substring + "')]//div[contains(@md-chip-remove, 'md-chip-remove')]")
    );
    waitForElementToClickable(chipToBeRemoved, true).click();

    return this;
  }

  public SavedReportDropdown clickSavedReportsDropdown() {
    scrollToAndClick(savedReportsDropdown);

    final SavedReportDropdown savedReportDropdown = new SavedReportDropdown();
    return savedReportDropdown.waitUntilOpen();
  }

  public boolean isMyAccountsOnlySelected() {
    return "true".equalsIgnoreCase(accountScopeFilter.getAttribute("aria-checked"));
  }

  public boolean isSaveReportButtonEnabled() {
    return !"true".equalsIgnoreCase(saveReportButton.getAttribute("disabled"));
  }

  public int getDisplayedOpportunitiesCount() {
    final String displayText = findElement(By.xpath("//h4[contains(@class,'opportunities-count')]")).getText();
    final String delimiter = " ";
    final String displayedCount = displayText.replaceAll(",", "").replaceAll("[^0-9]+", delimiter).split(delimiter)[0];
    return Integer.parseInt(displayedCount);
  }

  public class SavedReportDropdown {
    private static final String SAVED_FILTER_OPTION_XPATH = "//md-option[contains(@class, 'saved-filter-option')]";
    private static final String OPEN_DROPDOWN_XPATH = "//div[@aria-hidden='false']" +
        "[contains(@class, 'md-select-menu-container')]" + "[." + SAVED_FILTER_OPTION_XPATH + "]";
    private static final String SAVED_REPORT_OPTION_XPATH = OPEN_DROPDOWN_XPATH + SAVED_FILTER_OPTION_XPATH;

    public SavedReportDropdown waitUntilOpen() {
      waitForElementToClickable(findElement(By.xpath(OPEN_DROPDOWN_XPATH)), true);
      return this;
    }

    public OpportunitiesPage selectSavedReportWithName(String reportName) {
      waitForElementToClickable(
        savedReportsDropdown.findElement(this.getHandleForSavedReportWithName(reportName)),
        true
      ).click();

      return PageFactory.initElements(driver, OpportunitiesPage.class);
    }

    public SavedReportModal openModalForSavedReportWithName(String reportName) {
      final WebElement savedReportOption = findElement(this.getHandleForSavedReportWithName(reportName));

      this.clickSavedReportHoverArrow(savedReportOption);
      return PageFactory.initElements(driver, SavedReportModal.class);
    }

    public OpportunitiesPage deleteAllSavedReports() {
      WebElement savedReportOption = this.getFirstSavedReportOption();

      while (!"No saved reports".equalsIgnoreCase(savedReportOption.getAttribute("textContent").trim())) {
        this.clickSavedReportHoverArrow(savedReportOption)
          .clickSavedReportDeleteLink()
          .waitForModalToClose()
          .clickSavedReportsDropdown();
        savedReportOption = this.getFirstSavedReportOption();
      }

      waitForElementToClickable(findElement(By.xpath("//md-backdrop")), true).click();

      return PageFactory.initElements(driver, OpportunitiesPage.class);
    }

    public boolean doesSavedReportExistWithName(String name) {
      return isElementPresent(this.getHandleForSavedReportWithName(name));
    }

    private By getHandleForSavedReportWithName(String name) {
      return By.xpath(SAVED_REPORT_OPTION_XPATH + "[contains(., '" + name + "')]");
    }

    private WebElement getFirstSavedReportOption() {
      return waitForElementToClickable(
        findElement(By.xpath(SAVED_REPORT_OPTION_XPATH)),
        true
      );
    }

    private SavedReportModal clickSavedReportHoverArrow(WebElement savedReport) {
      this.clickHoverArrowFor(savedReport).waitForLoaderToDisappear();
      return PageFactory.initElements(driver, SavedReportModal.class);
    }

    private OpportunitiesPage clickHoverArrowFor(WebElement savedReport) {
      waitForElementToClickable(savedReport, true);
      final Actions action = new Actions(driver);
      action.moveToElement(savedReport).perform();

      scrollToAndClick(
        findElement(By.xpath("//div[contains(@class, 'saved-reports-arrow')][@role='button']"))
      );

      return PageFactory.initElements(driver, OpportunitiesPage.class);
    }

  }
}
