package com.cbrands.pages;

import com.cbrands.helper.PropertiesCache;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.How;
import org.openqa.selenium.support.ui.LoadableComponent;
import org.testng.Assert;

import static com.cbrands.helper.SeleniumUtils.waitForElementToClickable;
import static com.cbrands.helper.SeleniumUtils.waitForVisibleFluentWait;

public class AccountDashboardPage extends LoadableComponent<AccountDashboardPage> {

  private final WebDriver driver;

  @FindBy(how = How.XPATH, using = "//div[contains(@class, 'account-header')]")
  private WebElement header;

  @FindBy(how = How.XPATH, using = "//inline-search[@type='chain']//input[@placeholder='Account or Subaccount Name']")
  private WebElement retailerChainTextBox;

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
    waitForElementToClickable(retailerChainTextBox, true).click();
    retailerChainTextBox.sendKeys(text);

    return this;
  }

}
