package com.cbrands.helper.driver.factory;

import com.cbrands.helper.PropertiesCache;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.ie.InternetExplorerDriver;
import org.openqa.selenium.ie.InternetExplorerOptions;
import org.openqa.selenium.remote.DesiredCapabilities;

public class LocalDriverFactory {
  private static final String WINDOWS_FILE_EXTENSION_FORMAT = "%s.exe";

  public static ChromeDriver getChromeDriver() {
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

  public static InternetExplorerDriver getInternetExplorerDriver() {
    // System.setProperty("webdriver.ie.driver", "ieDriverServer.exe");
	System.setProperty("webdriver.ie.driver", "ie.exe");
    InternetExplorerOptions options = new InternetExplorerOptions();
    options.ignoreZoomSettings();
    options.introduceFlakinessByIgnoringSecurityDomains();
    options.destructivelyEnsureCleanSession();

    return new InternetExplorerDriver(options);
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
