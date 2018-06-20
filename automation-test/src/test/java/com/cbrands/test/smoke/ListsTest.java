package com.cbrands.test.smoke;

import com.cbrands.TestUser;
import com.cbrands.helper.PropertiesCache;
import com.cbrands.pages.LoginPage;
import com.cbrands.pages.LogoutPage;
import com.cbrands.pages.lists.ListsPage;
import com.cbrands.test.BaseTestCase;

import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.Assert;
import org.testng.annotations.*;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.lang.reflect.Method;
import java.net.MalformedURLException;
import java.util.Properties;

public class ListsTest extends BaseTestCase {
  static String current_time_stamp = new java.text.SimpleDateFormat("MM.dd.yyyy HH:mm:ss").format(new java.util.Date());

  private ListsPage listsPage;

  // - SDK - //
  public static JavascriptExecutor jse;
  public static final int WAIT = 35;

  @BeforeMethod
  public void setUp(Method method) throws FileNotFoundException, IOException {
    this.startUpBrowser(String.format("Smoke - Lists Test - %s", method.getAnnotation(Test.class).description()));

    // PageFactory.initElements(driver, LoginPage.class).loginAs(TestUser.ACTOR4);
    listsPage = PageFactory.initElements(driver, ListsPage.class);
    // listsPage.goToPage();
    
    // - SDK - //
    jse = (JavascriptExecutor)driver;
    loginAs(TestUser.ACTOR4);
    goToListsPage();
  }

  @AfterMethod
  public void tearDown() {
    // PageFactory.initElements(driver, LogoutPage.class).goToPage();
    this.shutDownBrowser();
  }

  // @Test(dataProvider = "listData", description = "Create a new List")
  public void createList(String listName, String listDescription) throws InterruptedException {
    listsPage
      .clickCreateNewListButton()
      .chooseCreateNewList()
      .enterListName(listName)
      .enterDescription(listDescription)
      .clickSaveButton();

    Assert.assertTrue(listsPage.isLoaded(), "Failure loading page after saving new List");
    Assert.assertTrue(listsPage.doesListExist(listName), "Failure creating list: " +
      listName);
  }

  // @Test(dependsOnMethods = "createList", dataProvider = "listData", description = "Delete List")
  public void deleteList(String listName, String listDescription) {
    listsPage = listsPage
      .selectCheckboxByListName(listName)
      .clickDeleteButton()
      .confirmDelete();

    Assert.assertFalse(listsPage.doesListExist(listName), "Failure deleting list: " +
      listName);
  }

  @DataProvider(name = "listData")
  public static Object[][] listData() {
    return new Object[][]{{"Smoke Test " + current_time_stamp, "test"}};
  }

  // - SDK - //
  public void goToListsPage() {
    // clickItem(waitUntilElementAvailable(getPageItem("listsPageTab")));
    click( "Lists" );
  }

  public String getPageItem(String key) {
	  return PropertiesCache.getInstance().getProperty(key);
  }

  @Test(dataProvider = "listData", description = "Create a new List")
  public void _createList(String listName, String listDescription) throws InterruptedException {
    clickItem(waitUntilElementAvailable("//*[@label='Lists']", 1));
    clickItem(waitUntilElementAvailable("//button[text()='Create a New List']", 1));
    clickItem(waitUntilElementAvailable("//button[text()='Create New List']", 5));

    String[] fs = {"Name", "Description (Optional)" };
    for( String n : fs ) {
      WebElement f = getFieldByLabel(n);
      jse.executeScript("arguments[0].value='"+listName+"'", f);
    }
    // - Simulate - //
    getFieldByLabel(fs[0]).sendKeys(" ");
    getFieldByLabel(fs[0]).sendKeys(Keys.BACK_SPACE);
    
    clickItem(getButtonByLabel("Save"));

    Assert.assertTrue(
        waitUntilElementAvailable("//h4[text()='"+listName+"']") != null, 
        "Failure creating list: " + listName);
  }

  // @Test(dependsOnMethods = "_createList", dataProvider = "listData", description = "Delete List")
  public void _deleteList(String listName, String listDescription) {
    listsPage = listsPage
      .selectCheckboxByListName(listName)
      .clickDeleteButton()
      .confirmDelete();

    Assert.assertFalse(listsPage.doesListExist(listName), "Failure deleting list: " +
      listName);
  }

  public void deleteLists() {
    String xp = "//button[contains(text(),'Select All')]";
  }

  public void enter(String data, String xpath) throws FileNotFoundException, IOException { 
    jse.executeScript("arguments[0].value='"+getTestData(data)+"'", waitUntilElementAvailable(xpath) );
  }

  public void clickItem(WebElement item) {
    jse.executeScript("arguments[0].click();", item);
  }

  public void click(String item) {
    jse.executeScript("arguments[0].click();", 
    		waitUntilElementAvailable(PropertiesCache.getInstance().getProperty(item), 5));
  }

  public void loginAs(TestUser testUser) throws FileNotFoundException, IOException {
   enter("login.actor4.user", PropertiesCache.getInstance().getProperty("username"));
   enter("login.actor4.pswd", PropertiesCache.getInstance().getProperty("password"));
   click("loginBtn");
  
   waitUntilPageLoadComplete();
  }

  public static void waitUntilPageLoadComplete() {
    new WebDriverWait(driver, WAIT).until(
        webDriver -> ((JavascriptExecutor) webDriver)
        .executeScript("return document.readyState").equals("complete"));    
  }

  public static WebElement waitUntilElementAvailable(String xpath) {
    return new WebDriverWait(driver, WAIT).until(ExpectedConditions
        .visibilityOfElementLocated(By.xpath(xpath)));
  }

  public static WebElement waitUntilElementAvailable(String xpath, int w) {
    return new WebDriverWait(driver, w).until(ExpectedConditions
        .visibilityOfElementLocated(By.xpath(xpath)));
  }

  public static WebElement getFieldByLabel(String label) {
    String xp = "//div[@class='modal create-target-list']";
    WebElement fm = waitUntilElementAvailable(xp);
    return (WebElement)jse.executeScript("return arguments[0].nextSibling;", 
        fm.findElement(By.xpath("//label[text()='"+label+"']")));
  }

  public static WebElement getButtonByLabel(String label) {
    String xp = "//div[@class='modal create-target-list']";
    WebElement fm = waitUntilElementAvailable(xp);
    return (WebElement)jse.executeScript("return arguments[0];", 
        fm.findElement(By.xpath("//button[text()='"+label+"']")));
  }

  public String getTestData(String name) throws FileNotFoundException, IOException {
	  final Properties props = new Properties();
	  InputStream in = this.getClass().getClassLoader().getResourceAsStream("data.properties");
	  props.load(in);
	  return props.getProperty(name);
  }
}
