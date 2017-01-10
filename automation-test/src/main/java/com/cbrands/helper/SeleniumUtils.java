package com.cbrands.helper;

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
 * The Class SeleniumUtils.
 *
 * @author Kazi Hossain
 */
public class SeleniumUtils {

	/** The Constant DEFAULT_WAIT_TIME. */
	public static final int DEFAULT_WAIT_TIME = 20;
	
	/** The driver. */
	private static WebDriver driver;
	
	/** The base url. */
	private static String baseUrl;

	/**
	 * Sets the driver.
	 *
	 * @param driver the new driver
	 */
	public static void setDriver(WebDriver driver) {
		SeleniumUtils.driver = driver;
		setTimeout(DEFAULT_WAIT_TIME);
	}

	/**
	 * Sets the stop at shutdown.
	 */
	public static void setStopAtShutdown() {
		Runtime.getRuntime().addShutdownHook(new Thread("Selenium Quit Hook") {
			@Override
			public void run() {
				quit();
			}
		});
	}

	/**
	 * Open.
	 *
	 * @param url the url
	 */
	public static void open(String url) {
		final String urlToOpen = url.indexOf("://") == -1 ? baseUrl + (!url.startsWith("/") ? "/" : "") + url : url;
		driver.get(urlToOpen);
	}

	/**
	 * Gets the location.
	 *
	 * @return the location
	 */
	public static String getLocation() {
		return driver.getCurrentUrl();
	}

	/**
	 * Back.
	 */
	public static void back() {
		driver.navigate().back();
	}

	/**
	 * Refresh.
	 */
	public static void refresh() {
		driver.navigate().refresh();
	}

	/**
	 * Gets the title.
	 *
	 * @return the title
	 */
	public static String getTitle() {
		return driver.getTitle();
	}

	/**
	 * Quit.
	 */
	public static void quit() {
		try {
			driver.quit();
		} catch (Exception e) {
			System.err.println("Error happen while quit selenium :" + e.getMessage());
		}
	}

	/**
	 * Sets the timeout.
	 *
	 * @param seconds the new timeout
	 */
	public static void setTimeout(int seconds) {
		driver.manage().timeouts().implicitlyWait(seconds, TimeUnit.SECONDS);
	}

	/**
	 * Gets the driver.
	 *
	 * @return the driver
	 */
	public static WebDriver getDriver() {
		return driver;
	}

	/**
	 * Find element.
	 *
	 * @param by the by
	 * @return the web element
	 */
	public static WebElement findElement(By by) {
		return driver.findElement(by);
	}

	/**
	 * Find elements.
	 *
	 * @param by the by
	 * @return the list
	 */
	public static List<WebElement> findElements(By by) {
		return driver.findElements(by);
	}

	/**
	 * Checks if is element present.
	 *
	 * @param by the by
	 * @return true, if is element present
	 */
	public static boolean isElementPresent(By by) {
		try {
			driver.findElement(by);
			return true;
		} catch (NoSuchElementException e) {
			return false;
		}
	}

	/**
	 * Checks if is visible.
	 *
	 * @param by the by
	 * @return true, if is visible
	 */
	public static boolean isVisible(By by) {
		return driver.findElement(by).isDisplayed();
	}

	/**
	 * Type.
	 *
	 * @param by the by
	 * @param text the text
	 */
	public static void type(By by, String text) {
		WebElement element = driver.findElement(by);
		element.clear();
		element.sendKeys(text);
	}

	/**
	 * Click.
	 *
	 * @param by the by
	 */
	public static void click(By by) {
		driver.findElement(by).click();
	}

	/**
	 * Check.
	 *
	 * @param by the by
	 */
	public static void check(By by) {
		WebElement element = driver.findElement(by);
		check(element);
	}

	/**
	 * Check.
	 *
	 * @param element the element
	 */
	public static void check(WebElement element) {
		if (!element.isSelected()) {
			element.click();
		}
	}

