package com.cbrands.listener;
import java.lang.reflect.Method;
import java.net.MalformedURLException;
import java.rmi.UnexpectedException;

import org.openqa.selenium.InvalidElementStateException;
import org.openqa.selenium.WebDriver;
import org.testng.Assert;
import org.testng.annotations.Test;
public class SampleSauceTest extends SampleSauceTestBase {

    @Test(dataProvider = "hardCodedBrowsers")
    public void verifySiteTest(String browser, String version, String os, Method method)
            throws MalformedURLException, InvalidElementStateException, UnexpectedException {
        this.createDriver(browser, version, os, method.getName());
        WebDriver driver = this.getWebDriver();

        driver.get("http://orion-qa.cbrands.com/");
		System.out.println("Page Title is " + driver.getTitle());
		Assert.assertEquals("Constellation Brands", driver.getTitle());
		driver.quit();
    }
}
