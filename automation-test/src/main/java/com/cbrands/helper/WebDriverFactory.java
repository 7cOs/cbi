package com.cbrands.helper;

import java.net.MalformedURLException;
import java.net.URL;

import org.apache.commons.lang3.Validate;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.openqa.selenium.Platform;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.ie.InternetExplorerDriver;
import org.openqa.selenium.remote.CapabilityType;
import org.openqa.selenium.remote.DesiredCapabilities;
import org.openqa.selenium.remote.RemoteWebDriver;
import org.testng.annotations.Listeners;

import com.saucelabs.common.SauceOnDemandAuthentication;
import com.saucelabs.common.SauceOnDemandSessionIdProvider;
import com.saucelabs.testng.SauceOnDemandAuthenticationProvider;
import com.saucelabs.testng.SauceOnDemandTestListener;

/**
 * A factory for creating WebDriver objects.
 *
 * @author Kazi Hossain, Edie Liao
 */
@Listeners({SauceOnDemandTestListener.class})
public class WebDriverFactory implements SauceOnDemandSessionIdProvider, SauceOnDemandAuthenticationProvider {

  private static Log log = LogFactory.getLog(WebDriverFactory.class);
  private static ThreadLocal<WebDriver> webDriver = new ThreadLocal<>();
  private static ThreadLocal<String> sessionId = new ThreadLocal<>();

	/**
   * @deprecated Please use {@link #createDriver(String) createDriver(String)} and supply a test case name instead
   */
  @Deprecated
  public static WebDriver createDriver() throws MalformedURLException {
    return createDriver("Automated Test");
  }

  public static WebDriver createDriver(String testName) throws MalformedURLException {
    final WebDriver driver;

    final String driverHost = PropertiesCache.getInstance().getProperty("driver.host");
    if (HostType.remote.name().equalsIgnoreCase(driverHost)) {
      driver = getRemoteWebDriver();
    } else if (HostType.sauce.name().equalsIgnoreCase(driverHost)) {
      driver = getSauceWebDriver(testName);
    } else {
      driver = getLocalWebDriver();
    }

    return driver;
  }

  private static WebDriver getLocalWebDriver() {
    final String osName = System.getProperty("os.name").toLowerCase();
    final boolean isSilentMode = Boolean.parseBoolean(
        PropertiesCache.getInstance().getProperty("driver.isSilentMode"));
    final ChromeOptions options = new ChromeOptions();
    options.addArguments("--start-maximized");
    options.addArguments("--disable-infobars");
    if(isSilentMode) { options.addArguments("headless"); }

    if(!osName.startsWith("windows")) {
      System.setProperty("webdriver.chrome.driver", "chromedriver");
      webDriver.set(new ChromeDriver(options));
    } else {
      System.setProperty("webdriver.chrome.driver", "chromedriver.exe");
      webDriver.set(new ChromeDriver(options));      
    }

    Validate.notNull(
      webDriver.get(),
      "Driver for " + BrowserType.chrome.name() + "could not be found at:" + HostType.local.name() +
        "/n Have you downloaded the correct driver into your local target directory?"
    );

    return webDriver.get();
  }

  private static WebDriver getSauceWebDriver(String testName) throws MalformedURLException {
    final URL remoteAddress = new URL("https://" + authentication.getUsername() + ":" + authentication.getAccessKey() + SauceHelpers.buildSauceUri() + "/wd/hub");
    final DesiredCapabilities capabilities = getSauceCapabilitiesByBrowser(testName, System.getProperty("browser"));

    webDriver.set(new RemoteWebDriver(remoteAddress, capabilities));

    String id = ((RemoteWebDriver) getWebDriver()).getSessionId().toString();
    sessionId.set(id);
    log.info("Targeted Host:" + HostType.sauce.name());
    log.info("Connected to Selenium Server. Session ID: " + sessionId.get());
    Validate.notNull(webDriver.get(), "Driver could not be found at:" + HostType.sauce.name());

    return webDriver.get();
  }

  private static DesiredCapabilities getSauceCapabilitiesByBrowser(String testName, String driverType) {
    DesiredCapabilities capabilities;

    if (BrowserType.chrome.name().equals(driverType)) {
      capabilities = getSauceCapabilitiesForChrome(testName);
    } else {
      capabilities = getSauceCapabilitiesForIE(testName);
    }

    return capabilities;
  }

