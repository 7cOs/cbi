package com.cbrands.test.smoke;

import com.cbrands.TestUser;
import com.cbrands.pages.*;
import org.openqa.selenium.WebElement;
import org.testng.Assert;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.DataProvider;
import org.testng.annotations.Test;

public class NotesTest extends BaseTestCase {
  private static String current_time_stamp = new java.text.SimpleDateFormat("MM.dd.yyyy HH:mm:ss").format(new java.util
    .Date());

  private LogoutPage logoutPage;
  private NotesModal notesModal;

  @BeforeMethod
  public void setUp() {
    final TestUser testUser = TestUser.NOTES_ACTOR;
    final String storeAccountName = "Taco Joint";

    final Login login = new Login(driver);
    logoutPage = new LogoutPage(driver);

    log.info("\nLoading webpage...");
    driver.get(webAppBaseUrl);
    HomePage homePage = login.loginWithValidCredentials(testUser.userName(), testUser.password());
    Assert.assertTrue(homePage.isOnHomePage(), "Failed to log in user: " + testUser.userName());

    notesModal = homePage.navigateToAccountDashboardPage()
      .enterRetailerChainSearchText(storeAccountName)
      .clickSearchForRetailerChain()
      .selectRetailerChainByName(storeAccountName)
      .clickApplyFilters()
      .drillIntoRightPanelWithName(storeAccountName)
      .drillIntoRightPanelWithName(storeAccountName)
      .clickNotesButton()
      .waitForLoaderToDisappear();

    Assert.assertTrue(notesModal.isLoaded(), "Failure to load Notes modal \n");
  }

  @AfterMethod
  public void tearDown() {
    logoutPage.goToPage();
  }

  @Test(description = "Create a new Note", dataProvider = "NoteData")
  public void createNote(String noteTopic, String noteText) {
    notesModal
      .clickAddNoteButton()
      .clickNoteTopicSelector()
      .selectNoteTopicByName(noteTopic)
      .enterNoteText(noteText)
      .clickSave()
      .waitForLoaderToDisappear();

    Assert.assertEquals(notesModal.getTextFromFirstNote(), noteText);
  }

  @Test(dependsOnMethods = "createNote", description = "Delete a Note", dataProvider = "NoteData")
  public void deleteNote(String noteTopic, String noteText) {
    final WebElement deleteMe = notesModal.findNoteWithText(noteText);

    notesModal
      .clickDeleteIcon(deleteMe)
      .confirmDelete(deleteMe)
      .waitForLoaderToDisappear();

    Assert.assertFalse(
      notesModal.doesNoteExistByNoteText(noteText),
      "Failure to delete note with the following text: " + noteText + "\n"
    );
  }

  @DataProvider(name = "NoteData")
  public static Object[][] noteData() {
    return new Object[][]{{"Distribution", "Testing create notes: " + current_time_stamp}};
  }

}
