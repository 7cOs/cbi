package com.cbrands.pages;

import static com.cbrands.helper.SeleniumUtils.waitForVisible;
import static com.cbrands.helper.SeleniumUtils.waitForVisibleFluentWait;

import com.cbrands.TestUser;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.How;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.LoadableComponent;
import org.testng.Assert;

@Deprecated
public class Login extends LoadableComponent<Login>{
  private Log log = LogFactory.getLog(Login.class);

  private final WebDriver driver;

  private boolean isUserLoggedIn = false;

  @FindBy(how=How.XPATH, using="//*[@id='username']")
  private WebElement userName;

  @FindBy(how=How.XPATH, using="//*[@id='password']")
  private WebElement password;

  @FindBy(how=How.XPATH, using="//button[@type='submit']")
  private WebElement submitButton;

  public Login(WebDriver driver) {
    this.driver = driver;
    PageFactory.initElements(driver, this);
  }

  @Override
  protected void load() {
    driver.get("https://compass-qa.cbrands.com");
  }

  @Override
  protected void isLoaded() throws Error {
    waitForVisibleFluentWait(userName);
    Assert.assertTrue(userName.isDisplayed());

    waitForVisibleFluentWait(password);
    Assert.assertTrue(password.isDisplayed());

    waitForVisibleFluentWait(submitButton);
    Assert.assertTrue(submitButton.isDisplayed());
  }

  public void typeUserName(String text) {
    waitForVisibleFluentWait(userName);
    userName.sendKeys(text);
  }

  public void typePassword(String text) {
    waitForVisibleFluentWait(password);
    password.sendKeys(text);
  }

  /**
   * @deprecated Returns a deprecated class. Please use the {@link #loginAs} method instead
   */
  @Deprecated
  public Home loginWithValidCredentials(String userName, String password) {
    login(userName, password);
    isUserLoggedIn = true;
    return PageFactory.initElements(driver, Home.class);
  }

  public HomePage loginAs(TestUser user) {
    login(user.userName(), user.password());

    return PageFactory.initElements(driver, HomePage.class);
  }

  private void login(String userName, String password) {
    typeUserName(userName);
    typePassword(password);
    log.info("User: " + userName + " login submitted");
    submitButton.click();
  }

  public boolean isUserLoggedIn(){
    return isUserLoggedIn;
  }


  /**
   * @deprecated Please use the methods available in the Logout page object.
   * @see LogoutPage
   */
  @Deprecated
  public void logOut() {
    isUserLoggedIn = false;
    driver.get("https://compass-qa.cbrands.com/auth/logout");
  }

  /**
   * @deprecated Please use the methods available in the Logout page object.
   * @see LogoutPage
   */
  @Deprecated
  public void logOutwithWait() {
    isUserLoggedIn = false;
    driver.get("https://compass-qa.cbrands.com/auth/logout");
    waitForVisible (By.id("username"));
  }
}
