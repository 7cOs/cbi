package com.cbrands.pages;

import java.util.Map;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.CacheLookup;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.ui.ExpectedCondition;
import org.openqa.selenium.support.ui.LoadableComponent;
import org.openqa.selenium.support.ui.WebDriverWait;

import com.cbrands.helper.PropertiesCache;

public class MyScorecards extends LoadableComponent<MyScorecards>{
    private Map<String, String> data;
    private WebDriver driver;
    private int timeout = 15;

    @FindBy(css = "md-content._md navbar.ng-isolate-scope div:nth-of-type(6) div.inner-nav-wrapper div div:nth-of-type(2) ul.main-nav li:nth-of-type(2) ul.dropdown li:nth-of-type(2) a")
    @CacheLookup
    private WebElement accountDashboard;

    @FindBy(id = "radio_27")
    @CacheLookup
    private WebElement currentMonthToDate;

    @FindBy(id = "radio_32")
    @CacheLookup
    private WebElement effective;

    @FindBy(id = "select_value_label_21")
    @CacheLookup
    private WebElement fytd;

    @FindBy(id = "select_23")
    @CacheLookup
    private WebElement fytdMtdcytdfytd;

    @FindBy(css = "a[href='/help']")
    @CacheLookup
    private WebElement help;

    @FindBy(css = "a[href='/']")
    @CacheLookup
    private WebElement home;

    @FindBy(id = "select_value_label_22")
    @CacheLookup
    private WebElement l60;

    @FindBy(id = "select_25")
    @CacheLookup
    private WebElement l60L60l90l120;

    @FindBy(id = "radio_28")
    @CacheLookup
    private WebElement lastClosedMonth;

    @FindBy(css = "a[href='/auth/logout']")
    @CacheLookup
    private WebElement logout1;

    @FindBy(css = "button.btn-action")
    @CacheLookup
    private WebElement logout2;

    @FindBy(css = "a[href='/accounts']")
    @CacheLookup
    private WebElement myAccounts;

    @FindBy(css = "md-content._md navbar.ng-isolate-scope div:nth-of-type(6) div.inner-nav-wrapper div div:nth-of-type(2) ul.main-nav li:nth-of-type(2) div.inner span a")
    @CacheLookup
    private WebElement myPerformance;

    @FindBy(css = "md-content._md navbar.ng-isolate-scope div:nth-of-type(6) div.inner-nav-wrapper div div:nth-of-type(2) ul.main-nav li:nth-of-type(2) ul.dropdown li:nth-of-type(1) a")
    @CacheLookup
    private WebElement myScorecards1;

    @FindBy(css = "a.active")
    @CacheLookup
    private WebElement myScorecards2;

    @FindBy(id = "radio_29")
    @CacheLookup
    private WebElement offPremise;

    @FindBy(id = "radio_30")
    @CacheLookup
    private WebElement onPremise;

    @FindBy(css = "a[href='/opportunities']")
    @CacheLookup
    private WebElement opportunities;

    private final String pageLoadedText = "";

    private final String pageUrl = "/scorecards";

    @FindBy(id = "radio_31")
    @CacheLookup
    private WebElement simple;

    @FindBy(css = "a[href='/target-lists']")
    @CacheLookup
    private WebElement targetLists;

    public MyScorecards() {
    }

    public MyScorecards(WebDriver driver) {
        this();
        this.driver = driver;
    }

    public MyScorecards(WebDriver driver, Map<String, String> data) {
        this(driver);
        this.data = data;
    }

    public MyScorecards(WebDriver driver, Map<String, String> data, int timeout) {
        this(driver, data);
        this.timeout = timeout;
    }

    /**
     * Click on Account Dashboard Link.
     *
     * @return the MyScorecards class instance.
     */
    public MyScorecards clickAccountDashboardLink() {
        accountDashboard.click();
        return this;
    }

    /**
     * Click on Help Link.
     *
     * @return the MyScorecards class instance.
     */
    public MyScorecards clickHelpLink() {
        help.click();
        return this;
    }

    /**
     * Click on Home Link.
     *
     * @return the MyScorecards class instance.
     */
    public MyScorecards clickHomeLink() {
        home.click();
        return this;
    }

