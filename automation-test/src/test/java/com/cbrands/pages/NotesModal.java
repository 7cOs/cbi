package com.cbrands.pages;

import com.cbrands.helper.PropertiesCache;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.How;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.LoadableComponent;
import org.testng.Assert;

import static com.cbrands.helper.SeleniumUtils.*;

public class NotesModal extends LoadableComponent<NotesModal> {

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
    Assert.assertTrue(modalContainer.isDisplayed());
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
}
