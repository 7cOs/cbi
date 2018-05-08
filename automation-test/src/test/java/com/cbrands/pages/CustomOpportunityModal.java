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
  private Log log = LogFactory.getLog(LoginPage.class);
  private static final String LAUNCH_MODAL_XPATH = "//a[@action='Add Opportunity']";
  private static final String MODAL_DIALOG_XPATH = "(//md-dialog//div[contains(@class, 'modal add-opportunity')])";
  private static final String SAVE_BTN_XPATH = (MODAL_DIALOG_XPATH + "//button[@type='submit' and contains(.,'Add')]");
  private static final String CANCEL_BTN_XPATH = (MODAL_DIALOG_XPATH + "//p[contains(@class,'cancel') and contains(.,'X Cancel')]");  
  private static final String BODY_XPATH = "//body";
  
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
    return isModalDisplayed();
  }

  public String getRequiredFieldErrorMessage(String xpath) {
    return findElement(By.xpath(xpath)).getText();
  }

  /**
   * NOTE: This method is to be used for discussion purposes only 
   * as an approach open as to how required fields confirmation
   * should be performed during automation. It is included
   * here for demo and discussion purposes only.
   * @category DEMO_AND_DISCUSSION
   */
  public boolean areAllRequiredFieldErrorMessagesDisplayed() {
    String[] requiredFields = {
        "Account",
        "Recommended Package / SKU",
        "Rationale",
        "Impact"
    };

    boolean isAllDisplayed = true;
    for( final String requiredField : requiredFields) {
      log.debug("Verifying required field message for " + requiredField);

      final String xpathForm = getXPathString(requiredField);
      if( ! isElementPresent(By.xpath(xpathForm)) ) {
        isAllDisplayed = false;
      }
      log.debug("Required field message for " + requiredField  + " verified");
    }

    return isAllDisplayed;
  }

  private String getXPathString(String requiredField) {
    final String MODAL_XPATH = "md-dialog//div[contains(@class, 'modal add-opportunity')]";
    final String REQUIRED_FIELD_XPATH = "label[contains(.,'" + requiredField + "')]/..//%s/../../..)//..";
    final String ERR_MSG_XPATH = "div[@aria-hidden='false']/p[contains(@class,'error-message')]";
    final String BASE_XPATH = String.format("((//%s//%s)/%s", MODAL_XPATH, REQUIRED_FIELD_XPATH, ERR_MSG_XPATH);
    String xpathForm = null;

    if("Account".equals(requiredField) || "Recommended Package / SKU".equals(requiredField)){
      xpathForm = String.format(BASE_XPATH, "input[@type='text']");
    } else if ("Rationale".equals(requiredField) || "Impact".equals(requiredField)) {
      xpathForm = String.format(BASE_XPATH, "md-select");
    }

    return xpathForm;
  }
}
