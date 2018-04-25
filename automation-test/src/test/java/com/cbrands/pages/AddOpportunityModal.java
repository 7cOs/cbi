package com.cbrands.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.How;
import org.openqa.selenium.support.PageFactory;
import org.testng.Assert;
import static com.cbrands.helper.SeleniumUtils.*;

public class AddOpportunityModal extends TestNGBasePage {
  private static final String LAUNCH_MODAL_XPATH = 
      "//a[@action='Add Opportunity']";
  private static final String MODAL_DIALOG_XPATH = 
      "(//md-dialog//div[contains(@class, 'modal add-opportunity')])";
  private static final String SAVE_BTN_XPATH = 
      (MODAL_DIALOG_XPATH + "//button[@type='submit' and contains(.,'Add')]");
  private static final String CANCEL_BTN_XPATH = 
      (MODAL_DIALOG_XPATH + "//p[contains(@class,'cancel') and contains(.,'X Cancel')]");  
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

  public AddOpportunityModal(WebDriver driver) {
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

  public AddOpportunityModal launchModal() {
    waitForElementToClickable(launchModal, true).click();
    return this;
  }

  public AddOpportunityModal clickAddButton() {
    waitForElementToClickable(modalSaveBtn, true).click();
    return this;
  }

  public AddOpportunityModal clickCancelButton() {
    waitForElementToClickable(modalCancelBtn, true).click();
    return this;
  }  

  public AddOpportunityModal clickOutsideModal() {
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

  public AddOpportunityModal confirmRequiredFieldsErrorMessages() {
    String[][] os = {
        {"Account", "Please select an Account."},
        {"Recommended Package / SKU", "Please enter a Recommended Package / SKU."},
        {"Rationale", "Please select a Rationale, or add another one."},
        {"Impact", "Please select an impact level."}
    };
    for( String[] o : os) {
      String xpdlg = "(//md-dialog//div[contains(@class, 'modal add-opportunity')]";
      String xprfm = (xpdlg + "//label[contains(.,'[FIELD]')]/..//[TYPE]/../../..)"
          + "//p[contains(@class,'error-message')]");
      String l, m; l=o[0]; m=o[1];
      xprfm = xprfm.replace("[FIELD]", l);
      switch( l ) {
      case "Account":
      case "Recommended Package / SKU":
        xprfm = xprfm.replace("[TYPE]", "input[@type='text']");
        break;
      case "Rationale":
      case "Impact":
        xprfm = xprfm.replace("[TYPE]", "md-select");
        if(l.equals("Rationale")) {
          xprfm = "(" + xprfm + ")[1]";
        }
        break;
      }
      Assert.assertTrue(isElementPresent(By.xpath(xprfm)));
      Assert.assertEquals(
          getRequiredFieldErrorMessage(xprfm), 
          "Reiquired field error message does not match expected value");
    }
    return this;
  }
}
