package com.cbrands.helper;

import org.apache.commons.io.FileUtils;
import org.openqa.selenium.*;
import org.openqa.selenium.remote.RemoteWebDriver;
import org.openqa.selenium.support.ui.*;
import org.testng.Assert;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.concurrent.TimeUnit;

/**
 * The Class SeleniumUtils.
 *
 * @author Kazi Hossain
 */
public class SeleniumUtils {

	public static final int DEFAULT_WAIT_TIME = 20;
  private static final int DEFAULT_POLL_TIME = 5;

  /** The driver. */
	private static WebDriver driver;

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
	 * Detects if the current browser under test is Internet Explorer
	 * @return true if browser is IE, otherwise false
   */
	public static boolean isBrowserTypeIE() {
		final String browserUnderTest = ((RemoteWebDriver) driver).getCapabilities().getBrowserName();
		return "internet explorer".equals(browserUnderTest);
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
	 * Refresh.
	 */
	public static void refresh() {
		driver.navigate().refresh();
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
	 * Click.
	 *
	 * @param by the by
	 */
	public static void click(By by) {
		driver.findElement(by).click();
	}

	/**
   * Scrolls to the given element and clicks it.
   *
   * Used to circumvent a defect in Selenium's element click() method
   * where it will auto-scroll to the element in IE11 regardless of whether the the element is visible, and will
   * sometimes scroll the element underneath another element, making it unclickable.
   *
   * @param element the desired element
   */
  public static WebElement scrollToAndClick(WebElement element) {
    final JavascriptExecutor jse = (JavascriptExecutor) SeleniumUtils.driver;
    jse.executeScript("arguments[0].scrollIntoView(false);", element);
    jse.executeScript("arguments[0].click()", element);

    return element;
  }

	/**
	 * Snapshot.
	 *
	 * @param basePath the base path
	 * @param outputFileName the output file name
	 */
	public static void snapshot(String basePath, String outputFileName) {
		Assert.assertNotNull(driver, "Driver not available for screenshot.");
		final File srcFile = ((TakesScreenshot) driver).getScreenshotAs(OutputType.FILE);
		final File targetFile = new File(basePath, outputFileName);
		try {
			FileUtils.copyFile(srcFile, targetFile);
		} catch (IOException ioe) {
		}
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
	 * Wait for a single element to be visible fluent wait.
	 *
	 * @param element the element
	 * @return the web element
	 */
	public static WebElement waitForVisibleFluentWait(WebElement element) {
		final Wait<WebDriver> wait = getDefaultFluentWait()
	              .ignoring(NoSuchElementException.class)
	              .ignoring(ElementNotVisibleException.class);
	   wait.until(ExpectedConditions.visibilityOf(element));
	   return element;
	}

	/**
	 * Wait for a single element to be visible fluent wait.
	 *
	 * @param by the element locator
	 * @return the web element
	 */
	public static WebElement waitForVisibleFluentWait(By by) {
		final Wait<WebDriver> wait = getDefaultFluentWait()
	              .ignoring(NoSuchElementException.class)
	              .ignoring(ElementNotVisibleException.class);
	   wait.until(ExpectedConditions.visibilityOfElementLocated(by));
	   return findElement(by);
	}

	/**
	 * Wait for multiple elements visible fluent wait.
	 *
	 * @param elements the elements
	 * @return the list
	 */
	public static List<WebElement> waitForElementsVisibleFluentWait(List<WebElement> elements) {
		final Wait<WebDriver> wait = getDefaultFluentWait()
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
	 * Waits for element to disappear from the DOM. If element is not present, swallows the exception.
	 *
	 * @param by the element handle
	 */
	public static void waitForElementToDisappear(By by) {
		final Wait<WebDriver> wait = getDefaultFluentWait();
		waitForElementToDisappear(by, wait);
	}

	/**
	 * Waits for element to disappear from the DOM using the given custom timeout in seconds.
	 * If element is not present, swallows the exception.
	 *
	 * Use as last resort. Prefer default {@link #waitForElementToDisappear(By)} and fixing long wait times in the app
	 * over using custom timeouts.
	 *
	 * @param by the element handle
	 * @param timeout the timeout in seconds
	 */
	public static void waitForElementToDisappear(By by, int timeout) {
		final Wait<WebDriver> wait = getCustomFluentWait(timeout, DEFAULT_POLL_TIME);
		waitForElementToDisappear(by, wait);
	}

	private static void waitForElementToDisappear(By by, Wait<WebDriver> wait) {
		try {
			final WebElement element = findElement(by);

			wait.until(ExpectedConditions.not(ExpectedConditions.elementToBeClickable(element)));
			wait.until(ExpectedConditions.stalenessOf(element));
		} catch (NoSuchElementException | StaleElementReferenceException e) {
			// Success. Element not present.
		}
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
	 * Wait for text present.
	 *
	 * @param by the by
	 * @param text the text
	 */
	public static void waitForTextPresent(By by, String text) {
		waitForCondition(ExpectedConditions.textToBePresentInElementLocated(by, text), DEFAULT_WAIT_TIME);
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
   * Enter text into a given textbox while ensuring it has focus
   * @param expectedText text to enter
   * @param textBoxElement textbox element to receive text
   */
  public static void enterText(String expectedText, WebElement textBoxElement) {
    waitForElementToClickable(textBoxElement, true).click();
    driver.switchTo().activeElement().sendKeys(expectedText);
  }

	/**
	 * Ensure text value is entered into text field without losing focus before the text is completely entered,
	 * by entering a single character at a time
	 *
	 * @param field WebElement field
	 * @param value String to pass to text field
	 * @author SKARNEH
	 */
	public static void enterKeys(WebElement field, String value) {
		field.clear();
		for (String c : value.split("")) {
			field.sendKeys(c);
		}
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
	 * Waits for the given element to be checked.
	 *
	 * @param checkbox element on which to wait to be checked
	 * @return checkbox element
   */
	public static WebElement waitForElementToBeChecked(WebElement checkbox) {
		final FluentWait<WebDriver> wait;

		if (isBrowserTypeIE()) {
			wait = getIECheckboxWait();
		} else {
			wait = getDefaultFluentWait();
		}

		wait.until(ExpectedConditions.attributeContains(checkbox, "aria-checked", "true"));

		return checkbox;
	}

	/**
	 * Workaround for IE-specific bug where faulty implementation of checkbox causes excessive lag time.
	 * Remove this workaround when fixed.
	 * See Rally ticket DE7112.
	 * @return customized fluent wait
   */
	private static FluentWait<WebDriver> getIECheckboxWait() {
		return getCustomFluentWait(DEFAULT_WAIT_TIME * 4, DEFAULT_POLL_TIME);
	}

	/**
	 * @deprecated Please keep wait logic contained within Selenium Utils, and use Fluent Wait instead of WebDriverWait.
	 *
	 * Wait for condition.
	 *
	 * @param conditon the conditon
	 * @param timeout the timeout
	 */
	@Deprecated
	public static void waitForCondition(ExpectedCondition conditon, int timeout) {
		(new WebDriverWait(driver, timeout)).until(conditon);
	}

	private static FluentWait<WebDriver> getDefaultFluentWait() {
		return getCustomFluentWait(DEFAULT_WAIT_TIME, DEFAULT_POLL_TIME);
	}

	private static FluentWait<WebDriver> getCustomFluentWait(int waitTime, int pollTime) {
		return new FluentWait<>(driver)
			.withTimeout(waitTime, TimeUnit.SECONDS)
			.pollingEvery(pollTime, TimeUnit.SECONDS);
	}

	/**
	 * Maximize.
	 */
	public static void maximize() {
		driver.manage().window().maximize();
	}
}
