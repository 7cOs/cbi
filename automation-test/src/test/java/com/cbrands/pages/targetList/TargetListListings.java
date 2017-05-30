package com.cbrands.pages.targetList;

import com.cbrands.helper.PropertiesCache;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.How;
import org.openqa.selenium.support.ui.LoadableComponent;
import org.testng.Assert;

import static com.cbrands.helper.SeleniumUtils.findElement;
import static com.cbrands.helper.SeleniumUtils.waitForElementVisible;
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

  public boolean isHeaderDisplayed() {
    waitForVisibleFluentWait(listingsHeader);
    return listingsHeader.isDisplayed();
  }

  public boolean doesTargetListExist(String listname) {
    WebElement element = findElement(By.cssSelector("div[class='target-list-detail-container']"));
    waitForElementVisible(element, true);

    boolean targetListExists = false;
    String[] array = element.getText().split("\\n");

    for (String txt : array) {
      if (txt.trim().equalsIgnoreCase(listname)) {
        targetListExists = true;
        return targetListExists;
      }
    }

    return targetListExists;
  }

}
