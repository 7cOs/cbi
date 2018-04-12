package com.cbrands.pages;
import static com.cbrands.helper.SeleniumUtils.findElement;
import static com.cbrands.helper.SeleniumUtils.refresh;
import static com.cbrands.helper.SeleniumUtils.waitForCondition;
import static com.cbrands.helper.SeleniumUtils.waitForVisible;
import static com.cbrands.helper.SeleniumUtils.waitForVisibleFluentWait;

import java.util.List;
import java.util.Map;

import com.cbrands.pages.opportunities.Opportunities;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.CacheLookup;
import org.openqa.selenium.support.FindAll;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedCondition;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

/**
 * @deprecated Please use the AccountDashboardPage page object instead.
 */
@Deprecated
public class AccountDashboard {
    private Map<String, String> data;
    private WebDriver driver;
    private int timeout = 15;

    @FindBy(css = "md-content._md navbar.ng-isolate-scope div:nth-of-type(6) div.inner-nav-wrapper div div:nth-of-type(2) ul.main-nav li:nth-of-type(2) ul.dropdown li:nth-of-type(2) a")
    @CacheLookup
    private WebElement accountDashboard;

    @FindBy(css = "md-content._md div div.ng-scope list.account-dashboard-opps.ng-scope.ng-isolate-scope div:nth-of-type(2) span span.ng-scope button:nth-of-type(1)")
    @CacheLookup
    private WebElement addToTargetList;

    @FindBy(id = "radio_146")
    @CacheLookup
    private WebElement all;

    /**
     * @deprecated Please use the AccountDashboardPage page object instead
     */
    @Deprecated
    @FindBy(css = "md-content._md div div.ng-scope div:nth-of-type(3) div:nth-of-type(2) div.apply-filters button.btn-action")
    private WebElement applyFilters;

    @FindBy(id = "select_value_label_117")
    @CacheLookup
    private WebElement chain;

    @FindBy(id = "select_126")
    @CacheLookup
    private WebElement chainStorechain;

    @FindBy(css = "button.icon.narrow-icon.collapse-all")
    @CacheLookup
    private WebElement collapseAll;

    @FindBy(css = "md-content._md div div.ng-scope list.account-dashboard-opps.ng-scope.ng-isolate-scope div:nth-of-type(2) span span.ng-scope button:nth-of-type(2)")
    @CacheLookup
    private WebElement copyToTargetList;

    @FindBy(id = "radio_138")
    @CacheLookup
    private WebElement currentMonthToDate;

    @FindBy(id = "select_value_label_119")
    @CacheLookup
    private WebElement depletions;

    @FindBy(id = "select_130")
    @CacheLookup
    private WebElement depletionsDepletionsdistributionSimpledistributionEffectivevelocity;

    @FindBy(id = "select_value_label_118")
    private WebElement distributionSimple;

    @FindBy(xpath = "//div[contains(.,'Distribution (effective)')]")
    private WebElement distributionEffective;

    @FindAll({@FindBy(css="span.md-select-icon")})
    private List<WebElement> dropdownIcon;

    @FindAll({@FindBy(css="md-select-value.md-select-value")})
    private List<WebElement> dropdown;

    @FindAll({@FindBy(xpath="//md-option[contains(.,'Velocity')]")})
    private List<WebElement> velocity;

    @FindBy(id = "select_128")
    @CacheLookup
    private WebElement distributionSimpleDistributionSimplevelocity;

    @FindBy(id = "select_value_label_121")
    @CacheLookup
    private WebElement distributors;

    @FindBy(id = "select_134")
    @CacheLookup
    private WebElement distributorsDistributorsaccountssubaccountsstores;

    @FindBy(css = "button.icon.narrow-icon.expand-all")
    @CacheLookup
    private WebElement expandAll;

    @FindBy(id = "select_value_label_115")
    @CacheLookup
    private WebElement fytd;

    @FindBy(id = "select_122")
    @CacheLookup
    private WebElement fytdMtdcytdfytd;

    @FindBy(css = "a[href='/help']")
    @CacheLookup
    private WebElement help;

    @FindBy(css = "a[href='/']")
    @CacheLookup
    private WebElement home;

