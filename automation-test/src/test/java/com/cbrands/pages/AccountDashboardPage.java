package com.cbrands.pages;

import com.cbrands.helper.PropertiesCache;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.How;
import org.openqa.selenium.support.ui.LoadableComponent;
import org.testng.Assert;

import java.util.List;

import static com.cbrands.helper.SeleniumUtils.*;

public class AccountDashboardPage extends LoadableComponent<AccountDashboardPage> {

  private Log log = LogFactory.getLog(AccountDashboardPage.class);

  private final WebDriver driver;

  @FindBy(how = How.XPATH, using = "//div[contains(@class, 'account-header')]")
  private WebElement header;

  @FindBy(how = How.XPATH, using = "//inline-search[@type='chain']")
  private WebElement retailerChainFilter;

  @FindBy(css = "md-content._md div div.ng-scope div:nth-of-type(3) div:nth-of-type(2) div.apply-filters button.btn-action")
  private WebElement applyFilters;

  public AccountDashboardPage(WebDriver driver) {
    this.driver = driver;
  }

  @Override
  protected void isLoaded() throws Error {
    waitForVisibleFluentWait(header);
    Assert.assertTrue(header.isDisplayed());
  }

  @Override
  protected void load() {
    driver.get(PropertiesCache.getInstance().getProperty("qa.host.address") + "/");
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

  public AccountDashboardPage selectRetailerChainByName(String accountName) {
    final WebElement resultsContainer = retailerChainFilter
      .findElement(By.xpath(".//div[contains(@class, 'results-container')]"));
    waitForVisibleFluentWait(resultsContainer);

    final List<WebElement> results = resultsContainer.findElements(By.xpath(".//li"));
    waitForElementsVisibleFluentWait(results);

    final WebElement retailer = getFirstMatchingDropdownSearchResultByName(accountName, results);
    if(null != retailer) {
      retailer.click();
    } else {
      log.info("No retailer found by the name of " + accountName);
    }

    return this;
  }

  private WebElement getFirstMatchingDropdownSearchResultByName(String accountName, List<WebElement> results) {
    WebElement retailer = null;

    for(WebElement result : results) {
      if(accountName.equalsIgnoreCase(result.getText())) {
        retailer = result;
        break;
      }
    }

    return retailer;
  }

  public AccountDashboardPage applyFilters() {
    waitForElementToClickable(applyFilters, true);
    waitForVisibleFluentWait(applyFilters).click();

    return this;
  }
}