	/**
	 * Uncheck.
	 *
	 * @param by the by
	 */
	public static void uncheck(By by) {
		WebElement element = driver.findElement(by);
		uncheck(element);
	}

	/**
	 * Uncheck.
	 *
	 * @param element the element
	 */
	public static void uncheck(WebElement element) {
		if (element.isSelected()) {
			element.click();
		}
	}

	/**
	 * Checks if is checked.
	 *
	 * @param by the by
	 * @return true, if is checked
	 */
	public static boolean isChecked(By by) {
		WebElement element = driver.findElement(by);
		return isChecked(element);
	}

	/**
	 * Checks if is checked.
	 *
	 * @param element the element
	 * @return true, if is checked
	 */
	public static boolean isChecked(WebElement element) {
		return element.isSelected();
	}

	/**
	 * Gets the select.
	 *
	 * @param by the by
	 * @return the select
	 */
	public static Select getSelect(By by) {
		return new Select(driver.findElement(by));
	}

	/**
	 * Gets the text.
	 *
	 * @param by the by
	 * @return the text
	 */
	public static String getText(By by) {
		return driver.findElement(by).getText();
	}

	/**
	 * Gets the value.
	 *
	 * @param by the by
	 * @return the value
	 */
	public static String getValue(By by) {
		return getValue(driver.findElement(by));
	}

	/**
	 * Gets the value.
	 *
	 * @param element the element
	 * @return the value
	 */
	public static String getValue(WebElement element) {
		return element.getAttribute("value");
	}

	/**
	 * Snapshot.
	 *
	 * @param basePath the base path
	 * @param outputFileName the output file name
	 */
	public static void snapshot(String basePath, String outputFileName) {
		File srcFile = ((TakesScreenshot) driver).getScreenshotAs(OutputType.FILE);
		File targetFile = new File(basePath, outputFileName);
		try {
			FileUtils.copyFile(srcFile, targetFile);
		} catch (IOException ioe) {
		}
	}

	/**
	 * Wait for title is.
	 *
	 * @param title the title
	 */
	public static void waitForTitleIs(String title) {
		waitForCondition(ExpectedConditions.titleIs(title), DEFAULT_WAIT_TIME);
	}

	/**
	 * Wait for title is.
	 *
	 * @param title the title
	 * @param timeout the timeout
	 */
	public static void waitForTitleIs(String title, int timeout) {
		waitForCondition(ExpectedConditions.titleIs(title), timeout);
	}

	/**
	 * Wait for title contains.
	 *
	 * @param title the title
	 */
	public static void waitForTitleContains(String title) {
		waitForCondition(ExpectedConditions.titleContains(title), DEFAULT_WAIT_TIME);
	}

	/**
	 * Wait for title contains.
	 *
	 * @param title the title
	 * @param timeout the timeout
	 */
	public static void waitForTitleContains(String title, int timeout) {
		waitForCondition(ExpectedConditions.titleContains(title), timeout);
	}

	/**
	 * Wait for visible.
	 *
	 * @param by the by
	 */
	public static void waitForVisible(By by) {
		waitForCondition(ExpectedConditions.visibilityOfElementLocated(by), DEFAULT_WAIT_TIME);
	}
	
	/**
	 * Wait for visible fluent wait.
	 *
	 * @param element the element
	 * @return the web element
	 */
	@SuppressWarnings("unchecked")
	public static WebElement waitForVisibleFluentWait(WebElement element) {
		Wait<WebDriver> wait = new FluentWait(driver)
	              .withTimeout(DEFAULT_WAIT_TIME, TimeUnit.SECONDS)
	              .pollingEvery(5, TimeUnit.MILLISECONDS)
	              .ignoring(NoSuchElementException.class)
	              .ignoring(ElementNotVisibleException.class);
	   wait.until(ExpectedConditions.visibilityOf(element));
	   return element;
	}
	
	/**
	 * Wait for elements visible fluent wait.
	 *
	 * @param elements the elements
	 * @return the list
	 */
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

