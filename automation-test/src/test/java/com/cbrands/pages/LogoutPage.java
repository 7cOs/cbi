package com.cbrands.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.support.PageFactory;

import static com.cbrands.helper.SeleniumUtils.isElementPresent;

public class LogoutPage extends TestNGBasePage {
  private static final String LOGGED_OUT_MESSAGE = "//*[contains(., 'Logged Out')]";
  private final WebDriver driver;

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
    return isElementPresent(By.xpath(LOGGED_OUT_MESSAGE)) || PageFactory.initElements(driver, LoginPage.class).isLoaded();
  }

}
