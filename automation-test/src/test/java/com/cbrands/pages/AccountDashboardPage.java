package com.cbrands.pages;

import com.cbrands.PremiseType;
import com.cbrands.helper.SeleniumUtils;
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
  private static final String PANEL_LOADER_XPATH = "//div[contains(@class, 'loader-wrap')]";
  private static final String BACK_CHEVRON_XPATH = ".//span[contains(@class, 'back-chevron')]";

  private Log log = LogFactory.getLog(AccountDashboardPage.class);

  private final WebDriver driver;

  public final FilterForm filterForm;
  public final BrandSnapshotPanel brandSnapshotPanel;
  public final TopBottomPanel topBottomPanel;
  public final Footer footer;

  @FindBy(how = How.XPATH, using = "//div[contains(@class, 'account-header')]")
  private WebElement header;

  public AccountDashboardPage(WebDriver driver) {
    this.driver = driver;

    this.filterForm = PageFactory.initElements(driver, FilterForm.class);
    this.brandSnapshotPanel = PageFactory.initElements(driver, BrandSnapshotPanel.class);
    this.topBottomPanel = PageFactory.initElements(driver, TopBottomPanel.class);
    this.footer = PageFactory.initElements(driver, Footer.class);
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

  public String getOverviewMarketLabel() {
    final WebElement marketTab = findElement(By.xpath("//div[@class='market-overview clearfix']/div[@class='market']"));
    return marketTab.getText();
  }

  public NotesModal clickNotesButton() {
    final WebElement notesButton = findElement(By.xpath(
      "//*[contains(@class, 'notes-icon enabled')]//a[contains(., 'Notes')]/../.."));
    waitForElementToClickable(notesButton, true).click();

    final NotesModal notesModal = PageFactory.initElements(driver, NotesModal.class);
    notesModal.isLoaded();
    return notesModal;
  }

  public static class FilterForm {
    @FindBy(how = How.XPATH, using = "//inline-search[@type='distributor']")
    private WebElement distributorFilter;

    @FindBy(how = How.XPATH, using = "//md-select[contains(@ng-model, 'retailer')]")
    private WebElement retailerTypeDropdown;

    @FindBy(how = How.XPATH, using = "//inline-search[@type='store']")
    private WebElement retailerStoreFilter;

    @FindBy(css = "md-content._md div div.ng-scope div:nth-of-type(3) div:nth-of-type(2) div.apply-filters button" +
      ".btn-action")
    private WebElement applyFilters;

    @FindBy(how = How.XPATH, using = "//a[contains(@class, 'reset-icon')]")
    private WebElement resetFilters;

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

    public AccountDashboardPage clickRemoveDistributorFilterButton() {
      final WebElement removeDistributorButton = distributorFilter.findElement(
        By.xpath("//input[contains(@class, 'remove-btn visible')]"));
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

    public AccountDashboardPage openRetailerTypeDropdown() {
      waitForElementToClickable(retailerTypeDropdown, true).click();
      return PageFactory.initElements(driver, AccountDashboardPage.class);
    }

    public AccountDashboardPage chooseStoreRetailerType() {
      final By retailerTypeHandle = By.xpath("//md-option[@aria-label='Store']");
      waitForElementToClickable(findElement(retailerTypeHandle), true).click();
      waitForElementToClickable(findElement(retailerTypeHandle), false);
      return PageFactory.initElements(driver, AccountDashboardPage.class);
    }

    public AccountDashboardPage enterRetailerStoreSearchText(String text) {
      final WebElement retailerStoreTextBox = retailerStoreFilter
        .findElement(By.xpath(".//input[@placeholder='Name, Address, TDLinx']"));
      waitForElementToClickable(retailerStoreTextBox, true).click();
      retailerStoreTextBox.sendKeys(text);

      return PageFactory.initElements(driver, AccountDashboardPage.class);
    }

    public AccountDashboardPage clickSearchForRetailerStore() {
      final WebElement searchButton = retailerStoreFilter
        .findElement(By.xpath(".//input[contains(@class, 'submit-btn visible')]"));
      waitForElementToClickable(searchButton, true).click();

      return PageFactory.initElements(driver, AccountDashboardPage.class);
    }

    public AccountDashboardPage selectRetailerStoreByState(String stateLocation, String address) {
      final WebElement selectMe = retailerStoreFilter
        .findElement(By.xpath(".//div[contains(@class, 'results-container')]"))
        .findElement(By.xpath(".//label[contains(@class, 'state-group')][contains(., '" + stateLocation + "')]"))
        .findElement(By.xpath("./following-sibling::li[contains(., '" + address + "')]"));

      scrollToAndClick(selectMe);

      return PageFactory.initElements(driver, AccountDashboardPage.class);
    }

    public AccountDashboardPage waitForStoreLoaderToDisappear() {
      waitForElementToDisappear(By.xpath("//md-progress-circular"));
      return PageFactory.initElements(driver, AccountDashboardPage.class);
    }

    public AccountDashboardPage clickApplyFilters() {
      waitForElementToClickable(applyFilters, true);
      waitForVisibleFluentWait(applyFilters).click();

      return PageFactory.initElements(driver, AccountDashboardPage.class);
    }

    public AccountDashboardPage clickResetFilters() {
      waitForElementToClickable(resetFilters, true).click();

      return PageFactory.initElements(driver, AccountDashboardPage.class);
    }
  }

  public static class BrandSnapshotPanel {
    private static final int CUSTOM_LOADER_TIMEOUT = SeleniumUtils.DEFAULT_WAIT_TIME * 2;

    private static final String CONTAINER_XPATH = "//div[contains(@class, 'scorecard-table')]";
    private static final String LOADER_XPATH = CONTAINER_XPATH + PANEL_LOADER_XPATH;
    private static final String ROW_XPATH = ".//md-tab-content[contains(@class, 'md-active')]//tr[@ng-repeat]";

    @FindBy(how = How.XPATH, using = CONTAINER_XPATH)
    private WebElement panelContainer;

    private final WebDriver driver;

    public BrandSnapshotPanel(WebDriver driver) {
      this.driver = driver;
    }

    public AccountDashboardPage drillIntoFirstRow() {
      scrollToAndClick(panelContainer.findElement(By.xpath(ROW_XPATH)));
      return PageFactory.initElements(driver, AccountDashboardPage.class);
    }

    public AccountDashboardPage drillUp() {
      final WebElement backButton = panelContainer.findElement(By.xpath(BACK_CHEVRON_XPATH));
      waitForVisibleFluentWait(backButton);
      waitForElementToClickable(backButton, true).click();

      return PageFactory.initElements(driver, AccountDashboardPage.class);
    }

    public boolean areResultsLoadedFor(DrillLevel drillLevel) {
      boolean resultsAreLoaded;

      try {
        waitForVisibleFluentWait(panelContainer.findElement(By.xpath(ROW_XPATH)));
        final WebElement panelHeader = panelContainer.findElement(By.xpath(".//th//span[@aria-hidden='false']"));
        resultsAreLoaded = drillLevel.header.equalsIgnoreCase(panelHeader.getText());
      } catch (NoSuchElementException e) {
        resultsAreLoaded = false;
      }

      return resultsAreLoaded;
    }

    public AccountDashboardPage waitForLoaderToDisappear() {
      waitForElementToDisappear(By.xpath(LOADER_XPATH), CUSTOM_LOADER_TIMEOUT);
      return PageFactory.initElements(driver, AccountDashboardPage.class);
    }

    public enum DrillLevel {
      Brand("Brand"),
      SkuPackage("SKU / PACKAGE");

      private final String header;

      DrillLevel(String header) {
        this.header = header;
      }
    }

  }

  public static class TopBottomPanel {
    private static final String CONTAINER_XPATH = "//div[contains(@class, 'scorecard-chart')]";
    private static final String ROW_XPATH = ".//p[contains(@class, 'data-brand')]";
    private static final String LOADER_XPATH = CONTAINER_XPATH + PANEL_LOADER_XPATH;

    @FindBy(how = How.XPATH, using = CONTAINER_XPATH)
    private WebElement panelContainer;

    private final WebDriver driver;

    public TopBottomPanel(WebDriver driver) {
      this.driver = driver;
    }

    public String getSelectorContextLabel() {
      return findElement(By.xpath("//div[@class='section-header-user']/span[@class='ng-binding']")).getText();
    }

    public String getHeaderTitle() {
      return findElement(By.xpath("//p[contains(@class, 'market')]")).getText();
    }

    public AccountDashboardPage drillIntoFirstRow() {
      scrollToAndClick(panelContainer.findElement(By.xpath(ROW_XPATH)));
      return PageFactory.initElements(driver, AccountDashboardPage.class);
    }

    public AccountDashboardPage drillUp() {
      final WebElement backButton = panelContainer.findElement(By.xpath(BACK_CHEVRON_XPATH));
      waitForVisibleFluentWait(backButton);
      waitForElementToClickable(backButton, true).click();

      return PageFactory.initElements(driver, AccountDashboardPage.class);
    }

    public boolean areResultsLoadedFor(DrillLevel drillLevel) {
      boolean resultsAreLoaded;

      try {
        waitForElementToDisappear(By.xpath(LOADER_XPATH));
        waitForVisibleFluentWait(panelContainer.findElement(By.xpath(ROW_XPATH)));

        final WebElement panelHeader = panelContainer.findElement(By.xpath(".//div[@class='widget-subheader-item']/p"));
        resultsAreLoaded = drillLevel.name().equalsIgnoreCase(panelHeader.getText());
      } catch (NoSuchElementException e) {
        resultsAreLoaded = false;
      }

      return resultsAreLoaded;
    }

    public AccountDashboardPage waitForLoaderToDisappear() {
      waitForElementToDisappear(By.xpath(LOADER_XPATH));
      return PageFactory.initElements(driver, AccountDashboardPage.class);
    }

    public enum DrillLevel {
      Distributors,
      Accounts,
      SubAccounts,
      Stores
    }

  }

  public static class Footer {
    @FindBy(how = How.XPATH, using = "//a[contains(., 'See All Opportunities')]")
    private WebElement seeAllOpportunitiesLink;

    private final WebDriver driver;

    public Footer(WebDriver driver) {
      this.driver = driver;
    }

    public boolean isOpportunitiesFooterLinkEnabled() {
      return !"true".equalsIgnoreCase(seeAllOpportunitiesLink.getAttribute("disabled"));
    }

    public OpportunitiesPage clickSeeAllOpportunitiesFooterLink() {
      waitForElementToClickable(seeAllOpportunitiesLink, true).click();
      return PageFactory.initElements(driver, OpportunitiesPage.class);
    }
  }

  public AccountDashboardPage applyFiltersForStore(String storeAccountName, String stateLocation, String address) {
    return this.filterForm.openRetailerTypeDropdown()
      .filterForm.chooseStoreRetailerType()
      .filterForm.enterRetailerStoreSearchText(storeAccountName)
      .filterForm.clickSearchForRetailerStore()
      .filterForm.waitForStoreLoaderToDisappear()
      .filterForm.selectRetailerStoreByState(stateLocation, address)
      .filterForm.clickApplyFilters();
  }

}
