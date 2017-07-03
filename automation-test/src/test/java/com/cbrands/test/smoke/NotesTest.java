package com.cbrands.test.smoke;

import com.cbrands.TestUser;
import com.cbrands.pages.*;
import org.testng.Assert;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.DataProvider;
import org.testng.annotations.Test;

public class NotesTest extends BaseTestCase {
  private static String current_time_stamp = new java.text.SimpleDateFormat("MM.dd.yyyy HH:mm:ss").format(new java.util
    .Date());

  private Login login;
  private Logout logout;
  private AccountDashboardPage accountDashboardPage;
  private String storeAccountName;

  @BeforeMethod
  public void setUp() {
    final TestUser testUser = TestUser.NOTES_ACTOR;
    storeAccountName = "Taco Joint";

    login = new Login(driver);
    logout = new Logout(driver);

    log.info("\nLoading webpage...");
    driver.get(webAppBaseUrl);
    HomePage homePage = login.loginWithValidCredentials(testUser.userName(), testUser.password());
    Assert.assertTrue(homePage.isOnHomePage(), "Failed to log in user: " + testUser.userName());

    accountDashboardPage = homePage.navigateToAccountDashboardPage();
  }

  @AfterMethod
  public void tearDown() {
    logout.logoutViaUrl();
  }

  @Test(description = "Create a new Note", dataProvider = "NoteData")
  public void createNote(String noteTopic, String noteText) {

    final NotesModal notesModal =
      drillDownToStore()
      .clickNotesButton();

    notesModal.clickAddNoteButton()
      .clickNoteTopicSelector()
      .selectNoteTopicByName(noteTopic)
      .enterNoteText(noteText)
      .clickSave();

    Assert.assertEquals(notesModal.getTextFromFirstNote(), noteText);
  }

  @DataProvider(name = "NoteData")
  public static Object[][] noteData() {
    return new Object[][] { {"Distribution", "Testing create notes: " + current_time_stamp } };
  }

	/**
   * The drilldown steps in this method are specific to the given store. These steps will need to be updated should
   * we decide to use a different store account.
   */
  private AccountDashboardPage drillDownToStore() {
    return accountDashboardPage
      .enterRetailerChainSearchText(storeAccountName)
      .clickSearchForRetailerChain()
      .selectRetailerChainByName(storeAccountName)
      .clickApplyFilters()
      .drillIntoRightPanelWithName(storeAccountName)
      .drillIntoRightPanelWithName(storeAccountName);
  }

}
