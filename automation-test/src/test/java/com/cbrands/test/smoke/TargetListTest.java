package com.cbrands.test.smoke;

import com.cbrands.TestUser;
import com.cbrands.pages.HomePage;
import com.cbrands.pages.Login;
import com.cbrands.pages.Logout;
import com.cbrands.pages.targetList.TargetList;
import com.cbrands.pages.targetList.TargetListListings;
import org.testng.Assert;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.DataProvider;
import org.testng.annotations.Test;

public class TargetListTest extends BaseTestCase {
  static String current_time_stamp = new java.text.SimpleDateFormat("MM.dd.yyyy HH:mm:ss").format(new java.util.Date());

  private Login login;
  private Logout logout;
  private TargetListListings targetListListingPage;

  @BeforeMethod
  public void setUp() {
    login = new Login(driver);
    logout = new Logout(driver);

    log.info("\nLoading webpage...");
    driver.get(webAppBaseUrl);
    HomePage homePage = login.loginWithValidCredentials(TestUser.ACTOR2.userName(), TestUser.ACTOR2.password());
    Assert.assertTrue(homePage.isOnHomePage(), "Failed to log in user: " + TestUser.ACTOR2.userName());

    targetListListingPage = homePage.navigateToTargetListListings();
  }

  @AfterMethod
  public void tearDown() {
    logout.logoutViaUrl();
  }

  @Test(dataProvider = "targetListData", description = "Create a new Target List")
  public void createTargetList(String targetListName, String targetListDescription, String collaborator) throws InterruptedException {
    final TargetList editTargetListModal =
      targetListListingPage
        .clickCreateNewListButton()
        .clickCreateNewListButtonInListCreationChoiceModal();

    editTargetListModal
      .EnterNameTextBox(targetListName)
      .typeDescription(targetListDescription)
      .addCollaborator(collaborator)
      .clickSaveButton();

    Assert.assertTrue(targetListListingPage.doesTargetListExist(targetListName), "Failure creating target list: " +
      targetListName);
  }

  @DataProvider(name = "targetListData")
  public static Object[][] targetListData() {
    return new Object[][] { { "Smoke Test " + current_time_stamp, "test", "Stanley Rowley" } };
  }

}
