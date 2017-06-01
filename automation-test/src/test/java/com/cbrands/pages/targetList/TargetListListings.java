package com.cbrands.pages.targetList;

import com.cbrands.helper.PropertiesCache;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.How;
import org.openqa.selenium.support.ui.LoadableComponent;
import org.testng.Assert;

import static com.cbrands.helper.SeleniumUtils.waitForVisibleFluentWait;

public class TargetListListings extends LoadableComponent<TargetListListings> {

  private final WebDriver driver;

  @FindBy(how = How.XPATH, using = "//h1[text()='Target Lists']")
  private WebElement listingsHeader;

  public TargetListListings(WebDriver driver) {
    this.driver = driver;
  }

  @Override
  protected void isLoaded() throws Error {
    Assert.assertTrue(isHeaderDisplayed(), "Target List listings page not loaded.");
  }

  @Override
  protected void load() {
    driver.get(PropertiesCache.getInstance().getProperty("qa.host.address") + "/target-lists");
  }

  private boolean isHeaderDisplayed() {
    waitForVisibleFluentWait(listingsHeader);
    return listingsHeader.isDisplayed();
  }

}
