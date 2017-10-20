package com.cbrands.pages;

import static com.cbrands.helper.SeleniumUtils.findElement;
import static com.cbrands.helper.SeleniumUtils.findElements;
import static com.cbrands.helper.SeleniumUtils.refresh;
import static com.cbrands.helper.SeleniumUtils.waitForVisible;
import static com.cbrands.helper.SeleniumUtils.waitForVisibleFluentWait;

import java.util.ArrayList;
import java.util.List;

import com.cbrands.pages.opportunities.Opportunities;
import com.cbrands.pages.targetList.TargetList;
import com.cbrands.pages.targetList.TargetListListingsPage;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.How;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.LoadableComponent;
import org.testng.Assert;

import com.cbrands.helper.PropertiesCache;

/**
 * @deprecated Please use the {@link HomePage} page object instead.
 */
@Deprecated
public class Home extends LoadableComponent<Home>{

	private Log log = LogFactory.getLog(Home.class);

	WebDriver driver;

	@FindBy(how = How.XPATH, using = "//greeting//h1")
	private WebElement userInfo;

	//@FindBy(how = How.LINK_TEXT, using = "Opportunities")
	@FindBy(how = How.CSS, using = "a[href='/opportunities']")
	private WebElement opportunities;

	@FindBy(how = How.CSS, using = "a[href='/target-lists']")
	private WebElement TargetListLink;

	private WebElement opportunityType;
	@FindBy(how = How.CSS, using = "md-select[aria-label='Opportunity Type Dropdown: All Types']")
	private WebElement opportunityTypeDropDown;
	@FindBy(how=How.CSS, using = "md-option[value='All Types']")
	public WebElement opportunityTypeAllTypes;
	@FindBy(how = How.XPATH, using = "//md-radio-button[contains(.,'Off-Premise')]")
	private WebElement offPremise;
	@FindBy(how = How.XPATH, using = "//md-radio-button[contains(.,'On-Premise')]")
	private WebElement onPremise;
	@FindBy(how = How.XPATH, using = "//input[@placeholder='By brand or SKU']")
	private WebElement brandMasterSku;
  @FindBy(how = How.XPATH, using = "//input[@placeholder='Store, account, or " +
    "subaccount name']")
	private WebElement retailer;
	@FindBy(how = How.XPATH, using = "//input[@placeholder='Name']")
	private WebElement distributor;
	@FindBy(how = How.XPATH, using = "//button[contains(.,'Find Opportunities')]")
	private WebElement submitFindOpportunities;

	@FindBy(how = How.CSS, using = "a.nav-icon.settings")
	private WebElement settingsIcon;

	@FindBy(how = How.XPATH, using = "//button[contains(.,'Logout')]")
	private WebElement logOutButton;

	@FindBy(how = How.XPATH, using = "//md-tab-item/span[text()='Shared with Me']")
	private WebElement sharedWithMeLink;

	@FindBy(how = How.XPATH, using = "//a[contains(.,'My Performance')]")
	private WebElement myPerformanceLink;

	@FindBy(how = How.XPATH, using = "//a[contains(.,'My Scorecards')]")
	private WebElement myScoreCards;

  public Home(WebDriver driver) {
    this.driver = driver;
  }

  @Override
  protected void load() {
    driver.get(PropertiesCache.getInstance().getProperty("host.address"));
  }

  @Override
  protected void isLoaded() throws Error {
    Assert.assertTrue(isUserInfoDisplayed());
    log.info("Login successful for User: " + userInfo.getText());
  }

  public boolean isOnHomePage() {
    return isUserInfoDisplayed();
  }

  private boolean isUserInfoDisplayed() {
    waitForVisibleFluentWait(userInfo);
    return userInfo.isDisplayed();
  }

  /**
   * @deprecated This method returns a deprecated page object. Please use the new navigateToTargetListListingsPage() method
   * to navigate to the
   * TargetList page.
   *
   * @see TargetListListingsPage
   */
  @Deprecated
  public TargetList navigateTargetList() {
    PageFactory.initElements(driver, TargetListListingsPage.class).goToPage();
    return PageFactory.initElements(driver, TargetList.class);
  }

