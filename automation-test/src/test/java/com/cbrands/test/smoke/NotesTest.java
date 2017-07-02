package com.cbrands.test.smoke;

import com.cbrands.TestUser;
import com.cbrands.pages.*;
import org.testng.Assert;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.DataProvider;
import org.testng.annotations.Test;

public class NotesTest extends BaseTestCase {
  static String current_time_stamp = new java.text.SimpleDateFormat("MM.dd.yyyy HH:mm:ss").format(new java.util.Date());

  private Login login;
  private Logout logout;
  private AccountDashboardPage accountDashboardPage;

  @BeforeMethod
  public void setUp() {
    final TestUser testUser = TestUser.NOTES_ACTOR;

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
  public void createNote(String retailerChainName, String noteTopic, String noteText) {

    final NotesModal notesModal = accountDashboardPage
      .enterRetailerChainSearchText(retailerChainName)
      .clickSearchForRetailerChain()
      .selectRetailerChainByName(retailerChainName)
      .clickApplyFilters()
      .drillIntoRightPanelWithName(retailerChainName)
      .drillIntoRightPanelWithName(retailerChainName)
      .clickNotesButton();

    notesModal.clickAddNoteButton()
      .clickNoteTopicSelector()
      .selectNoteTopicByName(noteTopic)
      .enterNoteText(noteText)
      .clickSave();

    Assert.assertEquals(notesModal.getTextFromFirstNote(notesModal), noteText);
  }

  @DataProvider(name = "NoteData")
  public static Object[][] noteData() {
    return new Object[][] { {"Taco Joint", "Distribution", "Testing create notes: " + current_time_stamp } };
  }

}
