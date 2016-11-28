package com.cbrands;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.concurrent.TimeUnit;

import org.apache.commons.io.FileUtils;
import org.openqa.selenium.By;
import org.openqa.selenium.ElementNotVisibleException;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.TakesScreenshot;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedCondition;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.FluentWait;
import org.openqa.selenium.support.ui.Select;
import org.openqa.selenium.support.ui.Wait;
import org.openqa.selenium.support.ui.WebDriverWait;

/**
 * 
 * @author Kazi Hossain
 *
 */
public class SeleniumUtils {

	public static final int DEFAULT_WAIT_TIME = 10;
	private static WebDriver driver;
	private static String baseUrl;

	public static void setDriver(WebDriver driver) {
		SeleniumUtils.driver = driver;
		setTimeout(DEFAULT_WAIT_TIME);
	}

	public static void setStopAtShutdown() {
		Runtime.getRuntime().addShutdownHook(new Thread("Selenium Quit Hook") {
			@Override
			public void run() {
				quit();
			}
		});
	}

	public static void open(String url) {
		final String urlToOpen = url.indexOf("://") == -1 ? baseUrl + (!url.startsWith("/") ? "/" : "") + url : url;
		driver.get(urlToOpen);
	}

	public static String getLocation() {
		return driver.getCurrentUrl();
	}

	public static void back() {
		driver.navigate().back();
	}

	public static void refresh() {
		driver.navigate().refresh();
	}

	public static String getTitle() {
		return driver.getTitle();
	}

	public static void quit() {
		try {
			driver.quit();
		} catch (Exception e) {
			System.err.println("Error happen while quit selenium :" + e.getMessage());
		}
	}

	public static void setTimeout(int seconds) {
		driver.manage().timeouts().implicitlyWait(seconds, TimeUnit.SECONDS);
	}

	public static WebDriver getDriver() {
		return driver;
	}

	public static WebElement findElement(By by) {
		return driver.findElement(by);
	}

	public static List<WebElement> findElements(By by) {
		return driver.findElements(by);
	}

	public static boolean isElementPresent(By by) {
		try {
			driver.findElement(by);
			return true;
		} catch (NoSuchElementException e) {
			return false;
		}
	}

	public static boolean isVisible(By by) {
		return driver.findElement(by).isDisplayed();
	}

	public static void type(By by, String text) {
		WebElement element = driver.findElement(by);
		element.clear();
		element.sendKeys(text);
	}

	public static void click(By by) {
		driver.findElement(by).click();
	}

	public static void check(By by) {
		WebElement element = driver.findElement(by);
		check(element);
	}

	public static void check(WebElement element) {
		if (!element.isSelected()) {
			element.click();
		}
	}

	public static void uncheck(By by) {
		WebElement element = driver.findElement(by);
		uncheck(element);
	}

	public static void uncheck(WebElement element) {
		if (element.isSelected()) {
			element.click();
		}
	}

	public static boolean isChecked(By by) {
		WebElement element = driver.findElement(by);
		return isChecked(element);
	}

	public static boolean isChecked(WebElement element) {
		return element.isSelected();
	}

	public static Select getSelect(By by) {
		return new Select(driver.findElement(by));
	}

	public static String getText(By by) {
		return driver.findElement(by).getText();
	}

	public static String getValue(By by) {
		return getValue(driver.findElement(by));
	}

	public static String getValue(WebElement element) {
		return element.getAttribute("value");
	}

	public static void snapshot(String basePath, String outputFileName) {
		File srcFile = ((TakesScreenshot) driver).getScreenshotAs(OutputType.FILE);
		File targetFile = new File(basePath, outputFileName);
		try {
			FileUtils.copyFile(srcFile, targetFile);
		} catch (IOException ioe) {
		}
	}

	public static void waitForTitleIs(String title) {
		waitForCondition(ExpectedConditions.titleIs(title), DEFAULT_WAIT_TIME);
	}

