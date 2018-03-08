package com.cbrands.test.functional.opportunities.filters;

import com.cbrands.PremiseType;
import com.cbrands.TestUser;
import com.cbrands.pages.LoginPage;
import com.cbrands.pages.LogoutPage;
import com.cbrands.pages.opportunities.OpportunitiesPage;
import com.cbrands.test.BaseTestCase;
import com.google.gson.JsonObject;

import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.PageFactory;
import org.testng.Assert;
import org.testng.annotations.*;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Iterator;
import java.util.List;
import java.util.Properties;

public class OpportunitiesResetFiltersTest extends BaseTestCase {

  private OpportunitiesPage oppsPg;

  @BeforeClass
  public void setUpClass() throws Exception  {
	
	 this.startUpBrowser( "Functional - OpportunitiesResetFiltersTest" );
  }

  @AfterClass
  public void tearDownClass() {
    this.shutDownBrowser();
  }

  @AfterMethod
  public void tearDown() {
    PageFactory.initElements(driver, LogoutPage.class).goToPage();
  }

  
  @Test(
	  description = "US23292 - Reset filters before clicking Applying Filters button", 
	  dataProvider = "US23292Data", priority = 1, invocationCount = 1 )
  public void resetBeforeApplyingFilters( TestUser usr, String dist ) {
	  
	  // - Log in to AUT; navigate to Opps page/component - //
	 loginToOpportunitiesPage( usr );

	 // - Enter, search, select distributor - //
	 selectDistributor( oppsPg, dist );

	 // - Confirm selected distributor chip label is displayed above 'Active Filters' form - //
	 Assert.assertTrue( oppsPg.isQueryChipPresent( dist ), 
			  "Selected distributor chip IS NOT present post distributer select" );
	  
	  // - Locate/click 'Reset' link - //
	 oppsPg.clickResetFilters();
	  
	  // - Confirm selected distributor chip label is displayed above 'Active Filters' form - //
	  Assert.assertFalse( oppsPg.isQueryChipPresent( dist ), 
				  "Selected distributor chip IS present post distributer select" );	  
  }


  public static void selectDistributor( OpportunitiesPage oppsPg, String dist ) {
	 oppsPg.enterDistributorSearchText( dist )
     	.clickSearchForDistributor()
     	.clickFirstDistributorResult();
  }
  
  
  public static void selectDistributor( String dist ) {
	  
	  // - Enter, search, and select name in Distributor field- //
	  WebElement f  = q ( "//*[@placeholder='Name']//input[@ng-model='is.input']" );
	  f.sendKeys(  dist );
	  // - Locate search button - //
	  WebElement b = q( "//input[@class='submit-btn visible']" );
	  b.click();
	  // - Select distributor - search results - //
	  List<WebElement> rs = qs( "//*[@class='results-container open']//ul//li" );
	  rs.get(0).click();
	  
  }
  
  
  public static WebElement q ( String xp ) {
	  if( qs ( xp ).size() > 0 ) { 
		  return (WebElement)qs( xp).get( 0 ); 
	  }
	  return null;
  }
  
  
  public static List<WebElement> qs ( String xp ) {
	  return driver.findElements( By.xpath( xp ) );
  }
  
  
  public static JavascriptExecutor jse() {
	  return (JavascriptExecutor) driver;
  }
  
  
  
  @DataProvider
  public static Object[][] US23292Data() {
    return new Object[][]{
      {TestUser.ACTOR4, "Healy Wholesale"}
    };
  }
  
  @DataProvider
  public static Object[][] US23293Data() {
    return new Object[][]{
      {TestUser.ACTOR4, "Chicago Bev Systems - Il"}
    };
  }

  
  private void loginToOpportunitiesPage(TestUser user) {
    PageFactory.initElements(driver, LoginPage.class).loginAs(user);
    oppsPg = PageFactory.initElements(driver, OpportunitiesPage.class);
    oppsPg.goToPage();
  }

}