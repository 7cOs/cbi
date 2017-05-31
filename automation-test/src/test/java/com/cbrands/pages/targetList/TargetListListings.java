package com.cbrands.pages.targetList;

import com.cbrands.helper.PropertiesCache;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindAll;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.How;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.LoadableComponent;
import org.testng.Assert;

import java.util.List;

import static com.cbrands.helper.SeleniumUtils.findElement;
import static com.cbrands.helper.SeleniumUtils.waitForElementVisible;
import static com.cbrands.helper.SeleniumUtils.waitForVisibleFluentWait;

public class TargetListListings extends LoadableComponent<TargetListListings> {

  private final WebDriver driver;

  @FindBy(how = How.XPATH, using = "//h1[text()='Target Lists']")
  private WebElement listingsHeader;

  @FindBy(how = How.CSS, using = "div.target-action-buttons>button[class='btn-action']")
  private WebElement createNewListButton;

  @FindAll(@FindBy(how=How.CSS, using = "div[class='modal target-list-switch-modal']>div.modal-form>div.row>button[class='btn-action col-6']"))
  private List<WebElement> listCreationChoiceModalButtons;

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

    String[] array = element.getText().split("\\n");

    for (String txt : array) {
      if (txt.trim().equalsIgnoreCase(listname)) {
        return true;
      }
    }

    return false;
  }

  public TargetListListings clickCreateNewListButton() {
    waitForVisibleFluentWait(createNewListButton).click();
    return this;
  }

  public EditTargetListModal chooseCreateNewListInListCreationChoiceModal() {
    waitForVisibleFluentWait(listCreationChoiceModalButtons.get(0)).click();
    return PageFactory.initElements(driver, EditTargetListModal.class);
  }

}
