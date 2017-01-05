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
	
	@FindBy(how=How.XPATH, using="id(\"username\")")
	private WebElement userName;

	@FindBy(how=How.XPATH, using="id(\"password\")")
	private WebElement password;

	@FindBy(how=How.XPATH, using="//form[@name=\"login-form\"]/div[3]/div[1]/button[1]")
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
		log.info("User: " + userName + " Logged successfully.");
        return clickSubmit();
    }
	
	public boolean isUserLoggedIn(){
		return isUserLoggedIn;
	}

	@Override
	protected void load() {
		driver.get(PropertiesCache.getInstance().getProperty("qa.host.address"));
	}

	@Override
	protected void isLoaded() throws Error {
		Assert.assertEquals(driver.getCurrentUrl(), PropertiesCache.getInstance().getProperty("qa.host.address"));
		
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
