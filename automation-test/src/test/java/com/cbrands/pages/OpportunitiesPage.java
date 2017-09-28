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
  private static final String CHAIN_SEARCHBOX_XPATH = ".//input[@placeholder='Account or Subaccount Name']";
  private final WebDriver driver;

  @FindBy(how = How.XPATH, using = "//form[contains(@class, 'filters')]")
  private WebElement filterContainer;

  @FindBy(how = How.XPATH, using = "//md-select[contains(@ng-model, 'retailer')]")
  private WebElement retailerTypeFilter;

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

  public OpportunitiesPage clickRetailerTypeDropdown() {
    waitForElementToClickable(retailerTypeFilter, true).click();
    return this;
  }

  public OpportunitiesPage selectChainRetailerType() {
    selectRetailerType("Chain");
    return this;
  }

  private void selectRetailerType(String retailerType) {
    final WebElement typeOption = retailerTypeFilter.findElement(By.xpath(
      "//md-option[contains(@ng-repeat, 'retailer')]/div[contains(.,'" + retailerType + "')]"));
    waitForElementToClickable(typeOption, true).click();
    waitForElementToClickable(typeOption, false);
  }

  public OpportunitiesPage enterChaiRetailerSearchText(String searchText) {
    final WebElement chainSearchField = filterContainer.findElement(By.xpath(CHAIN_SEARCHBOX_XPATH));
    waitForElementToClickable(chainSearchField, true).click();
    chainSearchField.sendKeys(searchText);

    return this;
  }

  public OpportunitiesPage clickSearchForRetailer() {
    final WebElement searchButton = filterContainer
      .findElement(By.xpath(".//input[contains(@class, 'submit-btn visible')]"));
    waitForElementToClickable(searchButton, true).click();

    return this;
  }

  public OpportunitiesPage clickFirstRetailerResult() {
    final WebElement searchButton = filterContainer
      .findElement(By.xpath(".//div[contains(@class, 'results-container')]//li"));
    waitForElementToClickable(searchButton, true).click();
    return this;
  }

  public OpportunitiesPage clickFirstRetailerResultContaining(String accountName) {
    final WebElement searchButton = filterContainer
      .findElement(By.xpath(".//div[contains(@class, 'results-container')]//li[contains(., '" + accountName + "')]"));
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

  public boolean isPremiseFilterSelectedAs(PremiseType premiseType) {
    final WebElement checkbox = findElement(
      By.xpath("//md-radio-button[contains(@aria-label, '" + premiseType.name() + "')]")
    );
    return "true".equalsIgnoreCase(checkbox.getAttribute("aria-checked"));
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

  private boolean isChipPresent(String chipTitle) {
    return isElementPresent(By.xpath("//md-chip//div/div[contains(., '" + chipTitle + "')]"));
  }

  public enum PremiseType {
    On,
    Off
  }

}
