package com.cbrands.pages;

import static com.cbrands.helper.SeleniumUtils.waitForVisible;

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

import com.cbrands.helper.PropertiesCache;

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
	
	public void typeUserName(String text) {
		userName.sendKeys(text);
	}

	public void typePassword(String text) {
		password.sendKeys(text);
	}

	public HomePage clickSubmit() {
		submitButton.click();
		isUserLoggedIn = true;
        return PageFactory.initElements(driver, HomePage.class);
    }
	
	public HomePage loginWithValidCredentials(String userName, String password) {
        typeUserName(userName);
        typePassword(password);
		log.info("User: " + userName + " login submited");
        return clickSubmit();
    }
	
	public boolean isUserLoggedIn(){
		return isUserLoggedIn;
	}

	@Override
	protected void load() {
		driver.get("https://orion-qa.cbrands.com/auth/logout");
	}

	@Override
	protected void isLoaded() throws Error {
		Assert.assertTrue(userName.isDisplayed());
		Assert.assertTrue(password.isDisplayed());
		Assert.assertTrue(submitButton.isDisplayed());
		log.info("Logged out");
	}

	public void logOut() {
		isUserLoggedIn = false;
		driver.get("https://orion-qa.cbrands.com/auth/logout");
	}
	
	public void logOutwithWait() {
		isUserLoggedIn = false;
		driver.get("https://orion-qa.cbrands.com/auth/logout");
		waitForVisible (By.id("username"));
	}
}
