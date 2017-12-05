package com.cbrands.test.smoke;

import com.cbrands.TestUser;
import com.cbrands.pages.AccountDashboardPage;
import com.cbrands.pages.LoginPage;
import com.cbrands.pages.LogoutPage;
import com.cbrands.pages.NotesModal;
import com.cbrands.test.BaseTestCase;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.PageFactory;
import org.testng.Assert;
import org.testng.annotations.AfterClass;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.DataProvider;
import org.testng.annotations.Test;

import java.net.MalformedURLException;

public class NotesTest extends BaseTestCase {
  private static String current_time_stamp = new java.text.SimpleDateFormat("MM.dd.yyyy HH:mm:ss").format(new java.util
    .Date());

  private NotesModal notesModal;

  @BeforeClass
  public void setUpClass() throws MalformedURLException {
    this.startUpBrowser("Smoke - NotesTest");

    PageFactory.initElements(driver, LoginPage.class).loginAs(TestUser.NOTES_ACTOR);
    PageFactory.initElements(driver, AccountDashboardPage.class).goToPage();

    notesModal = PageFactory.initElements(driver, AccountDashboardPage.class)
      .filterForStore("Taco Joint", "IL", "Ontario")
      .clickApplyFilters()
      .clickNotesButton()
      .waitForLoaderToDisappear();
  }

  @AfterClass
  public void tearDownClass() {
    PageFactory.initElements(driver, LogoutPage.class).goToPage();
    this.shutDownBrowser();
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