    @FindBy(id = "select_value_label_116")
    @CacheLookup
    private WebElement l60Days;

    @FindBy(id = "select_124")
    @CacheLookup
    private WebElement l60DaysL60Daysl90Daysl120Days;

    @FindBy(id = "radio_139")
    @CacheLookup
    private WebElement deprectated_lastClosedMonth;

    @FindAll({@FindBy(css="md-radio-button[aria-label='Ending Time Period']")})
    private List<WebElement> endingTimePeriodRadioButtons;

    @FindBy(css = "a[href='/auth/logout']")
    @CacheLookup
    private WebElement logout1;

    @FindBy(css = "#menu_container_1 md-menu-content div.nav-flyout div.content a button.btn-action")
    @CacheLookup
    private WebElement logout2;

    @FindBy(css = "a.active")
    @CacheLookup
    private WebElement myAccounts;

    @FindBy(css = "md-content._md navbar.ng-isolate-scope div:nth-of-type(6) div.inner-nav-wrapper div div:nth-of-type(2) ul.main-nav li:nth-of-type(2) div.inner span a")
    @CacheLookup
    private WebElement myPerformance;

    @FindBy(css = "md-content._md navbar.ng-isolate-scope div:nth-of-type(6) div.inner-nav-wrapper div div:nth-of-type(2) ul.main-nav li:nth-of-type(2) ul.dropdown li:nth-of-type(1) a")
    @CacheLookup
    private WebElement myScorecards1;

    @FindBy(css = "a[href='/scorecards']")
    @CacheLookup
    private WebElement myScorecards2;

    @FindBy(css = "md-radio-button[aria-label='Off-Premise']")
    private WebElement offpremise;

    @FindBy(css = "md-radio-button[aria-label='On-Premise']")
    private WebElement onpremise;

    @FindBy(css = "a[href='/opportunities']")
    @CacheLookup
    private WebElement opportunities;

    private final String pageLoadedText = "Select a premise type followed by a retailer and/or distributor to view opportunities";

    private final String pageUrl = "/accounts";

    @FindBy(css = "md-content._md div div.ng-scope div:nth-of-type(3) div:nth-of-type(1) div:nth-of-type(3) inline-search.ng-isolate-scope div.inline-search input:nth-of-type(1)")
    @CacheLookup
    private WebElement pleaseInputAtLeast3Characters1;

    @FindBy(css = "md-content._md div div.ng-scope div:nth-of-type(3) div:nth-of-type(1) div:nth-of-type(3) inline-search.ng-isolate-scope div.inline-search input:nth-of-type(2)")
    @CacheLookup
    private WebElement pleaseInputAtLeast3Characters2;

    @FindBy(css = "md-content._md div div.ng-scope div:nth-of-type(3) div:nth-of-type(1) div:nth-of-type(5) div.retailer.dropdown-filter div:nth-of-type(2) inline-search.ng-scope.ng-isolate-scope div.inline-search input:nth-of-type(1)")
    @CacheLookup
    private WebElement pleaseInputAtLeast3Characters3;

    @FindBy(css = "md-content._md div div.ng-scope div:nth-of-type(3) div:nth-of-type(1) div:nth-of-type(5) div.retailer.dropdown-filter div:nth-of-type(2) inline-search.ng-scope.ng-isolate-scope div.inline-search input:nth-of-type(2)")
    @CacheLookup
    private WebElement pleaseInputAtLeast3Characters4;

    @FindBy(css = "md-content._md div div.ng-scope list.account-dashboard-opps.ng-scope.ng-isolate-scope div:nth-of-type(2) span span.ng-scope button:nth-of-type(3)")
    @CacheLookup
    private WebElement remove;

    @FindBy(css = "a.accent.reset-icon")
    @CacheLookup
    private WebElement reset;

    @FindBy(css = "md-content._md div div.ng-scope h3.top-opportunities-header.ng-scope a.accent")
    private WebElement seeAllOpportunities;

    @FindBy(css = "button.icon.select-all.ng-binding")
    @CacheLookup
    private WebElement selectAll;

    @FindBy(css = "a[href='/target-lists']")
    @CacheLookup
    private WebElement targetLists;

