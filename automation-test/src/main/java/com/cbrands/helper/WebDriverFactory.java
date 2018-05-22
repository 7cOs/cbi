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

  public static WebDriver createDriver(String testName) throws MalformedURLException {
    final WebDriver driver;

    final String driverHost = PropertiesCache.getInstance().getProperty("driver.host");
    if (HostType.sauce.name().equalsIgnoreCase(driverHost)) {
      log.info("Targeted Host:" + HostType.sauce.name());

      final RemoteWebDriver remoteSauceDriver = SauceDriverFactory.getRemoteDriver(testName);
      Validate.notNull(remoteSauceDriver, "Remote driver could not be found for SauceLabs");

      final String id = remoteSauceDriver.getSessionId().toString();
      log.info("Connected to Selenium Server. Session ID: " + id);
      sessionId.set(id);

      driver = remoteSauceDriver;
    } else {
      final ChromeDriver chromeDriver = LocalDriverFactory.getChromeDriver();

      Validate.notNull(
        chromeDriver,
        "Driver for " + BrowserType.chrome.name() + "could not be found at:" + HostType.local.name() +
          "/n Have you downloaded the correct driver into your local target directory?"
      );

      driver = chromeDriver;
    }
    webDriver.set(driver);

    return driver;
  }

  private static class LocalDriverFactory {
    private static final String WINDOWS_FILE_EXTENSION_FORMAT = "%s.exe";

    private static ChromeDriver getChromeDriver() {
      System.setProperty("webdriver.chrome.driver", formatDriverNameWithOSExtension("chromedriver"));

      final ChromeOptions options = new ChromeOptions();
      options.addArguments("--start-maximized");
      options.addArguments("--disable-infobars");

      final boolean isSilentMode = Boolean.parseBoolean(
        PropertiesCache.getInstance().getProperty("driver.isSilentMode"));
      if (isSilentMode) {
        options.addArguments("headless");
      }

      return new ChromeDriver(options);
    }

    private static String formatDriverNameWithOSExtension(String driverFileName) {
      final String chromedriverFile;

      final String osName = System.getProperty("os.name").toLowerCase();
      if (!osName.startsWith("windows")) {
        chromedriverFile = driverFileName;
      } else {
        chromedriverFile = String.format(WINDOWS_FILE_EXTENSION_FORMAT, driverFileName);
      }

      return chromedriverFile;
    }
  }

  private static class SauceDriverFactory {
    private static final String SAUCELABS_URI_FORMAT = "http://%s:%s@ondemand.saucelabs.com:%d/wd/hub";
    private static final int DEFAULT_SAUCE_PORT = 80;
    private static final String TEST_RUN_TITLE_FORMAT = "%s - %s - %s";

    private static RemoteWebDriver getRemoteDriver(String testName) throws MalformedURLException {
      final URL remoteAddress = buildSauceURI();

      final BrowserType currentBrowserType = BrowserType.getCurrentBrowser();
      final DesiredCapabilities capabilities = getDesiredCapabilities(
        currentBrowserType,
        formatTestRunName(testName, currentBrowserType)
      );

      return new RemoteWebDriver(remoteAddress, capabilities);
    }

    private static URL buildSauceURI() throws MalformedURLException {
      final String username = PropertiesCache.getInstance().getProperty("sauce.userName");
      final String accessKey = PropertiesCache.getInstance().getProperty("sauce.accessKey");

      return new URL(String.format(SAUCELABS_URI_FORMAT, username, accessKey, DEFAULT_SAUCE_PORT));
    }

    private static String formatTestRunName(String testName, BrowserType currentBrowserType) {
      return String.format(
        TEST_RUN_TITLE_FORMAT,
        currentBrowserType.name().toUpperCase(),
        PropertiesCache.getInstance().getProperty("origin"),
        testName
      );
    }

    private static DesiredCapabilities getDesiredCapabilities(BrowserType currentBrowserType, String testRunName) {
      final DesiredCapabilities capabilities;

      if (BrowserType.chrome.equals(currentBrowserType)) {
        capabilities = getCapabilitiesForChrome();
      } else {
        capabilities = getCapabilitiesForIE();
      }
      capabilities.setCapability("name", testRunName);

      return capabilities;
    }

    private static DesiredCapabilities getCapabilitiesForIE() {
      final DesiredCapabilities capabilities = DesiredCapabilities.internetExplorer();

      capabilities.setCapability(CapabilityType.PLATFORM, Platform.WIN8_1);
      capabilities.setCapability(InternetExplorerDriver.INTRODUCE_FLAKINESS_BY_IGNORING_SECURITY_DOMAINS, true);
      capabilities.setCapability(InternetExplorerDriver.REQUIRE_WINDOW_FOCUS, true);
      capabilities.setCapability(InternetExplorerDriver.ENABLE_ELEMENT_CACHE_CLEANUP, true);
      capabilities.setCapability(InternetExplorerDriver.IE_ENSURE_CLEAN_SESSION, true);

      return capabilities;
    }

    private static DesiredCapabilities getCapabilitiesForChrome() {
      final DesiredCapabilities capabilities = DesiredCapabilities.chrome();

      capabilities.setCapability(CapabilityType.PLATFORM, Platform.WIN8_1);

      return capabilities;
    }

  }

  public enum BrowserType {
    ie,
    chrome;

    public static BrowserType getCurrentBrowser(){
      final String browserParam = System.getProperty("browser");
      return null != browserParam ? valueOf(browserParam) : ie;
    }
  }

  public enum HostType {
    local,
    sauce
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
