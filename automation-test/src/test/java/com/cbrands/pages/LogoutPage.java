package com.cbrands.pages;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.How;
import org.openqa.selenium.support.PageFactory;

import static com.cbrands.helper.SeleniumUtils.waitForVisibleFluentWait;

public class LogoutPage extends TestNGBasePage {
  private Log log = LogFactory.getLog(LogoutPage.class);
  private final WebDriver driver;

  @FindBy(how = How.XPATH, using = "//*[contains(., 'Logged Out')]")
  private WebElement logoutMessage;

  public LogoutPage(WebDriver driver) {
    this.driver = driver;
    PageFactory.initElements(driver, this);
  }

  @Override
  protected void load() {
    driver.get(webAppBaseUrl + "/auth/logout");
  }

  @Override
  public boolean isLoaded() throws Error {
    waitForVisibleFluentWait(logoutMessage);
    return logoutMessage.isDisplayed();
  }

}
