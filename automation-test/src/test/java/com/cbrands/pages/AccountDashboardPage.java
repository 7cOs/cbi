package com.cbrands.pages;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.openqa.selenium.By;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.How;
import org.openqa.selenium.support.PageFactory;
import org.testng.Assert;

import java.util.List;

import static com.cbrands.helper.SeleniumUtils.*;

public class AccountDashboardPage extends TestNGBasePage {
  private static final String LEFT_PANEL_XPATH = "//div[contains(@class, 'scorecard-table')]";
  private static final String RIGHT_PANEL_XPATH = "//div[contains(@class, 'scorecard-chart')]";
  private static final String RIGHT_PANEL_ROW_XPATH = ".//p[contains(@class, 'data-brand')]";
  private static final String BACK_CHEVRON_XPATH = ".//span[contains(@class, 'back-chevron')]";

  private Log log = LogFactory.getLog(AccountDashboardPage.class);

  private final WebDriver driver;

  @FindBy(how = How.XPATH, using = "//div[contains(@class, 'account-header')]")
  private WebElement header;

  @FindBy(how = How.XPATH, using = "//inline-search[@type='distributor']")
  private WebElement distributorFilter;

  @FindBy(how = How.XPATH, using = "//inline-search[@type='chain']")
  private WebElement retailerChainFilter;

  @FindBy(css = "md-content._md div div.ng-scope div:nth-of-type(3) div:nth-of-type(2) div.apply-filters button.btn-action")
  private WebElement applyFilters;

  @FindBy(how = How.XPATH, using = LEFT_PANEL_XPATH)
  private WebElement leftPanel;

  @FindBy(how = How.XPATH, using = RIGHT_PANEL_XPATH)
  private WebElement rightPanel;

  public AccountDashboardPage(WebDriver driver) {
    this.driver = driver;
  }

  @Override
  public boolean isLoaded() {
    waitForVisibleFluentWait(header);
    return header.isDisplayed();
  }

  @Override
  protected void load() {
    driver.get(webAppBaseUrl + "/accounts");
  }

  public AccountDashboardPage enterDistributorSearchText(String text) {
    final WebElement distributorTextBox = distributorFilter
      .findElement(By.xpath(".//input[@placeholder='Name']"));
    waitForElementToClickable(distributorTextBox, true).click();
    distributorTextBox.sendKeys(text);

    return this;
  }

  public AccountDashboardPage clickSearchForDistributor() {
    final WebElement searchButton = distributorFilter
      .findElement(By.xpath(".//input[contains(@class, 'submit-btn visible')]"));
    waitForElementToClickable(searchButton, true).click();

    return this;
  }

  public AccountDashboardPage selectDistributorFilterByName(String name) {
    final WebElement resultsContainer = distributorFilter
      .findElement(By.xpath(".//div[contains(@class, 'results-container')]"));
    waitForVisibleFluentWait(resultsContainer);

    final List<WebElement> results = resultsContainer.findElements(By.xpath(".//li"));
    waitForElementsVisibleFluentWait(results);

    final WebElement distributor = getFirstElementTextMatchByName(name, results);
    Assert.assertNotNull(distributor, "No distributor found by the name of " + name);
    waitForElementToClickable(distributor, true).click();

    return this;
  }

  public AccountDashboardPage enterRetailerChainSearchText(String text) {
    final WebElement retailerChainTextBox = retailerChainFilter
      .findElement(By.xpath(".//input[@placeholder='Account or Subaccount Name']"));
    waitForElementToClickable(retailerChainTextBox, true).click();
    retailerChainTextBox.sendKeys(text);

    return this;
  }

  public AccountDashboardPage clickSearchForRetailerChain() {
    final WebElement searchButton = retailerChainFilter
      .findElement(By.xpath(".//input[contains(@class, 'submit-btn visible')]"));
    waitForElementToClickable(searchButton, true).click();

    return this;
  }

  public AccountDashboardPage selectRetailerChainFilterByName(String accountName) {
    final WebElement resultsContainer = retailerChainFilter
      .findElement(By.xpath(".//div[contains(@class, 'results-container')]"));
    waitForVisibleFluentWait(resultsContainer);

    final List<WebElement> results = resultsContainer.findElements(By.xpath(".//li"));
    waitForElementsVisibleFluentWait(results);

    final WebElement retailer = getFirstElementTextMatchByName(accountName, results);
    Assert.assertNotNull(retailer, "No retailer found by the name of " + accountName);
    waitForElementToClickable(retailer, true).click();

    return this;
  }

  private WebElement getFirstElementTextMatchByName(String accountName, List<WebElement> results) {
    WebElement retailer = null;

    for (WebElement result : results) {
      final String resultText = result.getText().trim();
      if (resultText.toUpperCase().contains(accountName.toUpperCase())) {
        retailer = result;
        break;
      }
    }

    return retailer;
  }

  public AccountDashboardPage clickApplyFilters() {
    waitForElementToClickable(applyFilters, true);
    waitForVisibleFluentWait(applyFilters).click();

    return this;
  }

  public AccountDashboardPage drillIntoFirstRowInRightPanel() {
    scrollToAndClick(rightPanel.findElement(By.xpath(RIGHT_PANEL_ROW_XPATH)));
    return this;
  }

  public AccountDashboardPage drillIntoRightPanelWithName(String name) {
    final List<WebElement> elements = getRightPanelRows();
    final WebElement element = getFirstElementTextMatchByName(name, elements);
    Assert.assertNotNull(element, "No item found by name: " + name);

    scrollToAndClick(element);

    return this;
  }

  private List<WebElement> getRightPanelRows() {
    final List<WebElement> elements = rightPanel.findElements(By.xpath(RIGHT_PANEL_ROW_XPATH));
    waitForElementsVisibleFluentWait(elements);
    return elements;
  }

  public AccountDashboardPage drillUpRightPanel() {
    final WebElement backButton = rightPanel.findElement(By.xpath(BACK_CHEVRON_XPATH));
    waitForVisibleFluentWait(backButton);
    waitForElementToClickable(backButton, true).click();

    return this;
  }

  public NotesModal clickNotesButton() {
    final WebElement notesButton = findElement(By.xpath(
      "//*[contains(@class, 'notes-icon enabled')]//a[contains(., 'Notes')]/../.."));
    waitForElementToClickable(notesButton, true).click();

    return  PageFactory.initElements(driver, NotesModal.class);
  }

  public boolean isLeftPanelResultsLoaded() {
    boolean resultsAreLoaded;

    try {
      waitForVisibleFluentWait(leftPanel.findElement(By.xpath(".//tr[@ng-repeat]")));
      resultsAreLoaded = true;
    } catch (NoSuchElementException e) {
      resultsAreLoaded = false;
    }

    return resultsAreLoaded;
  }

  public boolean isRightPanelResultsLoadedFor(RightPanelLevel rightPanelLevel) {
    boolean resultsAreLoaded;

    try {
      waitForVisibleFluentWait(rightPanel.findElement(By.xpath(".//div[contains(@class, 'widget-row-container')]")));

      final WebElement panelHeader = rightPanel.findElement(By.xpath(".//div[@class='widget-subheader-item']/p"));
      resultsAreLoaded = rightPanelLevel.name().equalsIgnoreCase(panelHeader.getText());
    } catch (NoSuchElementException e) {
      resultsAreLoaded = false;
    }

    return resultsAreLoaded;
  }

  public enum RightPanelLevel {
    Distributors,
    Accounts,
    SubAccounts,
    Stores
  }
}
