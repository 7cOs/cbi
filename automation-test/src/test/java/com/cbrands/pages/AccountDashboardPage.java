package com.cbrands.pages;

import com.cbrands.PremiseType;
import com.cbrands.pages.opportunities.OpportunitiesPage;
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

public class AccountDashboardPage extends TestNGBasePage {
  private static final String LEFT_PANEL_XPATH = "//div[contains(@class, 'scorecard-table')]";
  private static final String LEFT_PANEL_ROW_XPATH = ".//md-tab-content[contains(@class, 'md-active')]//tr[@ng-repeat]";
  private static final String RIGHT_PANEL_XPATH = "//div[contains(@class, 'scorecard-chart')]";
  private static final String RIGHT_PANEL_ROW_XPATH = ".//p[contains(@class, 'data-brand')]";
  private static final String BACK_CHEVRON_XPATH = ".//span[contains(@class, 'back-chevron')]";
  private static final String PANEL_LOADER_XPATH = "//div[contains(@class, 'loader-wrap')]";
  private static final String RIGHT_PANEL_LOADER_XPATH = RIGHT_PANEL_XPATH + PANEL_LOADER_XPATH;
  private static final String LEFT_PANEL_LOADER_XPATH = LEFT_PANEL_XPATH + PANEL_LOADER_XPATH;
  private static final String REMOVE_BUTTON_XPATH = "//input[contains(@class, 'remove-btn visible')]";

  private Log log = LogFactory.getLog(AccountDashboardPage.class);

  private final WebDriver driver;
  public final FilterForm filterForm;

  @FindBy(how = How.XPATH, using = "//div[contains(@class, 'account-header')]")
  private WebElement header;

  @FindBy(how = How.XPATH, using = "//md-select[contains(@ng-model, 'retailer')]")
  private WebElement retailerTypeDropdown;

  @FindBy(how = How.XPATH, using = "//inline-search[@type='chain']")
  private WebElement retailerChainFilter;

  @FindBy(how = How.XPATH, using = "//inline-search[@type='store']")
  private WebElement retailerStoreFilter;

  @FindBy(css = "md-content._md div div.ng-scope div:nth-of-type(3) div:nth-of-type(2) div.apply-filters button" +
    ".btn-action")
  private WebElement applyFilters;

  @FindBy(how = How.XPATH, using = "//a[contains(@class, 'reset-icon')]")
  private WebElement resetFilters;

  @FindBy(how = How.XPATH, using = LEFT_PANEL_XPATH)
  private WebElement leftPanel;

  @FindBy(how = How.XPATH, using = RIGHT_PANEL_XPATH)
  private WebElement rightPanel;

  @FindBy(how = How.XPATH, using = "//a[contains(., 'See All Opportunities')]")
  private WebElement seeAllOpportunitiesLink;

  public AccountDashboardPage(WebDriver driver) {
    this.driver = driver;

    this.filterForm = PageFactory.initElements(driver, FilterForm.class);
  }

  @Override
  public boolean isLoaded() {
    waitForVisibleFluentWait(header);
    return header.isDisplayed();
  }

  @Override
  protected void load() {
    driver.get(webAppBaseUrl + "/accounts");
  }

  public static class FilterForm {
    @FindBy(how = How.XPATH, using = "//inline-search[@type='distributor']")
    private WebElement distributorFilter;

    private final WebDriver driver;

    public FilterForm(WebDriver driver) {
      this.driver = driver;
    }

    public AccountDashboardPage selectPremiseType(PremiseType premiseType) {
      waitForElementToClickable(
        findElement(By.xpath("//md-radio-button[@aria-label='" + premiseType.label() + "']")),
        true
      ).click();
      return PageFactory.initElements(driver, AccountDashboardPage.class);
    }

    public AccountDashboardPage clickRemoveDistributorFilter() {
      final WebElement removeDistributorButton = distributorFilter.findElement(By.xpath(REMOVE_BUTTON_XPATH));
      waitForElementToClickable(removeDistributorButton, true).click();
      return PageFactory.initElements(driver, AccountDashboardPage.class);
    }

    public String getDistributorFieldText() {
      return distributorFilter.findElement(By.xpath("//input[@type='text']")).getAttribute("value");
    }