	/**
	 * Wait for visible.
	 *
	 * @param by the by
	 * @param timeout the timeout
	 */
	public static void waitForVisible(By by, int timeout) {
		waitForCondition(ExpectedConditions.visibilityOfElementLocated(by), timeout);
	}

	/**
	 * Wait for text present.
	 *
	 * @param by the by
	 * @param text the text
	 */
	public static void waitForTextPresent(By by, String text) {
		waitForCondition(ExpectedConditions.textToBePresentInElementLocated(by, text), DEFAULT_WAIT_TIME);
	}

	/**
	 * Wait for text present.
	 *
	 * @param by the by
	 * @param text the text
	 * @param timeout the timeout
	 */
	public static void waitForTextPresent(By by, String text, int timeout) {
		waitForCondition(ExpectedConditions.textToBePresentInElementLocated(by, text), timeout);
	}

	/**
	 * Wait for value present.
	 *
	 * @param by the by
	 * @param value the value
	 */
	public static void waitForValuePresent(By by, String value) {
		waitForCondition(ExpectedConditions.textToBePresentInElementValue(by, value), DEFAULT_WAIT_TIME);
	}
	
	/**
	 * Wait for element visible.
	 *
	 * @param element the element
	 * @param value the value
	 * @return the web element
	 */
	public static WebElement waitForElementVisible(WebElement element, boolean value ) {
		if(value)
			waitForCondition(ExpectedConditions.elementToBeClickable(element),DEFAULT_WAIT_TIME);
		else
			waitForCondition(ExpectedConditions.not(ExpectedConditions.elementToBeClickable(element)), DEFAULT_WAIT_TIME);
		return element;
	}
	
	/**
	 * Wait for element to clickable.
	 *
	 * @param element the element
	 * @param isClickable the is clickable
	 * @return the web element
	 */
	public static WebElement waitForElementToClickable(WebElement element, boolean isClickable ) {
		if(isClickable)
			waitForCondition(ExpectedConditions.elementToBeClickable(element),DEFAULT_WAIT_TIME);
		else
			waitForCondition(ExpectedConditions.not(ExpectedConditions.elementToBeClickable(element)), DEFAULT_WAIT_TIME);
		return element;
	}

	/**
	 * Wait for value present.
	 *
	 * @param by the by
	 * @param value the value
	 * @param timeout the timeout
	 */
	public static void waitForValuePresent(By by, String value, int timeout) {
		waitForCondition(ExpectedConditions.textToBePresentInElementValue(by, value), timeout);
	}

	/**
	 * Wait for condition.
	 *
	 * @param conditon the conditon
	 * @param timeout the timeout
	 */
	public static void waitForCondition(ExpectedCondition conditon, int timeout) {
		(new WebDriverWait(driver, timeout)).until(conditon);
	}

	/**
	 * Checks if is text present.
	 *
	 * @param text the text
	 * @return true, if is text present
	 */
	public static boolean isTextPresent(String text) {
		String bodyText = driver.findElement(By.tagName("body")).getText();
		return bodyText.contains(text);
	}

	/**
	 * Gets the table.
	 *
	 * @param table the table
	 * @param rowIndex the row index
	 * @param columnIndex the column index
	 * @return the table
	 */
	public static String getTable(WebElement table, int rowIndex, int columnIndex) {
		return table.findElement(By.xpath("//tr[" + (rowIndex + 1) + "]//td[" + (columnIndex + 1) + "]")).getText();
	}

	/**
	 * Gets the table.
	 *
	 * @param by the by
	 * @param rowIndex the row index
	 * @param columnIndex the column index
	 * @return the table
	 */
	public static String getTable(By by, int rowIndex, int columnIndex) {
		return getTable(driver.findElement(by), rowIndex, columnIndex);
	}
	
	/**
	 * Maximize.
	 */
	public static void maximize() {
		driver.manage().window().maximize();
	}

}