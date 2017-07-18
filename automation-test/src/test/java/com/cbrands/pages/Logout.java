package com.cbrands.pages;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.How;
import org.openqa.selenium.support.PageFactory;
import org.testng.Assert;

import static com.cbrands.helper.SeleniumUtils.waitForVisibleFluentWait;

public class Logout  extends TestNGBasePage {
  private Log log = LogFactory.getLog(Logout.class);
  private final WebDriver driver;

  @FindBy(how = How.XPATH, using = "//*[contains(., 'Logged Out')]")
  private WebElement logoutMessage;

  public Logout(WebDriver driver) {
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

  public void logoutViaUrl() {
    load();

    log.info("Logging out...");

    Assert.assertTrue(isLoaded(), "Failure logging out.\n\n");

    log.info("Logout successful.\n\n");
  }

}