  private static DesiredCapabilities getSauceCapabilitiesForIE(String testName) {
    final DesiredCapabilities capabilities = DesiredCapabilities.internetExplorer();

    capabilities.setCapability(CapabilityType.PLATFORM, Platform.WIN8_1);
    capabilities.setCapability(InternetExplorerDriver.INTRODUCE_FLAKINESS_BY_IGNORING_SECURITY_DOMAINS, true);
    capabilities.setCapability(InternetExplorerDriver.REQUIRE_WINDOW_FOCUS, true);
    capabilities.setCapability(InternetExplorerDriver.ENABLE_ELEMENT_CACHE_CLEANUP, true);
    capabilities.setCapability(InternetExplorerDriver.IE_ENSURE_CLEAN_SESSION, true);

    capabilities.setCapability("name", getTestRunName(testName, BrowserType.ie.name()));

    return capabilities;
  }

  private static DesiredCapabilities getSauceCapabilitiesForChrome(String testName) {
    final DesiredCapabilities capabilities = DesiredCapabilities.chrome();

    capabilities.setCapability(CapabilityType.PLATFORM, Platform.WIN8_1);
    capabilities.setCapability("name", getTestRunName(testName, BrowserType.chrome.name()));

    return capabilities;
  }

  private static String getTestRunName(String testCaseName, String browserName) {
    return browserName.toUpperCase() + " - "
      + PropertiesCache.getInstance().getProperty("origin")  + " - "
      + testCaseName;
  }

  private static WebDriver getRemoteWebDriver() {
    final String seleniumHostAddress = PropertiesCache.getInstance().getProperty("selenium.host.address");
    String[] params = seleniumHostAddress.split(":");
    Validate.isTrue(
      params.length == 4,
      "Remote driver is not right, accept format is \"remote:localhost:4444:firefox\", but the input is\""
        + seleniumHostAddress + "\""
    );

    String remoteHost = params[1];
    String remotePort = params[2];
    String driverType = params[3];

    String remoteUrl = "http://" + remoteHost + ":" + remotePort + "/wd/hub";

    DesiredCapabilities cap = null;
    if (BrowserType.firefox.name().equals(driverType)) {
      cap = DesiredCapabilities.firefox();
    } else if (BrowserType.ie.name().equals(driverType)) {
      cap = DesiredCapabilities.internetExplorer();
      cap.setCapability(InternetExplorerDriver.INTRODUCE_FLAKINESS_BY_IGNORING_SECURITY_DOMAINS, true);
      cap.setCapability(InternetExplorerDriver.ENABLE_ELEMENT_CACHE_CLEANUP, true);
      cap.setCapability(InternetExplorerDriver.IE_ENSURE_CLEAN_SESSION, true);
      cap.setBrowserName("internet explorer");
    } else if (BrowserType.chrome.name().equals(driverType)) {
      cap = DesiredCapabilities.chrome();
    }

    try {
      webDriver.set(new RemoteWebDriver(new URL(remoteUrl), cap));
      String id = ((RemoteWebDriver) getWebDriver()).getSessionId().toString();
      sessionId.set(id);
      log.info("Targeted Host:" + HostType.remote.name());
    } catch (MalformedURLException e) {
      throw new RuntimeException(e);
    }

    log.info("Connected to Selenium Server. Session ID: " + sessionId.get());
    Validate.notNull(webDriver.get(), "Driver could not be found at:" + seleniumHostAddress);
    return webDriver.get();
  }

  public enum BrowserType {
    firefox,
    ie,
    chrome
  }

  public enum HostType {
    local,
    remote,
    sauce
  }

  public static WebDriver getWebDriver() {
    return webDriver.get();
  }

  public static SauceOnDemandAuthentication authentication = new SauceOnDemandAuthentication(PropertiesCache
    .getInstance()
    .getProperty("sauce.userName"), PropertiesCache.getInstance().getProperty("sauce.accessKey"));

  @Override
  public SauceOnDemandAuthentication getAuthentication() {
    return authentication;
  }

  @Override
  public String getSessionId() {
    return sessionId.get();
  }
}
