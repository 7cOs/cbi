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

  @FindBy(how = How.XPATH, using = FILTER_FORM_XPATH + "//input[@placeholder='Account or Subaccount Name']")
  private WebElement chainRetailerFilter;

  @FindBy(how = How.XPATH, using = FILTER_FORM_XPATH + "//input[@placeholder='Name, Address, TDLinx']")
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
    waitForElementToClickable(chainRetailerFilter, true).click();
    chainRetailerFilter.sendKeys(searchText);

    return this;
  }

  public OpportunitiesPage enterStoreRetailerSearchText(String searchText) {
    waitForElementToClickable(storeRetailerFilter, true).click();
    storeRetailerFilter.sendKeys(searchText);

    return this;
  }

  public OpportunitiesPage clickSearchForChainRetailer() {
    final WebElement chainRetailerFilter = filterContainer.findElement(By.xpath(".//inline-search[@type='chain']"));
    clickSearchInFilter(chainRetailerFilter);
    return this;
  }

  public OpportunitiesPage clickSearchForStoreRetailer() {
    final WebElement chainRetailerFilter = filterContainer.findElement(By.xpath(".//inline-search[@type='store']"));
    clickSearchInFilter(chainRetailerFilter);
    return this;
  }

  private void clickSearchInFilter(WebElement filter) {
    waitForElementToClickable(
      filter.findElement(By.xpath(".//input[contains(@class, 'submit-btn visible')]")),
      true
    ).click();
  }

  public boolean isChainSearchTextCleared() {
    return isTextboxCleared(chainRetailerFilter);
  }

  public boolean isStoreSearchTextCleared() {
    return isTextboxCleared(storeRetailerFilter);
  }

  private boolean isTextboxCleared(WebElement searchBox) {
    return searchBox.getAttribute("value").isEmpty();
  }

  public OpportunitiesPage clickFirstRetailerResult() {
    final WebElement searchButton = filterContainer
      .findElement(By.xpath(".//div[contains(@class, 'results-container')]//li"));
    waitForElementToClickable(searchButton, true).click();
    return this;
  }

  public OpportunitiesPage clickFirstRetailerResultContaining(String retailerName) {
    final WebElement searchButton = filterContainer
      .findElement(By.xpath(".//div[contains(@class, 'results-container')]//li[contains(., '" + retailerName + "')]"));
    waitForElementToClickable(searchButton, true).click();

    return this;
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
