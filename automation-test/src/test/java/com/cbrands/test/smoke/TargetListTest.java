package com.cbrands.test.smoke;

import com.cbrands.TestUser;
import com.cbrands.pages.LoginPage;
import com.cbrands.pages.LogoutPage;
import com.cbrands.pages.targetList.TargetListListingsPage;
import com.cbrands.test.BaseTestCase;
import org.openqa.selenium.support.PageFactory;
import org.testng.Assert;
import org.testng.annotations.*;

import java.net.MalformedURLException;

public class TargetListTest extends BaseTestCase {
  static String current_time_stamp = new java.text.SimpleDateFormat("MM.dd.yyyy HH:mm:ss").format(new java.util.Date());

  private TargetListListingsPage targetListListingPage;

  @BeforeMethod
  public void setUp() throws MalformedURLException {
    this.startUpBrowser("Smoke - TargetList Test");

    PageFactory.initElements(driver, LoginPage.class).loginAs(TestUser.ACTOR4);
    targetListListingPage = PageFactory.initElements(driver, TargetListListingsPage.class);
    targetListListingPage.goToPage();
  }

  @AfterMethod
  public void tearDown() {
    PageFactory.initElements(driver, LogoutPage.class).goToPage();
    this.shutDownBrowser();
  }

  @Test(dataProvider = "targetListData", description = "Create a new Target List")
  public void createTargetList(String targetListName, String targetListDescription) throws InterruptedException {
    targetListListingPage
      .clickCreateNewListButton()
      .chooseCreateNewListInListCreationChoiceModal()
      .enterListName(targetListName)
      .enterDescription(targetListDescription)
      .clickSaveButton();

    Assert.assertTrue(targetListListingPage.isLoaded(), "Failure loading page after saving new Target List");
    Assert.assertTrue(targetListListingPage.doesTargetListExist(targetListName), "Failure creating target list: " +
      targetListName);
  }

  @Test(dependsOnMethods = "createTargetList", dataProvider = "targetListData", description = "Delete Target List")
  public void deleteTargetList(String targetListName, String targetListDescription) {
    targetListListingPage
      .selectTargetListByName(targetListName)
      .clickDeleteButton();

    Assert.assertFalse(targetListListingPage.doesTargetListExist(targetListName), "Failure deleting target list: " +
      targetListName);
  }

  @DataProvider(name = "targetListData")
  public static Object[][] targetListData() {
    return new Object[][] { { "Smoke Test " + current_time_stamp, "test" } };
  }

}
