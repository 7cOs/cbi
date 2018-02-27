package com.cbrands.pages.targetList;

import com.cbrands.pages.TestNGBasePage;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.How;
import org.openqa.selenium.support.PageFactory;

import java.util.List;

import static com.cbrands.helper.SeleniumUtils.*;

public class TargetListListingsPage extends TestNGBasePage {
  private static final String LOADER_XPATH = "//loader";

  private final WebDriver driver;
  protected Log log = LogFactory.getLog(TargetListListingsPage.class);

  @FindBy(how = How.XPATH, using = "//h1[text()='Target Lists']")
  private WebElement listingsHeader;

  @FindBy(how = How.XPATH, using = "//button[contains(., 'Delete')]")
  private WebElement deleteButton;

  @FindBy(how = How.CSS, using = "div.target-action-buttons>button[class='btn-action']")
  private WebElement createNewListButton;

  @FindBy(how = How.XPATH, using = "//*[@class='target-list-detail-container']/ul/li")
  private List<WebElement> targetListElements;

  public TargetListListingsPage(WebDriver driver) {
    this.driver = driver;
  }

  @Override
  public boolean isLoaded() {
    waitForVisibleFluentWait(listingsHeader);
    waitForElementToDisappear(By.xpath(LOADER_XPATH));
    return listingsHeader.isDisplayed();
  }

  @Override
  protected void load() {
    driver.get(webAppBaseUrl + "/target-lists");
  }

  public TargetListListingsPage clickDeleteButton() {
    waitForElementToClickable(deleteButton, true).click();
    return this;
  }

  public TargetListSwitchModal clickCreateNewListButton() {
    waitForVisibleFluentWait(createNewListButton).click();
    return new TargetListSwitchModal();
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

  public TargetListDetailPage clickTargetListByName(String listName) {
    WebElement targetListElement = getTargetListByName(listName);

    if (null != targetListElement) {
      targetListElement.click();
    } else {
      log.info("Cannot click Target List. No target list found by the following name: " + listName);
    }

    return PageFactory.initElements(driver, TargetListDetailPage.class);
  }

  public TargetListListingsPage selectTargetListByName(String listName) {
    final WebElement targetList = getTargetListByName(listName);

    if (null != targetList) {
      final WebElement targetListCheckBox = targetList.findElement(By.xpath("./div[1]/md-checkbox"));
      targetListCheckBox.click();
      waitForElementAttributeToContain(targetListCheckBox, "aria-checked", "true");
    } else {
      log.info("Cannot select Target List checkbox. No target list found by the following name: " + listName);
    }

    return this;
  }

  private WebElement getTargetListByName(String listName) {
    WebElement targetListElement = null;

    for (WebElement element : targetListElements) {
      final String elementTitle = element.findElement(By.xpath("./div/div[@class='stats']/div/h4[1]")).getText();
      if (elementTitle.equalsIgnoreCase(listName)) {
        targetListElement = element;
        break;
      }

    }

    return targetListElement;
  }

  public class TargetListSwitchModal {
    private static final String MODAL_XPATH = "//div[@class='modal target-list-switch-modal']";

    private WebElement modal;

    public TargetListSwitchModal() {
      final By modalHandle = By.xpath(MODAL_XPATH);
      modal = waitForVisibleFluentWait(modalHandle);
    }

    public EditTargetListModal chooseCreateNewList() {
      final List<WebElement> listCreationChoiceButtons = findElements(By.cssSelector(
        "div[class='modal target-list-switch-modal']>div.modal-form>div.row>button[class='btn-action col-6']"));
      waitForVisibleFluentWait(listCreationChoiceButtons.get(0)).click();
      return PageFactory.initElements(driver, EditTargetListModal.class);
    }
  }
}
