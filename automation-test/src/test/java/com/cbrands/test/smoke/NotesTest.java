package com.cbrands.test.smoke;

import com.cbrands.TestUser;
import com.cbrands.pages.*;
import com.cbrands.test.BaseTestCase;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.PageFactory;
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
    logoutPage = new LogoutPage(driver);
    log.info("\nLoading webpage...");
    driver.get(webAppBaseUrl);

    login(TestUser.NOTES_ACTOR);
    final AccountDashboardPage accountDashboardPage = PageFactory.initElements(driver, AccountDashboardPage.class);
    accountDashboardPage.goToPage();

    notesModal = accountDashboardPage.openNotesModalForStore("Taco Joint", "IL", "Ontario");
    Assert.assertTrue(notesModal.isLoaded(), "Failure to load Notes modal \n");
    notesModal.waitForLoaderToDisappear();
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

  private void login(TestUser testUser) {
    final Login loginPage = new Login(driver);
    final HomePage homePage = loginPage.loginAs(testUser);
    Assert.assertTrue(homePage.isLoaded(), "Failed to log in user: " + testUser.userName());
  }

}