    public AccountDashboardPage enterDistributorSearchText(String text) {
      final WebElement distributorTextBox = distributorFilter
        .findElement(By.xpath(".//input[@placeholder='Name']"));
      waitForElementToClickable(distributorTextBox, true).click();
      distributorTextBox.sendKeys(text);

      return PageFactory.initElements(driver, AccountDashboardPage.class);
    }

    public AccountDashboardPage clickSearchForDistributor() {
      final WebElement searchButton = distributorFilter
        .findElement(By.xpath(".//input[contains(@class, 'submit-btn visible')]"));
      waitForElementToClickable(searchButton, true).click();

      return PageFactory.initElements(driver, AccountDashboardPage.class);
    }

    public AccountDashboardPage selectDistributorFilterContaining(String text) {
      final WebElement resultsContainer = distributorFilter
        .findElement(By.xpath(".//div[contains(@class, 'results-container')]"));
      waitForVisibleFluentWait(resultsContainer);

      final List<WebElement> results = resultsContainer.findElements(By.xpath(".//li"));
      waitForElementsVisibleFluentWait(results);

      final WebElement distributor = getFirstElementContainingText(text, results);
      Assert.assertNotNull(distributor, "No distributor found with name containing " + text);
      waitForElementToClickable(distributor, true).click();

      return PageFactory.initElements(driver, AccountDashboardPage.class);
    }

    private WebElement getFirstElementContainingText(String text, List<WebElement> elements) {
      WebElement retailer = null;

      for (WebElement result : elements) {
        final String resultText = result.getText().trim();
        if (resultText.toUpperCase().contains(text.toUpperCase())) {
          retailer = result;
          break;
        }
      }

      return retailer;
    }
  }

  public AccountDashboardPage clickRetailerType() {
    waitForElementToClickable(retailerTypeDropdown, true).click();
    return this;
  }

  public AccountDashboardPage chooseStoreRetailerType() {
    final By retailerTypeHandle = By.xpath("//md-option[@aria-label='Store']");
    waitForElementToClickable(findElement(retailerTypeHandle), true).click();
    waitForElementToClickable(findElement(retailerTypeHandle), false);
    return this;
  }

  public AccountDashboardPage enterRetailerStoreSearchText(String text) {
    final WebElement retailerStoreTextBox = retailerStoreFilter
      .findElement(By.xpath(".//input[@placeholder='Name, Address, TDLinx']"));
    waitForElementToClickable(retailerStoreTextBox, true).click();
    retailerStoreTextBox.sendKeys(text);

    return this;
  }

  public AccountDashboardPage clickSearchForRetailerStore() {
    final WebElement searchButton = retailerStoreFilter
      .findElement(By.xpath(".//input[contains(@class, 'submit-btn visible')]"));
    waitForElementToClickable(searchButton, true).click();

    return this;
  }

  public AccountDashboardPage waitForStoreLoaderToDisappear() {
    waitForElementToDisappear(By.xpath("//md-progress-circular"));
    return this;
  }

  public AccountDashboardPage selectRetailerStoreByState(String stateLocation, String address) {
    final WebElement selectMe = retailerStoreFilter
      .findElement(By.xpath(".//div[contains(@class, 'results-container')]"))
      .findElement(By.xpath(".//label[contains(@class, 'state-group')][contains(., '" + stateLocation + "')]"))
      .findElement(By.xpath("./following-sibling::li[contains(., '" + address + "')]"));

    scrollToAndClick(selectMe);

    return this;
  }

  public AccountDashboardPage clickApplyFilters() {
    waitForElementToClickable(applyFilters, true);
    waitForVisibleFluentWait(applyFilters).click();

    return this;
  }

  public AccountDashboardPage drillIntoFirstRowInLeftPanel() {
    scrollToAndClick(leftPanel.findElement(By.xpath(LEFT_PANEL_ROW_XPATH)));
    return this;
  }

  public AccountDashboardPage drillUpLeftPanel() {
    final WebElement backButton = leftPanel.findElement(By.xpath(BACK_CHEVRON_XPATH));
    waitForVisibleFluentWait(backButton);
    waitForElementToClickable(backButton, true).click();

    return this;
  }

  public AccountDashboardPage drillIntoFirstRowInRightPanel() {
    scrollToAndClick(rightPanel.findElement(By.xpath(RIGHT_PANEL_ROW_XPATH)));
    return this;
  }

