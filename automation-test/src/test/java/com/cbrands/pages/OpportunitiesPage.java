package com.cbrands.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.How;
import org.openqa.selenium.support.PageFactory;

import static com.cbrands.helper.SeleniumUtils.*;

public class OpportunitiesPage extends TestNGBasePage {
  private static final String FILTER_FORM_XPATH = "//form[contains(@class, 'filters')]";
  private final WebDriver driver;

  @FindBy(how = How.XPATH, using = FILTER_FORM_XPATH)
  private WebElement filterContainer;

  @FindBy(how = How.XPATH, using = "//md-select[contains(@ng-model, 'retailer')]")
  private WebElement retailerTypeFilter;

  @FindBy(how = How.XPATH, using = FILTER_FORM_XPATH + "//inline-search[@type='chain']")
  private WebElement chainRetailerFilter;

  @FindBy(how = How.XPATH, using = FILTER_FORM_XPATH + "//inline-search[@type='store']")
  private WebElement storeRetailerFilter;

  @FindBy(how = How.XPATH, using = "//button[@value='Apply Filters']")
  private WebElement applyFiltersButton;

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

  private boolean isSearchFilterCleared(WebElement chainRetailerFilter) {
    return getSearchFilterTextBox(chainRetailerFilter).getAttribute("value").isEmpty();
  }

  private WebElement getSearchFilterTextBox(WebElement searchFilter) {
    return searchFilter.findElement(By.xpath(".//input[@placeholder]"));
  }

  public OpportunitiesPage clickFirstChainRetailerResult() {
    clickFirstSearchFilterResult(chainRetailerFilter);
    return this;
  }

  public OpportunitiesPage clickFirstRetailerResultContaining(String retailerName) {
    final WebElement searchButton = filterContainer
      .findElement(By.xpath(".//div[contains(@class, 'results-container')]//li[contains(., '" + retailerName + "')]"));
    waitForElementToClickable(searchButton, true).click();

    return this;
  }


  private void clickFirstSearchFilterResult(WebElement searchFilter) {
    final WebElement result = getSearchFilterResults(searchFilter)
      .findElement(By.xpath(".//li"));
    waitForElementToClickable(result, true).click();
  }

  private WebElement getSearchFilterResults(WebElement searchFilter) {
    return searchFilter.findElement(By.xpath(".//div[@class, 'results-container open']"));
  }

  public OpportunitiesPage clickApplyFiltersButton() {
    waitForElementToClickable(applyFiltersButton, true);
    waitForVisibleFluentWait(applyFiltersButton).click();

    return this;
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

  public boolean isQueryChipPresent(String chipTitle) {
    return isChipPresent(chipTitle);
  }

  private boolean isChipPresent(String chipTitle) {
    return isElementPresent(By.xpath("//md-chip[contains(., '" + chipTitle + "')]"));
  }

  public OpportunitiesPage removeChipContaining(String substring) {
    WebElement chipToBeRemoved = findElement(
      By.xpath("//md-chip[contains(., '" + substring + "')]//div[contains(@md-chip-remove, 'md-chip-remove')]")
    );
    waitForElementToClickable(chipToBeRemoved, true).click();

    return this;
  }

  public enum PremiseType {
    On,
    Off
  }

}