	public Home clickOffPremise() {
		offPremise.click();
		return this;
	}

	public Home clickOnPremise() {
		onPremise.click();
		return this;
	}

	public Home selectOpporunityType(String type){

		WebElement element1 = findElement(By.cssSelector("md-select[ng-model='l.filtersService.model.selected.opportunityType']"));
		element1.click();
		WebElement element = findElement(By.xpath("//md-option[@value='"+type+"']"));
		element.click();

		Actions action = new Actions(driver);
		WebElement element2 = findElement(By.xpath("//div[@class='md-select-menu-container md-active md-clickable']/div[@class='done-btn']")); ////div[@class='done-btn']
		action.moveToElement(element2).perform();
		action.click();
		action.perform();
		return this;
	}

	public Home clickOpportunityTypeDropdown() {
		opportunityTypeDropDown.click();
		return this;
	}

	//This method is used to verify whether the options in Opportunity Type drop down is clickable or not.
	public Home clickOpporunityType(String type){
		WebElement element = findElement(By.xpath("//md-option[@aria-label='"+type+"']"));
		if (type=="Low Velocity"){
			element.sendKeys(Keys.DOWN);
			element.sendKeys(Keys.ENTER);
		} else {
		element.click();
		}
		return this;
	}

	public Home typeBrandMasterSku(String value) {
		brandMasterSku.sendKeys(value);
		WebElement element = brandMasterSku.findElement(By.xpath("//input[contains(@class,'submit-btn visible')]"));
		waitForVisibleFluentWait(element).click();

		List<WebElement> results = findElements(By.cssSelector("li[role='button']"));
		for (WebElement webElement : results) {
			if (webElement.getText().split("\n")[0].equalsIgnoreCase(value)) {
				webElement.click();
				return this;
			}
		}


		//WebElement element1 = findElement(By.xpath("//span[contains(.,'"+value+"')]"));
		//element1.click();
		return this;
	}

	public Home typeRetailer(String retailerName) {
		retailer.sendKeys(retailerName);
		//		WebElement element = findElement(By.xpath("//div[2]/div[1]/inline-search[1]/div[1]/input[2]"));
		WebElement element = retailer.findElement(By.xpath("//input[contains(@class,'submit-btn visible')]"));
		waitForVisibleFluentWait(element).click();
		List<WebElement> results = findElements(By.cssSelector("li[role='button']"));
		for (WebElement webElement : results) {
			if (webElement.getText().split("\n")[0].equalsIgnoreCase(retailerName)) {
				JavascriptExecutor js = (JavascriptExecutor) driver;
				js.executeScript("arguments[0].click();", webElement);

				//Actions action = new Actions(driver);
				//action.moveToElement(webElement).perform();
				//action.click().perform();
				//webElement.click();
				return this;
			}
		}
		return this;
	}

	public Home typeDistributor(String value)
	{
		distributor.sendKeys(value);
		WebElement element = findElement(By.xpath("//div[2]/div[2]/inline-search/div/input[3]"));
		element.click();
		WebElement element1 = findElement(By.xpath("//div[2]/div[2]/inline-search/div/div/ul/li/span[1]"));
		element1.click();
		return this;
	}

	public Opportunities submitFindOpportunities() {
		submitFindOpportunities.click();
		return PageFactory.initElements(driver, Opportunities.class);
	}

	public String showUserInfo() {
		String userData = userInfo.getText();
		return userData;
	}

	public Opportunities navigateOpportunities() {
		opportunities.click();
		return PageFactory.initElements(driver, Opportunities.class);
	}