	public static void waitForTitleIs(String title, int timeout) {
		waitForCondition(ExpectedConditions.titleIs(title), timeout);
	}

	public static void waitForTitleContains(String title) {
		waitForCondition(ExpectedConditions.titleContains(title), DEFAULT_WAIT_TIME);
	}

	public static void waitForTitleContains(String title, int timeout) {
		waitForCondition(ExpectedConditions.titleContains(title), timeout);
	}

	public static void waitForVisible(By by) {
		waitForCondition(ExpectedConditions.visibilityOfElementLocated(by), DEFAULT_WAIT_TIME);
	}
	
	@SuppressWarnings("unchecked")
	public static WebElement waitForVisibleFluentWait(WebElement element) {
		Wait<WebDriver> wait = new FluentWait(driver)
	              .withTimeout(DEFAULT_WAIT_TIME, TimeUnit.SECONDS)
	              .pollingEvery(5, TimeUnit.SECONDS)
	              .ignoring(NoSuchElementException.class)
	              .ignoring(ElementNotVisibleException.class);
	   wait.until(ExpectedConditions.visibilityOf(element));
	   return element;
	}
	
	@SuppressWarnings("unchecked")
	public static List<WebElement> waitForElementsVisibleFluentWait(List<WebElement> elements) {
		Wait<WebDriver> wait = new FluentWait(driver)
				.withTimeout(DEFAULT_WAIT_TIME, TimeUnit.SECONDS)
				.pollingEvery(5, TimeUnit.SECONDS)
				.ignoring(NoSuchElementException.class)
				.ignoring(ElementNotVisibleException.class);
		wait.until(ExpectedConditions.visibilityOfAllElements(elements));
		return elements;
	}

	public static void waitForVisible(By by, int timeout) {
		waitForCondition(ExpectedConditions.visibilityOfElementLocated(by), timeout);
	}

	public static void waitForTextPresent(By by, String text) {
		waitForCondition(ExpectedConditions.textToBePresentInElementLocated(by, text), DEFAULT_WAIT_TIME);
	}

	public static void waitForTextPresent(By by, String text, int timeout) {
		waitForCondition(ExpectedConditions.textToBePresentInElementLocated(by, text), timeout);
	}

	public static void waitForValuePresent(By by, String value) {
		waitForCondition(ExpectedConditions.textToBePresentInElementValue(by, value), DEFAULT_WAIT_TIME);
	}
	
	public static WebElement waitForElementVisible(WebElement element, boolean value ) {
		if(value)
			waitForCondition(ExpectedConditions.elementToBeClickable(element),DEFAULT_WAIT_TIME);
		else
			waitForCondition(ExpectedConditions.not(ExpectedConditions.elementToBeClickable(element)), DEFAULT_WAIT_TIME);
		return element;
	}
	
	public static WebElement waitForElementToClickable(WebElement element, boolean isClickable ) {
		if(isClickable)
			waitForCondition(ExpectedConditions.elementToBeClickable(element),DEFAULT_WAIT_TIME);
		else
			waitForCondition(ExpectedConditions.not(ExpectedConditions.elementToBeClickable(element)), DEFAULT_WAIT_TIME);
		return element;
	}

	public static void waitForValuePresent(By by, String value, int timeout) {
		waitForCondition(ExpectedConditions.textToBePresentInElementValue(by, value), timeout);
	}

	public static void waitForCondition(ExpectedCondition conditon, int timeout) {
		(new WebDriverWait(driver, timeout)).until(conditon);
	}

	public static boolean isTextPresent(String text) {
		String bodyText = driver.findElement(By.tagName("body")).getText();
		return bodyText.contains(text);
	}

	public static String getTable(WebElement table, int rowIndex, int columnIndex) {
		return table.findElement(By.xpath("//tr[" + (rowIndex + 1) + "]//td[" + (columnIndex + 1) + "]")).getText();
	}

	public static String getTable(By by, int rowIndex, int columnIndex) {
		return getTable(driver.findElement(by), rowIndex, columnIndex);
	}

}
