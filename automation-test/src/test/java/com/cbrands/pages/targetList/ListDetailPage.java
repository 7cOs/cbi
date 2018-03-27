package com.cbrands.pages.targetList;

import com.cbrands.pages.TestNGBasePage;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.How;
import org.openqa.selenium.support.PageFactory;
import org.testng.Assert;

import static com.cbrands.helper.SeleniumUtils.*;

public class ListDetailPage extends TestNGBasePage {

  private final WebDriver driver;

  @FindBy(how = How.XPATH, using = "//v-accordion[@id='opportunities']")
  private WebElement opportunities;

  @FindBy(how = How.XPATH, using = "//button[contains(.,'Manage')]")
  private WebElement targetListManageButton;

  public ListDetailPage(WebDriver driver) {
    this.driver = driver;
  }

  @Override
  public boolean isLoaded() {
    waitForVisibleFluentWait(opportunities);
    return opportunities.isDisplayed();
  }

  @Override
  protected void load() {
    Assert.fail("The Target List detail page cannot be loaded directly without a specified Target List.");
  }

  public ListManagementModal clickManageButton() {
    waitForElementToClickable(targetListManageButton, true).click();

    return PageFactory.initElements(driver, ListManagementModal.class);
  }
}
