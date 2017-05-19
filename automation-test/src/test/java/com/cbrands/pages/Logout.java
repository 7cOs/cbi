package com.cbrands.pages;

import com.cbrands.helper.PropertiesCache;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.How;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.LoadableComponent;
import org.testng.Assert;

import static com.cbrands.helper.SeleniumUtils.waitForVisibleFluentWait;

public class Logout  extends LoadableComponent<Logout> {
  private Log log = LogFactory.getLog(Logout.class);

  private final WebDriver driver;
  private final String webAppBaseUrl;

  @FindBy(how = How.XPATH, using = "//*[contains(., 'Logged Out')]")
  private WebElement logoutMessage;

  public Logout(WebDriver driver) {
    final PropertiesCache propertiesCache = PropertiesCache.getInstance();
    webAppBaseUrl = propertiesCache.getProperty("qa.host.address");

    this.driver = driver;
    PageFactory.initElements(driver, this);
  }

  @Override
  protected void load() {
    driver.get(webAppBaseUrl + "/auth/logout");
  }

  @Override
  protected void isLoaded() throws Error {
    Assert.assertTrue(isLogoutMessageDisplayed());
  }

  public void logoutViaUrl() {
    load();

    log.info("Logging out...\n\n");

    Assert.assertTrue(isLogoutMessageDisplayed(), "Failure logging out.\n");

    log.info("Logout successful.");
  }

  public boolean isOnLogoutPage() {
    return isLogoutMessageDisplayed();
  }

  private boolean isLogoutMessageDisplayed() {
    waitForVisibleFluentWait(logoutMessage);
    return logoutMessage.isDisplayed();
  }

}