    @FindBy(id = "select_value_label_120")
    @CacheLookup
    private WebElement top10Trend;

    @FindBy(id = "select_132")
    @CacheLookup
    private WebElement top10TrendTop10Valuestop;

    @FindAll({@FindBy(css="md-radio-button[aria-label='Trend']")})
    private List<WebElement> trendRadioButtons;

    @FindBy(css="th.top.title-col.brand-name-column>p.accent.bold.left.single-line")
    private WebElement allBrandsFirstColumnHeader;

    @FindBy(css="th.top.other-columns>p.accent.ng-binding")
    private WebElement allBrandsThirdColumnHeader;

    @FindBy(css="th.dark>p.accent.no-transform.ng-binding")
    private WebElement depletionsColumnHeader;

    @FindAll({@FindBy(css="p.accent.ng-binding")})
    private List<WebElement> headers;

    @FindBy(css="input[placeholder='Name']")
    private WebElement distributorSearchBox;

    @FindBy(css="input.submit-btn.visible")
    private WebElement searchButton;

    @FindAll(@FindBy(css="span.result.ng-binding"))
    private List <WebElement> searchResults;

    @FindBy(xpath="//label[contains(.,'Select a premise type followed by a retailer and/or distributor to view opportunities')]")
    private WebElement labelBelowOpportunitiesLink;

    @FindBy(css="span[class='back-chevron ng-scope']")
    private WebElement backChevronArrow;

    public AccountDashboard() {
    }

    public AccountDashboard(WebDriver driver) {
        this();
        this.driver = driver;
    }

    public AccountDashboard(WebDriver driver, Map<String, String> data) {
        this(driver);
        this.data = data;
    }

    public AccountDashboard(WebDriver driver, Map<String, String> data, int timeout) {
        this(driver, data);
        this.timeout = timeout;
    }

    /**
     *  All .
     *
     * @return the AccountDashboard class instance.
     */
    public AccountDashboard all() {
        return this;
    }

    /**
     *  Chain .
     *
     * @return the AccountDashboard class instance.
     */
    public AccountDashboard chain() {
        return this;
    }

    /**
     *  Chain Storechain .
     *
     * @return the AccountDashboard class instance.
     */
    public AccountDashboard chainStorechain() {
        return this;
    }

    /**
     * Click on Account Dashboard Link.
     *
     * @return the AccountDashboard class instance.
     */
    public AccountDashboard clickAccountDashboardLink() {
        accountDashboard.click();
        return this;
    }

    /**
     * Click on Add To Target List Button.
     *
     * @return the AccountDashboard class instance.
     */
    public AccountDashboard clickAddToTargetListButton() {
        addToTargetList.click();
        return this;
    }

    /**
     * @deprecated Please use the method found in the AccountDashBoardPage page object
     *
     * Click on Apply Filters Button.
     *
     * @return the AccountDashboard class instance.
     */
    @Deprecated
    public AccountDashboard clickApplyFiltersButton() {
      PageFactory.initElements(driver, AccountDashboardPage.class)
        .filterForm.clickApplyFilters();
      return this;
    }

    /**
     * Click on Collapse All Button.
     *
     * @return the AccountDashboard class instance.
     */
    public AccountDashboard clickCollapseAllButton() {
        collapseAll.click();
        return this;
    }

    /**
     * Click on Copy To Target List Button.
     *
     * @return the AccountDashboard class instance.
     */
    public AccountDashboard clickCopyToTargetListButton() {
        copyToTargetList.click();
        return this;
    }

    /**
     * Click on Expand All Button.
     *
     * @return the AccountDashboard class instance.
     */
    public AccountDashboard clickExpandAllButton() {
        expandAll.click();
        return this;
    }

    /**
     * Click on Help Link.
     *
     * @return the AccountDashboard class instance.
     */
    public AccountDashboard clickHelpLink() {
        help.click();
        return this;
    }

    /**
     * Click on Home Link.
     *
     * @return the AccountDashboard class instance.
     */
    public AccountDashboard clickHomeLink() {
        home.click();
        return this;
    }

