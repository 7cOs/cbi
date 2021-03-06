package com.cbrands.pages;

import com.cbrands.TestUser;
import com.cbrands.test.BaseTestCase;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.How;
import org.openqa.selenium.support.PageFactory;
import org.testng.Assert;

import static com.cbrands.helper.SeleniumUtils.enterKeys;
import static com.cbrands.helper.SeleniumUtils.waitForElementToClickable;
import static com.cbrands.helper.SeleniumUtils.waitForVisibleFluentWait;

public class LoginPage extends TestNGBasePage {
  private Log log = LogFactory.getLog(LoginPage.class);
  private final WebDriver driver;

  @FindBy(how=How.XPATH, using="//*[@id='username']")
  private WebElement usernameField;

  @FindBy(how=How.XPATH, using="//*[@id='password']")
  private WebElement passwordField;

  @FindBy(how=How.XPATH, using="//button[@type='submit']")
  private WebElement submitButton;

  public LoginPage(WebDriver driver) {
    this.driver = driver;
    PageFactory.initElements(driver, this);
  }

  @Override
  protected void load() {
    log.info("\nLoading webpage...");
    driver.get(webAppBaseUrl);
  }

  @Override
  public boolean isLoaded() {
    waitForVisibleFluentWait(usernameField);
    return usernameField.isDisplayed();
  }

  public HomePage loginAs(TestUser testUser) {
    this.goToPage();
    final HomePage landingPage = this.enterUserName(testUser)
      .enterPassword(testUser)
      .clickSubmit();

    log.info("User: " + testUser.userName() + " login submitted");
    Assert.assertTrue(landingPage.isLoaded(), "Failed to log in user: " + testUser.userName());
    log.info("Logged in successfully as: " + testUser.userName());

    return landingPage;
  }

  private LoginPage enterUserName(TestUser testUser) {
    enterKeys(usernameField, testUser.userName());
    return this;
  }

  private LoginPage enterPassword(TestUser testUser) {
    enterKeys(passwordField, testUser.password());
    return this;
  }

  private HomePage clickSubmit() {
    submitButton.click();
    return PageFactory.initElements(driver, HomePage.class);
  }
  
  /**
   * Login using jse Process 
   * @author sdk
   */
  public HomePage login(TestUser testUser) {
	    this.goToPage();
	  	final JavascriptExecutor jse =  (JavascriptExecutor) driver; 
	  	
	    final String args = "arguments[0].value='%s'";
	    
	    WebElement[] fs = {usernameField, passwordField};
	    for( WebElement f :  fs ) {
	    	jse.executeScript(
	    			f.getAttribute("id").equals("username") ? 
	    			String.format(args, testUser.userName()) :
	    			String.format(args, testUser.password()), 
	    		f);
	    }
	    jse.executeScript("arguments[0].click();", submitButton);
	    
	    HomePage landingPage = PageFactory.initElements(driver, HomePage.class);
	    log.info("User: " + testUser.userName() + " login submitted");
	    Assert.assertTrue(landingPage.isLoaded(), "Failed to log in user: " + testUser.userName());
	    log.info("Logged in successfully as: " + testUser.userName());

	    return landingPage;
	  }
}
