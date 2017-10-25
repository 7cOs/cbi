package com.cbrands.pages;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.openqa.selenium.By;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.How;
import org.openqa.selenium.support.PageFactory;
import org.testng.Assert;

import java.util.List;

import static com.cbrands.helper.SeleniumUtils.*;

public class NotesModal extends TestNGBasePage {
  private static final String MODAL_CONTAINER_XPATH = "//div[contains(@class, 'modal notes')]";

  private Log log = LogFactory.getLog(NotesModal.class);
  private final WebDriver driver;

  @FindBy(how = How.XPATH, using = MODAL_CONTAINER_XPATH)
  private WebElement modalContainer;

  public NotesModal(WebDriver driver) {
    this.driver = driver;
    PageFactory.initElements(driver, this);
  }

  @Override
  protected void load() {
    Assert.fail("The Notes modal cannot be loaded directly via url.");
  }

  @Override
  public boolean isLoaded() throws Error {
    waitForVisibleFluentWait(modalContainer);
    waitForLoaderToDisappear();
    return modalContainer.isDisplayed();
  }

  /**
   * Clicks the add Note button when other notes already exist.
   */
  public NotesModal clickAddNoteButton() {
    final WebElement addNoteButton = modalContainer.findElement(By.xpath(".//p[contains(., 'New Note')]"));
    waitForVisibleFluentWait(addNoteButton);
    waitForElementToClickable(addNoteButton, true).click();
    return this;
  }

  public NotesModal clickNoteTopicSelector() {
    final WebElement selector = modalContainer.findElement(By.xpath(".//md-select[@placeholder='Select a topic']"));
    waitForVisibleFluentWait(selector);
    waitForElementToClickable(selector, true).click();

    return this;
  }

  public NotesModal selectNoteTopicByName(String name) {
    final List<WebElement> topics = modalContainer.findElements(
      By.xpath("//md-option[@ng-repeat='topic in n.noteTopics']")
    );
    waitForElementsVisibleFluentWait(topics);

    final WebElement selectedTopic = getOptionByName(name, topics);
    Assert.assertNotNull(selectedTopic, "No topic found by name of: " + name);

    waitForElementToClickable(selectedTopic, true).click();
    waitForElementToDisappear(By.xpath(MODAL_CONTAINER_XPATH + "//md-option[@ng-repeat='topic in n.noteTopics']"));

    return this;
  }

  private WebElement getOptionByName(String name, List<WebElement> topics) {
    WebElement selectedTopic = null;

    for (WebElement topic : topics) {
      if (name.equalsIgnoreCase(getOptionText(topic))) {
        selectedTopic = topic;
        break;
      }
    }

    return selectedTopic;
  }

  private String getOptionText(WebElement topic) {
    return topic.findElement(By.xpath(".//*[contains(@class, 'md-text')]")).getText().trim();
  }

  public NotesModal enterNoteText(String noteText) {
    final By noteTextXPathSelector = By.xpath(".//text-angular//div[@contenteditable='true']");
    final WebElement textBox = modalContainer.findElement(noteTextXPathSelector);
    waitForVisibleFluentWait(textBox);
    waitForElementToClickable(textBox, true).click();

    textBox.sendKeys(noteText);
    waitForTextPresent(noteTextXPathSelector, noteText);

    return this;
  }

  public NotesModal clickSave() {
    final WebElement saveButton = modalContainer.findElement(By.xpath(".//button[contains(., 'Save')]"));
    waitForVisibleFluentWait(saveButton);
    waitForElementToClickable(saveButton, true).click();

    return this;
  }

  public String getTextFromFirstNote() {
    final WebElement firstNote = modalContainer
      .findElement(By.xpath(".//div[contains(concat(' ', normalize-space(@class), ' '), ' note-body ')]"));
    waitForVisibleFluentWait(firstNote);
    return getNoteText(firstNote);
  }

  public boolean doesNoteExistByNoteText(String noteText) {
    boolean doesExist = false;

    try {
      findNoteWithText(noteText);
      doesExist = true;
    } catch (NoSuchElementException e) {
      log.info("No Note found with the following text: " + noteText);
    }

    return doesExist;
  }

  private String getNoteText(WebElement note) {
    String text = "";

    final WebElement textContainer =
      note.findElement(By.xpath(".//p[contains(@class, 'note-body-field-content')]//div.note-body-field-text"));
    try {
      text = textContainer.findElement(By.xpath("./*")).getText().trim();
    } catch (NoSuchElementException e) {
      log.info("This Note has no text.");
    }

    return text;
  }

  public NotesModal waitForLoaderToDisappear() {
    waitForElementToDisappear(By.xpath(MODAL_CONTAINER_XPATH + "//progress-container"));
    return this;
  }

  public WebElement findNoteWithText(String noteText) {
    final String isNote = "contains(@class, 'note-body ')";
    final String containsMatchingText = ".//div.note-body-field-text/*[contains(., '" + noteText + "')]";

    return modalContainer.findElement(By.xpath(".//div[" + isNote + " and " + containsMatchingText + "]"));
  }

  public NotesModal clickDeleteIcon(WebElement deleteMe) {
    waitForElementToClickable(deleteMe.findElement(By.xpath(".//div[contains(@class, 'delete-note')]")), true).click();

    return this;
  }

  public NotesModal confirmDelete(WebElement note) {
    final WebElement confirmDeleteButton = note.findElement(By.xpath(".//button[contains(., 'Yes')]"));
    waitForVisibleFluentWait(confirmDeleteButton);
    waitForElementToClickable(confirmDeleteButton, true).click();

    return this;
  }
}