    /**
     * Click on Logout Button.
     *
     * @return the AccountDashboard class instance.
     */
    public AccountDashboard clickLogout1Button() {
        logout1.click();
        return this;
    }

    /**
     * Click on Logout Button.
     *
     * @return the AccountDashboard class instance.
     */
    public AccountDashboard clickLogout2Button() {
        logout2.click();
        return this;
    }

    /**
     * Click on My Accounts Link.
     *
     * @return the AccountDashboard class instance.
     */
    public AccountDashboard clickMyAccountsLink() {
        myAccounts.click();
        return this;
    }

    /**
     * Click on My Performance Link.
     *
     * @return the AccountDashboard class instance.
     */
    public AccountDashboard clickMyPerformanceLink() {
        myPerformance.click();
        return this;
    }

    /**
     * Click on My Scorecards Link.
     *
     * @return the AccountDashboard class instance.
     */
    public AccountDashboard clickMyScorecards1Link() {
        myScorecards1.click();
        return this;
    }

    /**
     * Click on My Scorecards Link.
     *
     * @return the AccountDashboard class instance.
     */
    public AccountDashboard clickMyScorecards2Link() {
        myScorecards2.click();
        return this;
    }

    /**
     * Click on Opportunities Link.
     *
     * @return the AccountDashboard class instance.
     */
    public AccountDashboard clickOpportunitiesLink() {
        opportunities.click();
        return this;
    }

    /**
     * Click on Remove Button.
     *
     * @return the AccountDashboard class instance.
     */
    public AccountDashboard clickRemoveButton() {
        remove.click();
        return this;
    }

    /**
     * Click on Reset Link.
     *
     * @return the AccountDashboard class instance.
     */
    public AccountDashboard clickResetLink() {
        reset.click();
        return this;
    }

    /**
     * Click on See All Opportunities Link.
     *
     * @return the Opportunities class instance.
     */
    public Opportunities clickSeeAllOpportunitiesLink() {
    		waitForVisibleFluentWait(seeAllOpportunities).click();
    		return PageFactory.initElements(driver, Opportunities.class);
    }

    /**
     * Click on Select All Button.
     *
     * @return the AccountDashboard class instance.
     */
    public AccountDashboard clickSelectAllButton() {
        selectAll.click();
        return this;
    }

    /**
     * Click on Target Lists Link.
     *
     * @return the AccountDashboard class instance.
     */
    public AccountDashboard clickTargetListsLink() {
        targetLists.click();
        return this;
    }

    /**
     *  Current Month To Date .
     *
     * @return the AccountDashboard class instance.
     */
    public AccountDashboard currentMonthToDate() {
        return this;
    }

    /**
     *  Depletions .
     *
     * @return the AccountDashboard class instance.
     */
    public AccountDashboard depletions() {
        return this;
    }

    /**
     *  Depletions Depletionsdistribution Simpledistribution Effectivevelocity .
     *
     * @return the AccountDashboard class instance.
     */
    public AccountDashboard depletionsDepletionsdistributionSimpledistributionEffectivevelocity() {
        return this;
    }

    /**
     *  Distribution Simple .
     *
     * @return the AccountDashboard class instance.
     */
    public AccountDashboard distributionSimple() {
        return this;
    }

    /**
     *  Distribution Simple Distribution Simplevelocity .
     *
     * @return the AccountDashboard class instance.
     */
    public AccountDashboard distributionSimpleDistributionSimplevelocity() {
        return this;
    }

    /**
     *  Distributors .
     *
     * @return the AccountDashboard class instance.
     */
    public AccountDashboard distributors() {
        return this;
    }

    /**
     *  Distributors Distributorsaccountssubaccountsstores .
     *
     * @return the AccountDashboard class instance.
     */
    public AccountDashboard distributorsDistributorsaccountssubaccountsstores() {
        return this;
    }

    /**
     * Fill every fields in the page.
     *
     * @return the AccountDashboard class instance.
     */
    public AccountDashboard fill() {
        setPleaseInputAtLeast3Characters1TextField();
        setPleaseInputAtLeast3Characters2TextField();
        setPleaseInputAtLeast3Characters3TextField();
        setPleaseInputAtLeast3Characters4TextField();
        return this;
    }

