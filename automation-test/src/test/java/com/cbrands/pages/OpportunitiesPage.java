package com.cbrands.pages;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.support.PageFactory;

public class OpportunitiesPage extends TestNGBasePage {
  private final WebDriver driver;

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
    return false;
  }
}
