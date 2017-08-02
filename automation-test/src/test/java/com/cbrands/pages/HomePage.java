package com.cbrands.pages;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.How;
import org.openqa.selenium.support.PageFactory;

import static com.cbrands.helper.SeleniumUtils.waitForVisibleFluentWait;

public class HomePage extends TestNGBasePage {
  private final WebDriver driver;

  @FindBy(how = How.XPATH, using = "//greeting//h1")
  private WebElement greeting;

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
    waitForVisibleFluentWait(greeting);
    return greeting.isDisplayed();
  }
}
