package com.cbrands.pages.opportunities;

import com.cbrands.pages.TestNGBasePage;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.How;
import org.openqa.selenium.support.PageFactory;
import org.testng.Assert;

import static com.cbrands.helper.SeleniumUtils.*;

public class SavedReportModal extends TestNGBasePage {
  private static final String MODAL_CONTAINER_XPATH = "//div[contains(@class, '-report')]";
  private static final String EDIT_NAME_XPATH = MODAL_CONTAINER_XPATH +
    "//input[contains(@ng-model, 'editedFilterName')]";

  private final WebDriver driver;

  @FindBy(how = How.XPATH, using = MODAL_CONTAINER_XPATH)
  private WebElement savedReportModalContainer;

  @FindBy(how = How.XPATH, using = MODAL_CONTAINER_XPATH + "//p[contains(., 'Delete Report')]")
  private WebElement deleteSavedReportLink;

  @FindBy(how = How.XPATH, using = MODAL_CONTAINER_XPATH + "//input[@placeholder='Enter a name']")
  private WebElement nameField;

  @FindBy(how = How.XPATH, using = EDIT_NAME_XPATH)
  private WebElement editNameField;

  @FindBy(how = How.XPATH, using = MODAL_CONTAINER_XPATH + "//button[contains(., 'Save')]")
  private WebElement saveButton;

  public SavedReportModal(WebDriver driver) {
    this.driver = driver;
    PageFactory.initElements(driver, this);
  }

  @Override
  protected void load() {
    Assert.fail("The Saved Report modal component cannot be loaded directly via url.");
  }

  @Override
  public boolean isLoaded() {
    waitForVisibleFluentWait(savedReportModalContainer);
    return isElementPresent(By.xpath(MODAL_CONTAINER_XPATH));
  }

  public SavedReportModal enterReportName(String name) {
    waitForElementToClickable(nameField, true).click();
    nameField.sendKeys(name);

    return this;
  }

  public SavedReportModal enterNewReportName(String newReportName) {
    waitForElementToClickable(editNameField, true).click();
    editNameField.clear();
    editNameField.sendKeys(newReportName);

    return this;
  }

  public SavedReportModal clickSave() {
    waitForElementToClickable(saveButton, true).click();
    return this;
  }

  public SavedReportModal clickSavedReportDeleteLink() {
    waitForElementToClickable(deleteSavedReportLink, true).click();
    return this;
  }

  public OpportunitiesPage waitForModalToClose() {
    waitForElementToDisappear(By.xpath(MODAL_CONTAINER_XPATH));
    return PageFactory.initElements(driver, OpportunitiesPage.class);
  }

  public boolean isDuplicateNameErrorDisplayed() {
    return isElementPresent(By.xpath(MODAL_CONTAINER_XPATH + "//p[contains(@ng-if, 'duplicateName')]"));
  }

  public boolean isMaxSavedReportsLimitErrorDisplayed() {
    return isElementPresent(By.xpath(MODAL_CONTAINER_XPATH + "//p[contains(@ng-hide, 'opportunityFilters.length')]"));
  }
}


