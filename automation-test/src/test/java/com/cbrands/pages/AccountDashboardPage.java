package com.cbrands.pages;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.How;
import org.openqa.selenium.support.ui.LoadableComponent;
import org.testng.Assert;

import static com.cbrands.helper.SeleniumUtils.waitForVisibleFluentWait;

public class AccountDashboardPage extends LoadableComponent<AccountDashboardPage> {

  private final WebDriver driver;

  @FindBy(how = How.XPATH, using = "//div[contains(@class, 'account-header')]")
  private WebElement header;

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
    Assert.fail("The Target List detail page cannot be loaded directly without a specified Target List.");
  }

}
