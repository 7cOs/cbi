package com.cbrands.test.smoke;

import com.cbrands.TestUser;
import com.cbrands.pages.LoginPage;
import com.cbrands.pages.LogoutPage;
import com.cbrands.pages.lists.ListsPage;
import com.cbrands.test.BaseTestCase;
import org.openqa.selenium.support.PageFactory;
import org.testng.Assert;
import org.testng.annotations.*;

import java.lang.reflect.Method;
import java.net.MalformedURLException;

public class TargetListTest extends BaseTestCase {
  static String current_time_stamp = new java.text.SimpleDateFormat("MM.dd.yyyy HH:mm:ss").format(new java.util.Date());

  private ListsPage listsPage;

  @BeforeMethod
  public void setUp(Method method) throws MalformedURLException {
    this.startUpBrowser(String.format("Smoke - Lists Test - %s", method.getAnnotation(Test.class).description()));

    PageFactory.initElements(driver, LoginPage.class).loginAs(TestUser.ACTOR4);
    listsPage = PageFactory.initElements(driver, ListsPage.class);
    listsPage.goToPage();
  }

  @AfterMethod
  public void tearDown() {
    PageFactory.initElements(driver, LogoutPage.class).goToPage();
    this.shutDownBrowser();
  }

  @Test(dataProvider = "listData", description = "Create a new List")
  public void createList(String listName, String listDescription) throws InterruptedException {
    listsPage
      .clickCreateNewListButton()
      .chooseCreateNewList()
      .enterListName(listName)
      .enterDescription(listDescription)
      .clickSaveButton();

    Assert.assertTrue(listsPage.isLoaded(), "Failure loading page after saving new List");
    Assert.assertTrue(listsPage.doesTargetListExist(listName), "Failure creating list: " +
      listName);
  }

  @Test(dependsOnMethods = "createList", dataProvider = "listData", description = "Delete List")
  public void deleteList(String listName, String listDescription) {
    listsPage
      .selectTargetListByName(listName)
      .clickDeleteButton();

    Assert.assertFalse(listsPage.doesTargetListExist(listName), "Failure deleting list: " +
      listName);
  }

  @DataProvider(name = "listData")
  public static Object[][] listData() {
    return new Object[][]{{"Smoke Test " + current_time_stamp, "test"}};
  }

}