    /**
     * Fill every fields in the page and submit it to target page.
     *
     * @return the AccountDashboard class instance.
     */
    public AccountDashboard fillAndSubmit() {
        fill();
        return submit();
    }

    /**
     *  Fytd .
     *
     * @return the AccountDashboard class instance.
     */
    public AccountDashboard fytd() {
        return this;
    }

    /**
     *  Fytd Mtdcytdfytd .
     *
     * @return the AccountDashboard class instance.
     */
    public AccountDashboard fytdMtdcytdfytd() {
        return this;
    }

    /**
     *  L60 Days .
     *
     * @return the AccountDashboard class instance.
     */
    public AccountDashboard l60Days() {
        return this;
    }

    /**
     *  L60 Days L60 Daysl90 Daysl120 Days .
     *
     * @return the AccountDashboard class instance.
     */
    public AccountDashboard l60DaysL60Daysl90Daysl120Days() {
        return this;
    }

    /**
     *  Last Closed Month .
     *
     * @return the AccountDashboard class instance.
     */
    public AccountDashboard lastClosedMonth() {
        return this;
    }

    /**
     *  Offpremise .
     *
     * @return the AccountDashboard class instance.
     */
    public AccountDashboard clickOffPremise() {
    	waitForVisibleFluentWait(offpremise).click();
        return this;
    }

    /**
     *  Onpremise .
     *
     * @return the AccountDashboard class instance.
     */
    public AccountDashboard clickOnPremise() {
    	waitForVisibleFluentWait(onpremise).click();
        return this;
    }

    /**
     * Set default value to Please Input At Least 3 Characters. Text field.
     *
     * @return the AccountDashboard class instance.
     */
    public AccountDashboard setPleaseInputAtLeast3Characters1TextField() {
        return setPleaseInputAtLeast3Characters1TextField(data.get("PLEASE_INPUT_AT_LEAST_3_CHARACTERS__1"));
    }

    /**
     * Set value to Please Input At Least 3 Characters. Text field.
     *
     * @return the AccountDashboard class instance.
     */
    public AccountDashboard setPleaseInputAtLeast3Characters1TextField(String pleaseInputAtLeast3Characters1Value) {
        pleaseInputAtLeast3Characters1.sendKeys(pleaseInputAtLeast3Characters1Value);
        return this;
    }

    /**
     * Set default value to Please Input At Least 3 Characters. Text field.
     *
     * @return the AccountDashboard class instance.
     */
    public AccountDashboard setPleaseInputAtLeast3Characters2TextField() {
        return setPleaseInputAtLeast3Characters2TextField(data.get("PLEASE_INPUT_AT_LEAST_3_CHARACTERS__2"));
    }

    /**
     * Set value to Please Input At Least 3 Characters. Text field.
     *
     * @return the AccountDashboard class instance.
     */
    public AccountDashboard setPleaseInputAtLeast3Characters2TextField(String pleaseInputAtLeast3Characters2Value) {
        pleaseInputAtLeast3Characters2.sendKeys(pleaseInputAtLeast3Characters2Value);
        return this;
    }

    /**
     * Set default value to Please Input At Least 3 Characters. Text field.
     *
     * @return the AccountDashboard class instance.
     */
    public AccountDashboard setPleaseInputAtLeast3Characters3TextField() {
        return setPleaseInputAtLeast3Characters3TextField(data.get("PLEASE_INPUT_AT_LEAST_3_CHARACTERS__3"));
    }

    /**
     * Set value to Please Input At Least 3 Characters. Text field.
     *
     * @return the AccountDashboard class instance.
     */
    public AccountDashboard setPleaseInputAtLeast3Characters3TextField(String pleaseInputAtLeast3Characters3Value) {
        pleaseInputAtLeast3Characters3.sendKeys(pleaseInputAtLeast3Characters3Value);
        return this;
    }

    /**
     * Set default value to Please Input At Least 3 Characters. Text field.
     *
     * @return the AccountDashboard class instance.
     */
    public AccountDashboard setPleaseInputAtLeast3Characters4TextField() {
        return setPleaseInputAtLeast3Characters4TextField(data.get("PLEASE_INPUT_AT_LEAST_3_CHARACTERS__4"));
    }

