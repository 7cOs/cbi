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

    for( String requiredField : requiredFields) {
      log.info("Verifying required field message for " + requiredField);

      String xpathModal = "(//md-dialog//div[contains(@class, 'modal add-opportunity')]";
      String xpathForm = (xpathModal + "//label[contains(.,'[FIELD]')]/..//[TYPE]/../../..)"
          + "//p[contains(@class,'error-message')]");

      xpathForm = xpathForm.replace("[FIELD]", requiredField);
      switch( requiredField ) {
      case "Account":
      case "Recommended Package / SKU":
        xpathForm = xpathForm.replace("[TYPE]", "input[@type='text']");
        break;
      case "Rationale":
      case "Impact":
        xpathForm = xpathForm.replace("[TYPE]", "md-select");
        if(requiredField.equals("Rationale")) {
          xpathForm = "(" + xpathForm + ")[1]";
        }
        break;
      }

      if( ! isElementPresent(By.xpath(xpathForm)) ) { 
        return false; 
      }

      log.info("Required field message for " + requiredField  + " verified");
    }

    return true;
  }
}
