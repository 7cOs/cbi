package com.cbrands.helper.driver.factory;

import com.cbrands.helper.PropertiesCache;
import org.openqa.selenium.Platform;
import org.openqa.selenium.ie.InternetExplorerDriver;
import org.openqa.selenium.remote.CapabilityType;
import org.openqa.selenium.remote.DesiredCapabilities;
import org.openqa.selenium.remote.RemoteWebDriver;

import java.net.MalformedURLException;
import java.net.URL;

public class SauceDriverFactory {
  private static final String SAUCELABS_URI_FORMAT = "http://%s:%s@ondemand.saucelabs.com:%d/wd/hub";
  private static final int DEFAULT_SAUCE_PORT = 80;

  public static RemoteWebDriver getRemoteDriverForChrome(String formattedTestRunName) throws MalformedURLException {
    return new RemoteWebDriver(buildSauceURI(), getDesiredCapabilitiesForChrome(formattedTestRunName));
  }

  public static RemoteWebDriver getRemoteDriverForIE(String formattedTestRunName) throws MalformedURLException {
    return new RemoteWebDriver(buildSauceURI(), getDesiredCapabilitiesForIE(formattedTestRunName));
  }

  private static DesiredCapabilities getDesiredCapabilitiesForChrome(String formattedTestRunName) {
    final DesiredCapabilities capabilities = DesiredCapabilities.chrome();
    capabilities.setCapability(CapabilityType.PLATFORM, Platform.WIN8_1);
    capabilities.setCapability("name", formattedTestRunName);
    return capabilities;
  }

  private static DesiredCapabilities getDesiredCapabilitiesForIE(String formattedTestRunName) {
    final DesiredCapabilities capabilities = DesiredCapabilities.internetExplorer();
    capabilities.setCapability(CapabilityType.PLATFORM, Platform.WIN8_1);
    capabilities.setCapability(InternetExplorerDriver.INTRODUCE_FLAKINESS_BY_IGNORING_SECURITY_DOMAINS, true);
    capabilities.setCapability(InternetExplorerDriver.REQUIRE_WINDOW_FOCUS, true);
    capabilities.setCapability(InternetExplorerDriver.ENABLE_ELEMENT_CACHE_CLEANUP, true);
    capabilities.setCapability(InternetExplorerDriver.IE_ENSURE_CLEAN_SESSION, true);
    capabilities.setCapability("name", formattedTestRunName);
    return capabilities;
  }

  private static URL buildSauceURI() throws MalformedURLException {
    final String username = PropertiesCache.getInstance().getProperty("sauce.userName");
    final String accessKey = PropertiesCache.getInstance().getProperty("sauce.accessKey");

    return new URL(String.format(SAUCELABS_URI_FORMAT, username, accessKey, DEFAULT_SAUCE_PORT));
  }

}
