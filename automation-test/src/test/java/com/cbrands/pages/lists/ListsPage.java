package com.cbrands.pages.lists;

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

public class ListsPage extends TestNGBasePage {
  private static final String LOADER_XPATH = "//loader";
  private static final String HEADER_XPATH = "//h1[text()='Lists']";

  private final WebDriver driver;
  protected Log log = LogFactory.getLog(ListsPage.class);

  @FindBy(how = How.XPATH, using = HEADER_XPATH)
  private WebElement listingsHeader;

  @FindBy(how = How.XPATH, using = "//button[contains(., 'Delete')]")
  private WebElement deleteButton;

  @FindBy(how = How.XPATH, using = "//button[contains(., 'Create a New List')]")
  private WebElement createNewListButton;

  @FindBy(how = How.XPATH, using = "//*[@class='target-list-detail-container']/ul/li")
  private List<WebElement> listElements;

  public ListsPage(WebDriver driver) {
    this.driver = driver;
  }

  @Override
  public boolean isLoaded() {
    waitForVisibleFluentWait(listingsHeader);
    waitForElementToDisappear(By.xpath(LOADER_XPATH));

    return isElementPresent(By.xpath(HEADER_XPATH)) && !isElementPresent(By.xpath(LOADER_XPATH));
  }

  @Override
  protected void load() {
    driver.get(webAppBaseUrl + "/lists");
  }

  public ConfirmDeleteModal clickDeleteButton() {
    waitForElementToClickable(deleteButton, true).click();
    return new ConfirmDeleteModal();
  }

  public ListsSwitchModal clickCreateNewListButton() {
    waitForVisibleFluentWait(createNewListButton).click();
    return new ListsSwitchModal();
  }

  public boolean doesListExist(String listname) {
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

  public ListDetailPage clickListByName(String listName) {
    WebElement listElement = getListByName(listName);

    if (null != listElement) {
      listElement.click();
    } else {
      log.info("Cannot click List. No list found by the following name: " + listName);
    }

    return PageFactory.initElements(driver, ListDetailPage.class);
  }

  public ListsPage selectCheckboxByListName(String listName) {
    final WebElement list = getListByName(listName);

    if (null != list) {
      final WebElement listCheckBox = list.findElement(By.xpath("./div[1]/md-checkbox"));
      listCheckBox.click();
      waitForElementToBeChecked(listCheckBox);
    } else {
      log.info("Cannot select List checkbox. No list found by the following name: " + listName);
    }

    return this;
  }

  private WebElement getListByName(String listName) {
    WebElement listElement = null;

    for (WebElement element : listElements) {
      final String elementTitle = element.findElement(By.xpath("./div/div[@class='stats']/div/h4[1]")).getText();
      if (elementTitle.equalsIgnoreCase(listName)) {
        listElement = element;
        break;
      }

    }

    return listElement;
  }

  public class ListsSwitchModal {
    private static final String MODAL_XPATH = "//div[@class='modal target-list-switch-modal']";

    private WebElement modal;

    public ListsSwitchModal() {
      final By modalHandle = By.xpath(MODAL_XPATH);
      modal = waitForVisibleFluentWait(modalHandle);
    }

    public ListManagementModal chooseCreateNewList() {
      waitForElementToClickable(modal.findElement(By.xpath("//button[contains(., 'Create New List')]")), true).click();
      return PageFactory.initElements(driver, ListManagementModal.class);
    }
  }

  public class ConfirmDeleteModal {
    private WebElement modal;

    public ConfirmDeleteModal(){
      modal = findElement(By.xpath("//compass-alert-modal"));
      waitForVisibleFluentWait(modal);
    }

    public ListsPage confirmDelete() {
      waitForElementToClickable(modal.findElement(By.xpath(".//button[contains(., 'Delete')]")), true).click();
      return PageFactory.initElements(driver, ListsPage.class);
    }

  }
}