  public AccountDashboardPage drillUpRightPanel() {
    final WebElement backButton = rightPanel.findElement(By.xpath(BACK_CHEVRON_XPATH));
    waitForVisibleFluentWait(backButton);
    waitForElementToClickable(backButton, true).click();

    return this;
  }

  public boolean isLeftPanelResultsLoadedFor(LeftPanelLevel level) {
    boolean resultsAreLoaded;

    try {
      waitForVisibleFluentWait(leftPanel.findElement(By.xpath(LEFT_PANEL_ROW_XPATH)));
      final WebElement panelHeader = leftPanel.findElement(By.xpath(".//th//span[@aria-hidden='false']"));
      resultsAreLoaded = level.header.equalsIgnoreCase(panelHeader.getText());
    } catch (NoSuchElementException e) {
      resultsAreLoaded = false;
    }

    return resultsAreLoaded;
  }

  public boolean isRightPanelResultsLoadedFor(RightPanelLevel rightPanelLevel) {
    boolean resultsAreLoaded;

    try {
      waitForElementToDisappear(By.xpath(RIGHT_PANEL_LOADER_XPATH));
      waitForVisibleFluentWait(rightPanel.findElement(By.xpath(RIGHT_PANEL_ROW_XPATH)));

      final WebElement panelHeader = rightPanel.findElement(By.xpath(".//div[@class='widget-subheader-item']/p"));
      resultsAreLoaded = rightPanelLevel.name().equalsIgnoreCase(panelHeader.getText());
    } catch (NoSuchElementException e) {
      resultsAreLoaded = false;
    }

    return resultsAreLoaded;
  }

  public NotesModal clickNotesButton() {
    final WebElement notesButton = findElement(By.xpath(
      "//*[contains(@class, 'notes-icon enabled')]//a[contains(., 'Notes')]/../.."));
    waitForElementToClickable(notesButton, true).click();

    final NotesModal notesModal = PageFactory.initElements(driver, NotesModal.class);
    notesModal.isLoaded();
    return notesModal;
  }

  public AccountDashboardPage filterForStore(String storeAccountName, String stateLocation, String address) {
    return this.clickRetailerType()
      .chooseStoreRetailerType()
      .enterRetailerStoreSearchText(storeAccountName)
      .clickSearchForRetailerStore()
      .waitForStoreLoaderToDisappear()
      .selectRetailerStoreByState(stateLocation, address);
  }

  public String getRightPanelHeader() {
    return findElement(By.xpath("//p[contains(@class, 'market')]")).getText();
  }

  public String getOverviewMarketLabel() {
    final WebElement marketTab = findElement(By.xpath("//div[@class='market-overview clearfix']/div[@class='market']"));
    return marketTab.getText();
  }

  public String getRightPanelSelectorContextLabel() {
    return findElement(By.xpath("//div[@class='section-header-user']/span[@class='ng-binding']")).getText();
  }

  public AccountDashboardPage waitForBrandsPanelLoaderToDisappear() {
    waitForElementToDisappear(By.xpath(LEFT_PANEL_LOADER_XPATH));
    return this;
  }

  public AccountDashboardPage waitForMarketPanelLoaderToDisappear() {
    waitForElementToDisappear(By.xpath(RIGHT_PANEL_LOADER_XPATH));
    return this;
  }

  public AccountDashboardPage clickResetFilters() {
    waitForElementToClickable(resetFilters, true).click();

    return this;
  }

  public boolean isOpportunitiesLinkEnabled() {
    return !"true".equalsIgnoreCase(seeAllOpportunitiesLink.getAttribute("disabled"));
  }

  public OpportunitiesPage clickSeeAllOpportunitiesLink() {
    waitForElementToClickable(seeAllOpportunitiesLink, true).click();
    return PageFactory.initElements(driver, OpportunitiesPage.class);
  }

  public enum RightPanelLevel {
    Distributors,
    Accounts,
    SubAccounts,
    Stores
  }

  public enum LeftPanelLevel {
    Brand("Brand"),
    SkuPackage("SKU / PACKAGE");

    private final String header;

    LeftPanelLevel(String header) {
      this.header = header;
    }
  }
}