    /**
     * Set value to Please Input At Least 3 Characters. Text field.
     *
     * @return the AccountDashboard class instance.
     */
    public AccountDashboard setPleaseInputAtLeast3Characters4TextField(String pleaseInputAtLeast3Characters4Value) {
        pleaseInputAtLeast3Characters4.sendKeys(pleaseInputAtLeast3Characters4Value);
        return this;
    }

    /**
     * Submit the form to target page.
     *
     * @return the AccountDashboard class instance.
     */
    public AccountDashboard submit() {
        return this;
    }

    /**
     *  Top 10 Trend .
     *
     * @return the AccountDashboard class instance.
     */
    public AccountDashboard top10Trend() {
        return this;
    }

    /**
     *  Top 10 Trend Top 10 Valuestop 10 Trendbottom 10 Valuesbottom 10 Trend .
     *
     * @return the AccountDashboard class instance.
     */
    public AccountDashboard top10TrendTop10Valuestop() {
        return this;
    }

    /**
     * Verify that the page loaded completely.
     *
     * @return the AccountDashboard class instance.
     */
    public AccountDashboard verifyPageLoaded() {
        (new WebDriverWait(driver, timeout)).until(new ExpectedCondition<Boolean>() {
            public Boolean apply(WebDriver d) {
                return d.getPageSource().contains(pageLoadedText);
            }
        });
        return this;
    }

    /**
     * Verify that current page URL matches the expected URL.
     *
     * @return the AccountDashboard class instance.
     */
    public AccountDashboard verifyPageUrl() {
        (new WebDriverWait(driver, timeout)).until(new ExpectedCondition<Boolean>() {
            public Boolean apply(WebDriver d) {
                return d.getCurrentUrl().contains(pageUrl);
            }
        });
        return this;
    }

    /**
     *  Vs Abp .
     *
     * @return the AccountDashboard class instance.
     */
    public AccountDashboard vsAbp() {
        return this;
    }

    /**
     *  Vs Ya .
     *
     * @return the AccountDashboard class instance.
     */
    public AccountDashboard vsYa() {
        return this;
    }

    /**
     * Click on a brand name under 'All Brands' table.
     *
     * @return the AccountDashboard class instance.
     */
    public AccountDashboard clickBrand(String brand){
    	findElement(By.cssSelector("p.brands.ng-binding")).click();
    	WebElement brandName = findElement(By.xpath("//td[contains(.,'"+brand+"')]"));
    	waitForVisibleFluentWait(brandName).click();
    	waitForVisibleFluentWait(distributionEffective);
    	return this;
    }

    public AccountDashboard clickBackChevronArrow(){
    	waitForVisibleFluentWait(backChevronArrow).click();
    	return this;
    }

    public AccountDashboard selectVelocity(){
    	JavascriptExecutor je = (JavascriptExecutor) driver;
    	je.executeScript("arguments[0].scrollIntoView(true);",distributionEffective);
    	dropdownIcon.get(3).click();
    	waitForVisibleFluentWait(velocity.get(1)).click();
    	return this;
    }

    /**
     * Page refresh.
     *
     * @return the AccountDashboard class instance.
     */
    public AccountDashboard pageRefresh(){
    	refresh();
    	return this;
    }

    public AccountDashboard selectDepletionTimePeriod(String value){
    	JavascriptExecutor je = (JavascriptExecutor) driver;
    	je.executeScript("arguments[0].scrollIntoView(false);",dropdown.get(0));
    	waitForVisibleFluentWait(dropdown.get(0)).click();
    	waitForVisible(By.cssSelector("md-option[aria-label='"+value+"']"));
    	findElement(By.cssSelector("md-option[aria-label='"+value+"']")).click();
    	return this;
    }

    public AccountDashboard selectDistributionTimePeriod(String value){
    	JavascriptExecutor je = (JavascriptExecutor) driver;
    	je.executeScript("arguments[0].scrollIntoView(false);",dropdown.get(1));
    	waitForVisibleFluentWait(dropdown.get(1)).click();
    	waitForVisible(By.cssSelector("md-option[aria-label='"+value+"']"));
    	findElement(By.cssSelector("md-option[aria-label='"+value+"']")).click();
    	return this;
    }

