package com.cbrands.pages.targetList;

import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.How;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.LoadableComponent;
import org.testng.Assert;

import static com.cbrands.helper.SeleniumUtils.*;

public class TargetListDetailPage extends LoadableComponent<TargetListDetailPage> {

  private final WebDriver driver;

  @FindBy(how = How.XPATH, using = "//v-accordion[@id='opportunities']")
  private WebElement opportunities;

  @FindBy(how = How.XPATH, using = "//button[contains(.,'Manage')]")
  private WebElement targetListManageButton;

  public TargetListDetailPage(WebDriver driver) {
    this.driver = driver;
  }

  @Override
  protected void isLoaded() throws Error {
    Assert.assertTrue(isOpportunityListLoaded());
  }

  @Override
  protected void load() {
    Assert.fail("The Target List detail page cannot be loaded directly without a specified Target List.");
  }

  public boolean isOpportunityListLoaded() {
    waitForVisibleFluentWait(opportunities);
    return opportunities.isDisplayed();
  }

  public void clickManageButton() {
    waitForElementVisible(findElement(By.xpath("//div[contains(@class, 'loader')]")), false);
    waitForElementToClickable(targetListManageButton, true).click();
  }
}