  public Opportunities selectSaveReportDropdown(String itemName) {
		WebElement button1 = findElement(By.xpath("//md-select[@placeholder='Select Saved Report']"));
		button1.click();
		Actions actions = new Actions(driver);
		WebElement button2 = findElement(By.xpath("//md-option[contains(.,'"+itemName+"')]"));
		actions.moveToElement(button2).click().build().perform();
		return PageFactory.initElements(driver, Opportunities.class);
	}

	public Login logOut(){
		driver.get("https://orion-qa.cbrands.com/auth/logout");
		return PageFactory.initElements(driver, Login.class);
	}

	public Home pageRefresh() {
		refresh();
		return this;
	}

	public List<String> getListofSavedReport(){
		//WebElement button1 = findElement(By.xpath("//md-select[@placeholder='Select Saved Report']"));
		WebElement button1 = findElement(By.cssSelector("md-select[placeholder='Select Saved Report']"));
		button1.click();

		waitForVisible(By.cssSelector("md-option[class='saved-filter-option ng-scope md-ink-ripple']"));
		//List<WebElement> results = findElements(By.xpath("//div[@class='md-select-menu-container md-active md-clickable']"));
		List<WebElement> results = findElements(By.cssSelector("md-option[class='saved-filter-option ng-scope md-ink-ripple']"));
		List<String> filters = new ArrayList<String>();
		for (WebElement webElement : results) {
			filters.add(webElement.getText());
		}
		return filters;
	}

	public List<String> getListForSaveReport() {
		findElement(By.cssSelector("md-select[placeholder='Select Saved Report']")).click();
		List<WebElement> results = findElements(By.cssSelector("md-option[ng-click='l.goToSavedFilter($event, savedFilter)']"));
		List<String> filters = new ArrayList<String>();
		for (WebElement webElement : results) {
			filters.add(webElement.getText());
		}
		return filters;
	}

	public boolean verifyPresenceofSavedReport(List<String> filters, String reportName){
		for(String str:filters){
			if(str.trim().contains(reportName))
				return true;
		}
		return false;
	}

	public Home clickSharedWithMeLink() {

		//waitForVisible(By.xpath("//md-tab-item/span[text()='Shared with Me']"));
		waitForVisibleFluentWait(sharedWithMeLink).click();
		return this;
	}


	public Home clickNotification() {
		WebElement button = findElement(By.xpath("//a[@analytics-event='Notifications Click']"));
		button.click();
		return this;
	}

    public TargetList  clickTargetList(String name){
    	waitForVisible(By.xpath("//h4[text()='"+ name + "']"));
    	WebElement MyTargetList = findElement(By.xpath("//h4[text()='"+ name + "']"));
    	MyTargetList.click();
    	return PageFactory.initElements(driver, TargetList.class);
    }

	/**
   * @deprecated Please use navigateToAccountDashboardPage() instead,
   * which returns the AccountDashboardPage page object.
   * This one returns a deprecated page object.
   */
  @Deprecated
    public AccountDashboard navigateToAccountDashboard(){
      PageFactory.initElements(driver, AccountDashboardPage.class).goToPage();
	    return PageFactory.initElements(driver, AccountDashboard.class);
    }

  public MyScorecards navigateToMyScoreCards(){
    	waitForVisibleFluentWait(myPerformanceLink).click();
    	waitForVisibleFluentWait(myScoreCards).click();
    	waitForVisible(By.cssSelector("a[href='/scorecards']"));
    	return PageFactory.initElements(driver, MyScorecards.class);
    }

    public TargetList  navigateToTargetListUsingURL(){
    	String url = driver.getCurrentUrl();
    	driver.get(url+"target-lists");
    	return PageFactory.initElements(driver, TargetList.class);
    }

	public String sharedTargetList(String listName) {
		WebElement targetList = findElement(By.xpath("//h3[contains(.,'"+listName+"')]"));
		return targetList.getText();
	}

    public Opportunities  navigateToOpportunitiesPageUsingURL(){
    	String url = driver.getCurrentUrl();
    	driver.get(url+"opportunities");
    	return PageFactory.initElements(driver, Opportunities.class);
    }


}
