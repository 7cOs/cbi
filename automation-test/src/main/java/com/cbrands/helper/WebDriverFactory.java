package com.cbrands.helper;

import java.net.MalformedURLException;
import java.net.URL;

import com.cbrands.helper.driver.factory.LocalDriverFactory;
import com.cbrands.helper.driver.factory.SauceDriverFactory;
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
  private static final String TEST_RUN_TITLE_FORMAT = "%s - %s - %s";
  private static final String TEST_TRIGGER_ORIGIN_NAME = PropertiesCache.getInstance().getProperty("origin");

  private static Log log = LogFactory.getLog(WebDriverFactory.class);
  private static ThreadLocal<WebDriver> webDriver = new ThreadLocal<>();
  private static ThreadLocal<String> sessionId = new ThreadLocal<>();

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

  public static WebDriver createDriver(String testName) throws MalformedURLException {
    final HostType targetHost = HostType.getTargetHost();
    log.info("Targeted Host:" + targetHost.name());
    if (HostType.sauce.equals(targetHost)) {
      final RemoteWebDriver remoteSauceDriver;

      if (BrowserType.chrome.equals(BrowserType.getCurrentBrowser())) {
        remoteSauceDriver = SauceDriverFactory.getRemoteDriverForChrome(formatSauceTestRunName(testName, "CHROME"));
      } else {
        remoteSauceDriver = SauceDriverFactory.getRemoteDriverForIE(formatSauceTestRunName(testName, "IE"));
      }

      Validate.notNull(remoteSauceDriver, "Remote driver could not be found for SauceLabs.");

      final String id = remoteSauceDriver.getSessionId().toString();
      log.info("Connected to Selenium Server. Session ID: " + id);
      sessionId.set(id);

      webDriver.set(remoteSauceDriver);
    } else {
      final ChromeDriver chromeDriver = LocalDriverFactory.getChromeDriver();
      Validate.notNull(
        chromeDriver,
        "Local driver for " + BrowserType.chrome.name() + "could not be found."
      );
      webDriver.set(chromeDriver);
    }

    return webDriver.get();
  }

  private static String formatSauceTestRunName(String testName, String targetBrowser) {
    return String.format(
      TEST_RUN_TITLE_FORMAT,
      targetBrowser,
      TEST_TRIGGER_ORIGIN_NAME,
      testName
    );
  }

  public enum BrowserType {
    ie,
    chrome;

    public static BrowserType getCurrentBrowser() {
      final String browserParam = System.getProperty("browser");
      return null != browserParam ? valueOf(browserParam) : ie;
    }
  }

  public enum HostType {
    local,
    sauce;

    public static HostType getTargetHost() {
      final String property = PropertiesCache.getInstance().getProperty("driver.host");

      return null != property ? valueOf(property) : local;
    }
  }

}
