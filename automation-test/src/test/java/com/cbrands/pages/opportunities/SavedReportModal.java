package com.cbrands.pages.opportunities;

import com.cbrands.pages.TestNGBasePage;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.How;
import org.openqa.selenium.support.PageFactory;
import org.testng.Assert;

import static com.cbrands.helper.SeleniumUtils.*;

public class SavedReportModal extends TestNGBasePage {
  private static final String MODAL_CONTAINER_XPATH = "//div[@class='modal edit-report']";

  private final WebDriver driver;

  @FindBy(how = How.XPATH, using = MODAL_CONTAINER_XPATH)
  private WebElement savedReportModalContainer;

  @FindBy(how = How.XPATH, using = MODAL_CONTAINER_XPATH + "//p[contains(., 'Delete Report')]")
  private WebElement deleteSavedReportLink;

  public SavedReportModal(WebDriver driver) {
    this.driver = driver;
    PageFactory.initElements(driver, this);
  }

  @Override
  protected void load() {
    Assert.fail("The Saved Report modal component cannot be loaded directly via url.");
  }

  @Override
  public boolean isLoaded() {
    waitForVisibleFluentWait(savedReportModalContainer);
    return savedReportModalContainer.isDisplayed();
  }

  public OpportunitiesPage clickDeleteSavedReportLink() {
    waitForElementToClickable(deleteSavedReportLink, true).click();
    waitForElementToDisappear(By.xpath(MODAL_CONTAINER_XPATH));

    return PageFactory.initElements(driver, OpportunitiesPage.class);
  }
}