    /**
     * Click on Logout Button.
     *
     * @return the MyScorecards class instance.
     */
    public MyScorecards clickLogout1Button() {
        logout1.click();
        return this;
    }

    /**
     * Click on Logout Button.
     *
     * @return the MyScorecards class instance.
     */
    public MyScorecards clickLogout2Button() {
        logout2.click();
        return this;
    }

    /**
     * Click on My Accounts Link.
     *
     * @return the MyScorecards class instance.
     */
    public MyScorecards clickMyAccountsLink() {
        myAccounts.click();
        return this;
    }

    /**
     * Click on My Performance Link.
     *
     * @return the MyScorecards class instance.
     */
    public MyScorecards clickMyPerformanceLink() {
        myPerformance.click();
        return this;
    }

    /**
     * Click on My Scorecards Link.
     *
     * @return the MyScorecards class instance.
     */
    public MyScorecards clickMyScorecards1Link() {
        myScorecards1.click();
        return this;
    }

    /**
     * Click on My Scorecards Link.
     *
     * @return the MyScorecards class instance.
     */
    public MyScorecards clickMyScorecards2Link() {
        myScorecards2.click();
        return this;
    }

    /**
     * Click on Opportunities Link.
     *
     * @return the MyScorecards class instance.
     */
    public MyScorecards clickOpportunitiesLink() {
        opportunities.click();
        return this;
    }

    /**
     * Click on Target Lists Link.
     *
     * @return the MyScorecards class instance.
     */
    public MyScorecards clickTargetListsLink() {
        targetLists.click();
        return this;
    }

    /**
     *  Current Month To Date .
     *
     * @return the MyScorecards class instance.
     */
    public MyScorecards currentMonthToDate() {
        return this;
    }

    /**
     *  Effective .
     *
     * @return the MyScorecards class instance.
     */
    public MyScorecards effective() {
        return this;
    }

    /**
     *  Fytd .
     *
     * @return the MyScorecards class instance.
     */
    public MyScorecards fytd() {
        return this;
    }

    /**
     *  Fytd Mtdcytdfytd .
     *
     * @return the MyScorecards class instance.
     */
    public MyScorecards fytdMtdcytdfytd() {
        return this;
    }

    /**
     *  L60 .
     *
     * @return the MyScorecards class instance.
     */
    public MyScorecards l60() {
        return this;
    }

    /**
     *  L60 L60l90l120 .
     *
     * @return the MyScorecards class instance.
     */
    public MyScorecards l60L60l90l120() {
        return this;
    }

    /**
     *  Last Closed Month .
     *
     * @return the MyScorecards class instance.
     */
    public MyScorecards lastClosedMonth() {
        return this;
    }

    /**
     *  Off Premise .
     *
     * @return the MyScorecards class instance.
     */
    public MyScorecards offPremise() {
        return this;
    }

    /**
     *  On Premise .
     *
     * @return the MyScorecards class instance.
     */
    public MyScorecards onPremise() {
        return this;
    }

    /**
     *  Simple .
     *
     * @return the MyScorecards class instance.
     */
    public MyScorecards simple() {
        return this;
    }

    /**
     * Submit the form to target page.
     *
     * @return the MyScorecards class instance.
     */
    public MyScorecards submit() {
        return this;
    }

    /**
     * Verify that the page loaded completely.
     *
     * @return the MyScorecards class instance.
     */
    public MyScorecards verifyPageLoaded() {
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
     * @return the MyScorecards class instance.
     */
    public MyScorecards verifyPageUrl() {
        (new WebDriverWait(driver, timeout)).until(new ExpectedCondition<Boolean>() {
            public Boolean apply(WebDriver d) {
                return d.getCurrentUrl().contains(pageUrl);
            }
        });
        return this;
    }

	@Override
	protected void load() {
		driver.get(PropertiesCache.getInstance().getProperty("qa.host.address"));
	}

	@Override
	protected void isLoaded() throws Error {
		String url = driver.getCurrentUrl();
	    assertTrue(url.contains("scorecards"));
		
	}

	private void assertTrue(boolean contains) {
		// TODO Auto-generated method stub
		
	}

	public String getAllTextFromPage() {
		return driver.findElement(By.tagName("body")).getText();
	}
}