    /**
     *
     * @return the first column header text under 'All Brands' table as a string
     */
    public String allBrandsFirstColumnHeaderText(){
    	return allBrandsFirstColumnHeader.getText();
    }

    /**
    *
    * @return the third column header text under 'All Brands' table as a string
    */
    public String allBrandsThirdColumnHeaderText(){
    	return allBrandsThirdColumnHeader.getText();
    }

    /**
     * @return the Depletions column header text as a string
     */
    public String depletionsColumnHeaderText(){
    	return depletionsColumnHeader.getText();
    }

    /**
     * Click Trend ABP radio button
     *
     * @return the AccountDashboard class instance
     */
    public AccountDashboard selectTrendABP(){
        WebElement vsAbp = trendRadioButtons.get(1);
    	vsAbp.click();
    	return this;
    }

    /**
     * Click last closed month radio button
     *
     * @return the AccountDashboard class instance
     */
    public AccountDashboard selectLastClosedMonth(){
        WebElement lastClosedMonth = endingTimePeriodRadioButtons.get(1);
        lastClosedMonth.click();
    	return this;
    }

    public String depletionsDaysHeaderText(){
    	WebElement element = headers.get(3);
    	return element.getText();
    }

    public String depletionsTrendHeaderText(){
    	WebElement element = headers.get(2);
    	return element.getText();
    }

    public String distributionsTrendHeaderText(){
    	WebElement element = headers.get(4);
    	return element.getText();
    }

    public String depletionsTimePeriodDropdownOptions(){
    	waitForVisibleFluentWait(dropdown.get(0)).click();
    	WebElement element = findElement(By.cssSelector("div.md-select-menu-container.md-active.md-clickable"));
    	waitForCondition(ExpectedConditions.attributeToBe(element, "aria-hidden", "false"),10);
    	String options = element.getText().replaceAll("\n", "");//Getting the dropdown options and then removing the new line characters
    	waitForVisibleFluentWait(dropdown.get(0)).click();//Closing the dropdown
    	return options;
    }

    public String distributionsTimePeriodDropdownOptions(){
    	waitForVisibleFluentWait(dropdown.get(1)).click();
    	String distributionOptions = dropdown.get(1).getText();
    	waitForVisibleFluentWait(dropdown.get(1)).click();//Closing the dropdown
    	return distributionOptions;
    }

    public Boolean verifyTrendvsYA(){
        WebElement vsYA = trendRadioButtons.get(0);
    	return Boolean.valueOf(vsYA.getAttribute("aria-checked"));
    }

    public Boolean verifyDefaultEndingTimePeriod(){
        WebElement currentMonthToDate = endingTimePeriodRadioButtons.get(0);
        return Boolean.valueOf(currentMonthToDate.getAttribute("aria-checked"));
    }

    public String depletionsTimePeriodDefaultOption(){
    	waitForVisibleFluentWait(dropdown.get(0));
    	String deafultDepletionOption = dropdown.get(0).getText();
    	return deafultDepletionOption;
    }

    public String distributionTimePeriodDefaultOption(){
    	waitForVisibleFluentWait(dropdown.get(1));
    	String deafultDistributionOption = dropdown.get(1).getText();
    	return deafultDistributionOption;
    }

    /**
     * 'See all' opportunities link state.
     *
     * @return the link attribute 'disabled'
     */
    public String seeAllOpportunitiesLinkState(){
    	return seeAllOpportunities.getAttribute("disabled");
    }


    public AccountDashboard searchDistributor(String name){
    	waitForVisibleFluentWait(distributorSearchBox).clear();
    	distributorSearchBox.sendKeys(name);
    	waitForVisibleFluentWait(searchButton).click();
    	waitForVisibleFluentWait(searchResults.get(0)).click();
    	return this;
    }

    /**
     * @return the text below the 'See All Opportunities' link
     */
    public String textBelowOpportunitiesLink(){
    	return labelBelowOpportunitiesLink.getText();
    }

}
