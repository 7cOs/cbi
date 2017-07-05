package com.cbrands.pages;

import com.cbrands.helper.PropertiesCache;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.openqa.selenium.By;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.How;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.LoadableComponent;
import org.testng.Assert;

import java.util.List;

import static com.cbrands.helper.SeleniumUtils.*;

public class NotesModal extends LoadableComponent<NotesModal> {
  private static final String MODAL_CONTAINER_XPATH = "//div[contains(@class, 'modal notes')]";

  private Log log = LogFactory.getLog(NotesModal.class);
  final PropertiesCache propertiesCache;

  private final WebDriver driver;

  @FindBy(how = How.XPATH, using = "//div[contains(@class, 'modal notes')]")
  private WebElement modalContainer;

  public NotesModal(WebDriver driver) {
    propertiesCache = PropertiesCache.getInstance();

    this.driver = driver;
    PageFactory.initElements(driver, this);
  }

  @Override
  protected void load() {
    Assert.fail("The Notes modal cannot be loaded directly via url.");
  }

  @Override
  protected void isLoaded() throws Error {
    Assert.assertTrue(isModalLoaded());
  }

  public boolean isModalLoaded() {
    waitForVisibleFluentWait(modalContainer);
    waitForLoaderToDisappear();
    return modalContainer.isDisplayed();
  }

  /**
   * Clicks the add Note button when other notes already exist.
   */
  public NotesModal clickAddNoteButton() {
    waitForLoaderToDisappear();

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
    final List<WebElement> topics = findElements(By.xpath("//md-option[@ng-repeat='topic in n.noteTopics']"));
    waitForElementsVisibleFluentWait(topics);

    final WebElement selectedTopic = getOptionByName(name, topics);
    Assert.assertNotNull(selectedTopic, "No topic found by name of: " + name);

    waitForElementToClickable(selectedTopic, true).click();

    return this;
  }

  private WebElement getOptionByName(String name, List<WebElement> topics) {
    WebElement selectedTopic = null;

    for(WebElement topic: topics) {
      if(name.equalsIgnoreCase(getOptionText(topic))) {
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
    final WebElement textBox = modalContainer.findElement(By.xpath(".//text-angular//div[@contenteditable='true']"));
    waitForVisibleFluentWait(textBox);
    waitForElementToClickable(textBox, true).click();

    textBox.sendKeys(noteText);

    return this;
  }

  public NotesModal clickSave() {
    final WebElement saveButton = modalContainer.findElement(By.xpath(".//button[contains(., 'Save')]"));
    waitForVisibleFluentWait(saveButton);
    waitForElementToClickable(saveButton, true).click();

    return this;
  }

  public String getTextFromFirstNote() {
    waitForLoaderToDisappear();

    final WebElement firstNote = modalContainer.findElement(By.xpath(".//div[contains(@class, 'note-body')]"));
    waitForVisibleFluentWait(firstNote);
    return firstNote.findElement(By.xpath(".//p[contains(@class, 'note-body-field-content')]//p")).getText().trim();
  }

  private void waitForLoaderToDisappear() {
    final By by = By.xpath(MODAL_CONTAINER_XPATH + "//progress-container");
    try {
      waitForElementStalenessFluentWait(findElement(by));
    } catch (NoSuchElementException e) {
      log.info("Loader element no longer present.");
    }
  }
}
