package com.cbrands.pages.targetList;

import com.cbrands.pages.TestNGBasePage;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.How;
import org.openqa.selenium.support.PageFactory;
import org.testng.Assert;

import static com.cbrands.helper.SeleniumUtils.*;

public class EditTargetListModal extends TestNGBasePage {

  private static final String MODAL_CONTAINER_XPATH = "//div[contains(@class, 'target-list-modal')]";
  private final WebDriver driver;

  @FindBy(how = How.XPATH, using = MODAL_CONTAINER_XPATH)
  private WebElement modal;

  @FindBy(how = How.CSS, using = "input[placeholder='Enter List Name']")
  private WebElement listNameTextBox;

  @FindBy(how = How.XPATH, using = "//textarea[@placeholder='Enter Description']")
  private WebElement descriptionTextBox;

  @FindBy(how = How.XPATH, using = "//input[@placeholder='Name or CBI email address']")
  private WebElement collaboratorSearchBox;

  @FindBy(how = How.XPATH, using = "//div/div[2]/button")
  private WebElement saveButton;

  @FindBy(how = How.XPATH, using = "//button[contains(.,'Delete')]")
  private WebElement deleteListButton;

  @FindBy(how = How.XPATH, using = "//a[contains(.,'Yes, Delete')]")
  private WebElement confirmDelete;

  public EditTargetListModal(WebDriver driver) {
    this.driver = driver;
  }

  @Override
  public boolean isLoaded() {
    waitForVisibleFluentWait(modal);
    return modal.isDisplayed();
  }

  @Override
  protected void load() {
    Assert.fail("The Manage modal for Target Lists cannot be loaded directly.");
  }

  public EditTargetListModal enterListName(String name) {
    waitForVisibleFluentWait(listNameTextBox);
    listNameTextBox.clear();
    listNameTextBox.sendKeys(name);
    return this;
  }

  public EditTargetListModal enterDescription(String description) {
    waitForElementToClickable(descriptionTextBox, true).click();
    descriptionTextBox.sendKeys(description);
    return this;
  }

  public EditTargetListModal addCollaborator(String collaborator) {
    waitForElementToClickable(collaboratorSearchBox, true).click();
    collaboratorSearchBox.sendKeys(collaborator);

    WebElement searchButton = findElement(By.xpath("//div[2]/div[3]/inline-search/div/input[3]"));
    searchButton.click();

    WebElement firstCollaboratorResult = findElement(By.xpath("//div[2]/div[3]/inline-search/div/div/ul/li"));
    firstCollaboratorResult.click();
    return this;
  }

  public TargetListListingsPage clickSaveButton() {
    final TargetListListingsPage targetListListingsPage = PageFactory.initElements(driver, TargetListListingsPage.class);

    saveButton.click();
    waitForElementToDisappear(By.xpath(MODAL_CONTAINER_XPATH));

    return targetListListingsPage;
  }

  public EditTargetListModal clickDeleteTargetListButton() {
    deleteListButton.click();

    return this;
  }

  public TargetListListingsPage confirmListDelete() {
    waitForVisibleFluentWait(confirmDelete).click();

    return PageFactory.initElements(driver, TargetListListingsPage.class);
  }

}
