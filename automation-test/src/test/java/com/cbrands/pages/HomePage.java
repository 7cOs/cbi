package com.cbrands.pages;

import com.cbrands.pages.opportunities.OpportunitiesPage;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.How;
import org.openqa.selenium.support.PageFactory;

import static com.cbrands.helper.SeleniumUtils.*;

public class HomePage extends TestNGBasePage {
  private final WebDriver driver;

  @FindBy(how = How.XPATH, using = "//md-select[@aria-label='Saved Filter Dropdown']")
  private WebElement savedReportsDropdown;

  public HomePage(WebDriver driver) {
    this.driver = driver;
    PageFactory.initElements(driver, this);
  }

  @Override
  protected void load() {
    driver.get(webAppBaseUrl);
  }

  @Override
  public boolean isLoaded() {
    waitForElementToDisappear(By.xpath("//div[@class='loader']"));
    return isElementPresent(By.xpath("//greeting//h1"));
  }

  public HomePage clickSavedReportsDropdown() {
    waitForElementToClickable(savedReportsDropdown, true).click();
    return this;
  }

  public boolean doesSavedReportExistWithName(String name) {
    return isElementPresent(getByHandleForSavedReportWithName(name));
  }

  public OpportunitiesPage selectSavedReportWithName(String reportName) {
    scrollToAndClick(savedReportsDropdown.findElement(getByHandleForSavedReportWithName(reportName)));
    return PageFactory.initElements(driver, OpportunitiesPage.class);
  }

  private By getByHandleForSavedReportWithName(String name) {
    return By.xpath("//md-option[contains(@class, 'saved-filter-option')]/div[contains(., '" + name + "')]");
  }
}
