package com.cbrands.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.How;
import org.openqa.selenium.support.PageFactory;
import org.testng.Assert;
import static com.cbrands.helper.SeleniumUtils.*;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

public class CustomOpportunityModal extends TestNGBasePage {
  private static final String LAUNCH_MODAL_XPATH = "//a[@action='Add Opportunity']";
  private static final String MODAL_DIALOG_XPATH = "(//md-dialog//div[contains(@class, 'modal add-opportunity')])";
  private static final String SAVE_BTN_XPATH = (MODAL_DIALOG_XPATH + "//button[@type='submit' and contains(.,'Add')]");
  private static final String CANCEL_BTN_XPATH = (MODAL_DIALOG_XPATH + "//p[contains(@class,'cancel') and contains(.,'X Cancel')]");  
  private static final String BODY_XPATH = "//body";
  public static final String REQUIRED_FIELD_ERROR_XPATH = "/../../..//div[@aria-hidden='false']/p[contains(@class,'error-message')]";
  private static final String ACCOUNT_FIELD_XPATH = "//label[contains(.,'Account')]/..//input[@type='text']";
  private static final String PACKAGE_SKU_FIELD_XPATH = "//label[contains(.,'Recommended Package / SKU')]/..//input[@type='text']";
  private static final String RATIONALE_FIELD_XPATH = "//label[contains(.,'Rationale')]/..//md-select";
  private static final String IMPACT_FIELD_XPATH = "//label[contains(.,'Impact')]/..//md-select";

  @FindBy(how = How.XPATH, using = LAUNCH_MODAL_XPATH)
  private WebElement launchModal;

  @FindBy(how = How.XPATH, using = MODAL_DIALOG_XPATH)
  private WebElement modalDialog;

  @FindBy(how = How.XPATH, using = SAVE_BTN_XPATH)
  private WebElement modalSaveBtn;

  @FindBy(how = How.XPATH, using = CANCEL_BTN_XPATH)
  private WebElement modalCancelBtn;  

  @FindBy(how = How.XPATH, using = BODY_XPATH)
  private WebElement body;
  
  private final WebDriver driver;

  public CustomOpportunityModal(WebDriver driver) {
    this.driver = driver;
    PageFactory.initElements(driver, this);
  }

  public WebDriver getDriver() {
    return driver;
  }

  @Override
  protected void load() {
    Assert.fail("The Add Opportunity modal component "
        + "cannot be loaded directly via url.");
  }

  @Override
  public boolean isLoaded() {
    waitForVisibleFluentWait(modalDialog);
    return isElementPresent(By.xpath(MODAL_DIALOG_XPATH));
  }

  public CustomOpportunityModal launchModal() {
    waitForElementToClickable(launchModal, true).click();
    return this;
  }

  public CustomOpportunityModal clickAddButton() {
    waitForElementToClickable(modalSaveBtn, true).click();
    return this;
  }

  public CustomOpportunityModal clickCancelButton() {
    waitForElementToClickable(modalCancelBtn, true).click();
    return this;
  }  

  public CustomOpportunityModal clickOutsideModal() {
    body.click();
    return this;
  }

  public boolean isModalDisplayed() {
    return isElementPresent(By.xpath(MODAL_DIALOG_XPATH));
  }
 
  public boolean isModalClosed() {
    waitForElementToDisappear(By.xpath(MODAL_DIALOG_XPATH));
    return !isModalDisplayed();
  }

  public boolean isAccountRequiredFieldErrorDisplayed() {
    return isElementPresent(By.xpath(getRequiredErrorMessageXPathFor(ACCOUNT_FIELD_XPATH)));
  }

  public boolean isRecommendedPackageSkuRequiredFieldErrorDisplayed() {
    return isElementPresent(By.xpath(getRequiredErrorMessageXPathFor(PACKAGE_SKU_FIELD_XPATH)));
  }

  public boolean isRationaleRequiredFieldErrorDisplayed() {
    return isElementPresent(By.xpath(getRequiredErrorMessageXPathFor(RATIONALE_FIELD_XPATH)));
  }

  public boolean isImpactRequiredFieldErrorDisplayed() {
    return isElementPresent(By.xpath(getRequiredErrorMessageXPathFor(IMPACT_FIELD_XPATH)));
  }

  private String getRequiredErrorMessageXPathFor(String fieldXPath) {
    return MODAL_DIALOG_XPATH + fieldXPath + REQUIRED_FIELD_ERROR_XPATH;
  }
}
