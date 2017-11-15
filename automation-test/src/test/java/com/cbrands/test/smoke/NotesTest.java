package com.cbrands.test.smoke;

import com.cbrands.TestUser;
import com.cbrands.pages.*;
import com.cbrands.test.BaseTestCase;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.PageFactory;
import org.testng.Assert;
import org.testng.annotations.*;

import java.net.MalformedURLException;

public class NotesTest extends BaseTestCase {
  private static String current_time_stamp = new java.text.SimpleDateFormat("MM.dd.yyyy HH:mm:ss").format(new java.util
    .Date());

  private LogoutPage logoutPage;
  private NotesModal notesModal;

  @BeforeClass
  public void setUpClass() throws MalformedURLException {
    super.startUpBrowser("Smoke - NotesTest");

    logoutPage = new LogoutPage(driver);
    log.info("\nLoading webpage...");
    driver.get(webAppBaseUrl);

    final Login loginPage = new Login(driver);
    final HomePage homePage = loginPage.loginAs(TestUser.NOTES_ACTOR);
    Assert.assertTrue(homePage.isLoaded(), "Failed to log in user: " + TestUser.NOTES_ACTOR.userName());

    final AccountDashboardPage accountDashboardPage = PageFactory.initElements(driver, AccountDashboardPage.class);
    accountDashboardPage.goToPage();

    notesModal = accountDashboardPage
      .filterForStore("Taco Joint", "IL", "Ontario")
      .clickApplyFilters()
      .clickNotesButton()
      .waitForLoaderToDisappear();
  }

  @AfterClass
  public void tearDownClass() {
    logoutPage.goToPage();
    shutDownBrowser();
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

    Assert.assertEquals(
      notesModal.getTextFromFirstNote(),
      noteText,
      "New Note did not display after clicking the Save button."
    );

    notesModal
      .closeModal()
      .clickNotesButton();
    Assert.assertEquals(
      notesModal.getTextFromFirstNote(),
      noteText,
      "Failed to retrieve and display newly saved Note."
    );
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
    return new Object[][]{
      {
        "Distribution",
        "Testing create notes: " + current_time_stamp
      }
    };
  }

}
