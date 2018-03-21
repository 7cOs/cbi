package com.cbrands.pages.opportunities;

import com.cbrands.PremiseType;
import com.cbrands.pages.TestNGBasePage;
import org.openqa.selenium.By;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.How;
import org.openqa.selenium.support.PageFactory;

import java.util.List;

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

  @FindBy(how = How.XPATH, using = "//a[contains(., 'Reset')]")
  private WebElement resetFiltersButton;

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
    ensureSendKeys( searchField, searchText );
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
      // filter.findElement(By.xpath(".//input[contains(@class, 'submit-btn visible')]")),
      filter.findElement(By.xpath(".//input[contains(@class, 'submit-btn') and contains(@class, 'visible')]")),
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
    clickFirstSearchFilterResultFor(chainRetailerFilter);
    return this;
  }

  public OpportunitiesPage clickFirstDistributorResult() {
    clickFirstSearchFilterResultFor(distributorFilter);
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

  private void clickFirstSearchFilterResultFor(WebElement searchFilter) {
    final WebElement searchFilterResultDropdown = getSearchFilterResultDropdownContainer(searchFilter);
    waitForElementToClickable(
      waitForVisibleFluentWait(searchFilterResultDropdown),
      true
    );

    final WebElement result = searchFilterResultDropdown.findElement(By.xpath(".//li"));
    waitForElementToClickable(result, true).click();
  }

  private void clickFirstResultInFilterContaining(WebElement searchFilter, String name) {
    final WebElement result = getSearchFilterResultDropdownContainer(searchFilter)
      .findElement(By.xpath(".//li[contains(., '" + name + "')]"));
    waitForElementToClickable(result, true).click();
  }

  private WebElement getSearchFilterResultDropdownContainer(WebElement searchFilter) {
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

  public OpportunitiesPage clickResetFilters() {
    waitForElementToClickable(resetFiltersButton, true).click();
    return this;
  }

  public OpportunitiesPage removeAccountScopeChip() {
    removeChipContaining("My Accounts Only");
    return this;
  }

  public OpportunitiesPage removeChipContaining(String substring) {
    final String xpathExpression = String.format(
      "%s//div[contains(@md-chip-remove, 'md-chip-remove')]",
      getXPathForQueryChipContaining(substring)
    );
    WebElement chipToBeRemoved = findElement(
      By.xpath(xpathExpression)
    );
    waitForElementToClickable(chipToBeRemoved, true).click();

    return this;
  }

  public OpportunitiesPage waitForChipToDisappear(String text) {
    waitForElementToDisappear(By.xpath(getXPathForQueryChipContaining(text)));

    return this;
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
    return isElementPresent(By.xpath(getXPathForQueryChipContaining(chipTitle)));
  }

  private String getXPathForQueryChipContaining(String chipTitle) {
    return String.format("//md-chip[contains(., '%s')]", chipTitle);
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

  public SavedReportDropdown clickSavedReportsDropdown() {
    scrollToAndClick(savedReportsDropdown);
    return new SavedReportDropdown();
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
    private static final String OPEN_DROPDOWN_XPATH =
      "//div[@aria-hidden='false']" +
        "[contains(@class, 'md-select-menu-container')]" +
        "[." + SAVED_FILTER_OPTION_XPATH + "]";
    private static final String SAVED_REPORT_OPTION_XPATH = OPEN_DROPDOWN_XPATH + SAVED_FILTER_OPTION_XPATH;

    public SavedReportDropdown() {
      waitForElementToClickable(findElement(By.xpath(OPEN_DROPDOWN_XPATH)), true);
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
      this.openEditModalFor(savedReportOption);

      return PageFactory.initElements(driver, SavedReportModal.class);
    }

    public OpportunitiesPage clearAllSavedReports() {
      final OpportunitiesPage opportunitiesPage;

      if (!isPlaceholderForNoOptions(this.getFirstSavedReportOption())) {
        opportunitiesPage = deleteAllReports();
      } else {
        opportunitiesPage = this.closeDropdown();
      }

      return opportunitiesPage;
    }

    private OpportunitiesPage deleteAllReports() {
      WebElement savedReportOption = this.getFirstSavedReportOption();

      while (!isPlaceholderForNoOptions(savedReportOption)) {
        savedReportOption =
          this.openEditModalFor(savedReportOption)
            .clickSavedReportDeleteLink()
            .waitForModalToClose()
            .clickSavedReportsDropdown()
            .getFirstSavedReportOption();
      }

      return this.closeDropdown();
    }

    private boolean isPlaceholderForNoOptions(WebElement savedReportOption) {
      return "No saved reports".equalsIgnoreCase(savedReportOption.getAttribute("textContent").trim());
    }

    public OpportunitiesPage closeDropdown() {
      waitForElementToClickable(findElement(By.xpath("//md-backdrop")), true).click();

      return PageFactory.initElements(driver, OpportunitiesPage.class);
    }

    public boolean doesSavedReportExistWithName(String name) {
      return isElementPresent(this.getHandleForSavedReportWithName(name));
    }

    private By getHandleForSavedReportWithName(String name) {
      final String savedReportXPath = String.format(
        "%s[contains(., '%s')]",
        SAVED_REPORT_OPTION_XPATH,
        name
      );
      return By.xpath(savedReportXPath);
    }

    private WebElement getFirstSavedReportOption() {
      return waitForElementToClickable(
        findElement(By.xpath(SAVED_REPORT_OPTION_XPATH)),
        true
      );
    }

    private SavedReportModal openEditModalFor(WebElement savedReport) {
      scrollToAndClick(
        savedReport.findElement(By.xpath("//div[contains(@class, 'saved-reports-edit-icon')][@role='button']"))
      );
      waitForLoaderToDisappear();

      return PageFactory.initElements(driver, SavedReportModal.class);
    }

    public int getNumberOfSavedReports() {
      final int numberOfSavedReports;
      final List<WebElement> list = findElements(By.xpath(SAVED_REPORT_OPTION_XPATH));

      if (1 == list.size() && isPlaceholderForNoOptions(list.get(0))) {
        numberOfSavedReports = 0;
      } else {
        numberOfSavedReports = list.size();
      }

      return numberOfSavedReports;
    }

  }
}
