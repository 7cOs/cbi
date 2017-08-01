package com.cbrands.helper;

import java.net.MalformedURLException;
import java.net.URL;

import org.apache.commons.lang3.Validate;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.openqa.selenium.Platform;
import org.openqa.selenium.WebDriver;
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
  private static ThreadLocal<WebDriver> webDriver = new ThreadLocal<WebDriver>();
  private static ThreadLocal<String> sessionId = new ThreadLocal<String>();

  public static WebDriver createDriver(String driverName) throws MalformedURLException {

    if (driverName.startsWith(BrowserType.remote.name())) {
      setRemoteWebDriver(driverName);
    } else {
      setSauceWebDriver();
    }
    log.info("Connected to Selenium Server. Session ID: " + sessionId.get());
    Validate.notNull(webDriver.get(), "Driver could be found by name:" + driverName);
    return webDriver.get();
  }

  private static void setSauceWebDriver() throws MalformedURLException {
    final DesiredCapabilities capabilities = getSauceCapabilitiesByBrowser(System.getProperty("browser"));
    SauceHelpers.addSauceConnectTunnelId(capabilities);

    // Launch remote browser and set it as the current thread
    webDriver.set(new RemoteWebDriver(
      new URL("https://" + authentication.getUsername() + ":" + authentication.getAccessKey() +
        SauceHelpers.buildSauceUri() + "/wd/hub"), capabilities));

    //((RemoteWebDriver) getWebDriver()).manage().window().setSize(new Dimension(1024, 768));
    // set current sessionId
    String id = ((RemoteWebDriver) getWebDriver()).getSessionId().toString();
    sessionId.set(id);
    log.info("Targeted Host:" + BrowserType.sauce.name());
  }

  private static DesiredCapabilities getSauceCapabilitiesByBrowser(String driverType) {
    DesiredCapabilities capabilities;

    if (BrowserType.chrome.name().equals(driverType)) {
      capabilities = getSauceCapabilitiesForChrome(getTestRunName(BrowserType.chrome.name()));
    } else {
      capabilities = getSauceCapabilitiesForIE(getTestRunName(BrowserType.ie.name()));
    }

    return capabilities;
  }

  private static String getTestRunName(String browserName) {
    return "Automated Functional Test - " + browserName.toUpperCase() + " - " + PropertiesCache.getInstance().getProperty
      ("origin");
  }

  private static DesiredCapabilities getSauceCapabilitiesForChrome(String testRunName) {
    final DesiredCapabilities capabilities = DesiredCapabilities.chrome();

    capabilities.setCapability(CapabilityType.PLATFORM, Platform.WIN8_1);
    capabilities.setCapability("name", testRunName);

    return capabilities;
  }

  private static DesiredCapabilities getSauceCapabilitiesForIE(String testRunName) {
    final DesiredCapabilities capabilities = DesiredCapabilities.internetExplorer();

    capabilities.setCapability(CapabilityType.PLATFORM, Platform.WIN8_1);
    capabilities.setCapability(InternetExplorerDriver.INTRODUCE_FLAKINESS_BY_IGNORING_SECURITY_DOMAINS, true);
    capabilities.setCapability(InternetExplorerDriver.REQUIRE_WINDOW_FOCUS, true);
    capabilities.setCapability(InternetExplorerDriver.ENABLE_ELEMENT_CACHE_CLEANUP, true);
    capabilities.setCapability(InternetExplorerDriver.IE_ENSURE_CLEAN_SESSION, true);

    capabilities.setCapability("name", testRunName);

    return capabilities;
  }

  private static void setRemoteWebDriver(String driverName) {
    String[] params = driverName.split(":");
    Validate.isTrue(
      params.length == 4,
      "Remote driver is not right, accept format is \"remote:localhost:4444:firefox\", but the input is\""
        + driverName + "\""
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
      log.info("Targeted Host:" + BrowserType.remote.name());
    } catch (MalformedURLException e) {
      throw new RuntimeException(e);
    }
  }

  public enum BrowserType {

    firefox,
    ie,
    chrome,
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
