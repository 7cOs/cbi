package com.cbrands.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.How;
import org.openqa.selenium.support.PageFactory;

import static com.cbrands.helper.SeleniumUtils.waitForElementToClickable;
import static com.cbrands.helper.SeleniumUtils.waitForVisibleFluentWait;

public class OpportunitiesPage extends TestNGBasePage {
  private final WebDriver driver;

  @FindBy(how = How.XPATH, using = "//form[contains(@class, 'filters')]")
  private WebElement filterContainer;

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

  public OpportunitiesPage enterAccountSearchText(String searchText) {
    final WebElement accountSearchField = filterContainer
      .findElement(By.xpath(".//input[@placeholder='Account or Subaccount Name']"));
    waitForElementToClickable(accountSearchField, true).click();
    accountSearchField.sendKeys(searchText);

    return this;
  }

  public OpportunitiesPage clickSearchForAccount() {
    final WebElement searchButton = filterContainer
      .findElement(By.xpath(".//input[contains(@class, 'submit-btn visible')]"));
    waitForElementToClickable(searchButton, true).click();

    return this;
  }
}
