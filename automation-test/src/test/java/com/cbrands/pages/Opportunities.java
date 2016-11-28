package com.cbrands.pages;

import static com.cbrands.SeleniumUtils.findElement;
import static com.cbrands.SeleniumUtils.findElements;
import static com.cbrands.SeleniumUtils.refresh;
import static com.cbrands.SeleniumUtils.waitForElementToClickable;
import static com.cbrands.SeleniumUtils.waitForElementVisible;
import static com.cbrands.SeleniumUtils.waitForElementsVisibleFluentWait;
import static com.cbrands.SeleniumUtils.waitForVisible;
import static com.cbrands.SeleniumUtils.waitForVisibleFluentWait;

import java.util.ArrayList;
import java.util.List;

import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.FindAll;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.How;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.LoadableComponent;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.Assert;

import com.cbrands.PropertiesCache;

public class Opportunities extends LoadableComponent<Opportunities> {

	private final WebDriver driver;
	@FindBy(how = How.LINK_TEXT, using = "Home")
	private WebElement home;
	@FindBy(how = How.LINK_TEXT, using = "Target Lists")
	private WebElement targetList;
	@FindBy(how = How.XPATH, using = "//span[contains(.,'Show More Filters')]")
	private WebElement showMoreFilterLink;
	@FindBy(how = How.CSS, using = "md-radio-button[aria-label='Off-Premise']")
	public WebElement offPremise;
	@FindBy(how = How.CSS, using = "md-radio-button[aria-label='On-Premise']")
	private WebElement onPremise;

	@FindBy(how = How.XPATH, using = ".//*[@id='select_option_52']")
	private WebElement retailer;
	@FindBy(how = How.XPATH, using = "//input[@placeholder='Name']")
	public WebElement distributor;
	@FindBy(how = How.CSS, using = "md-checkbox[aria-label='My Accounts']")
	public WebElement accountScope;
	@FindBy(how = How.CSS, using = "md-checkbox[aria-label='Open']")
	public WebElement opportunityStatusOpen;
	@FindBy(how = How.CSS, using = "md-checkbox[aria-label='Targeted']")
	private WebElement opportunityStatusTargeted;
	
	@FindBy(how = How.CSS, using = "md-select[aria-label='Opportunity Type Dropdown: All Types']")
	public WebElement opportunityTypeDropDown;

	private WebElement predictedImpact;

	private WebElement productType;
	
	@FindBy(how = How.CSS, using = "input[placeholder='Brand or Package']")
	public WebElement brandPackageSearchBox;
	
	@FindBy(how = How.CSS, using = "input[placeholder='Brand or SKU']")
	public WebElement brandMasterSkuSearchBox;
	
	@FindBy(how = How.CSS, using = "input[placeholder='Account or Subaccount Name']")
	public WebElement retailerSearchBoxChain;
	
	private WebElement storeType;

	private WebElement storeSegmentation;

	private WebElement location;

	private WebElement cbbdContact;

	private WebElement tradeChannel;

	@FindBy(how = How.CSS, using = "button[value='Apply Filters']")
	public WebElement applyFilters;

	//@FindBy(how = How.XPATH, using = "//div[5]/div[1]/div[1]/a[1]")
	@FindBy(how = How.XPATH, using = "//a[text()='Save Report']")
	private WebElement saveReport;
	
	@FindBy(how = How.CSS, using = "a[ng-click='filter.resetFilters()']")
	private WebElement reset;
	
	@FindBy(how = How.CSS, using = "button[ng-click='list.toggleSelectAllStores()']")
	public WebElement selectAllButton;
	
	@FindBy(how=How.XPATH, using = "//button[contains(.,'Download')]")
	public WebElement downloadButton;
	
	@FindBy(how=How.XPATH, using = "//label[contains(.,'Store / Number')]")
	public WebElement columnHeaderStoreNumber;
	
	@FindBy(how=How.XPATH, using = "//label[contains(.,'Address')]")
	public WebElement columnHeaderAddress;
	
	@FindBy(how=How.XPATH, using = "//label[contains(.,'Opportunities')]")
	public WebElement columnHeaderOpportunitites;
	
	@FindBy(how=How.XPATH, using = "//label[contains(.,'Depletions CYTD')]")
	public  WebElement columnHeaderDepletionsCYTD;
	
	@FindBy(how=How.XPATH, using = "//label[contains(.,'vs Ya%')]")
	public WebElement columnHeaderVsYA;
	
	@FindBy(how=How.XPATH, using = "//label[contains(.,'Segmentation')]")
	public WebElement columnHeaderSegmentation;
	
	@FindBy(how = How.CSS, using = "button[ng-click='list.accordion.expandAll()']")
	public WebElement expandAllButton;
	
	@FindBy(how = How.CSS, using = "button[ng-click='list.accordion.collapseAll()']")
	public WebElement collapseAllButton;
	
	@FindBy(how=How.XPATH, using = "//button[contains(.,'Add to Target List')]")
	public WebElement addToTargetListButton;
	
	@FindBy(how=How.XPATH, using = "//button[contains(.,'Delete')]")
	public WebElement deleteButton;
	
	@FindBy(how = How.CSS, using = "div.retailer.dropdown-filter>div.dropdown")
	private WebElement retailerDropDown;
	
	@FindBy(how=How.CSS, using = "input[placeholder='Name, Address, TDLinx, or Store#']")
	public WebElement retailerSearchBoxStore;
	
	@FindBy(how=How.CSS, using = "input.submit-btn.visible")
	private WebElement searchButton;
	
	@FindBy(how=How.CSS, using = "div[class='sub-item-select flag-green']")
	public WebElement greenFlagIcon;
	
	@FindBy(how=How.CSS, using = "div[class='sub-item-select flag-yellow']")
	public WebElement yellowFlagIcon;
	
	@FindBy(how=How.CSS, using = "span[class='open-memo ng-binding']")
	private WebElement featureTypeLink;
	
	@FindBy(how=How.CSS, using = "div[class='modal-form clearfix']")
	public WebElement secondaryModal;
	
	@FindBy(how=How.CSS, using = "a.hide-row")
	private WebElement secondaryModalCloseIcon;
	
	@FindBy(how=How.XPATH, using = "//div[contains(.,'My Accounts Only')]")
	public WebElement filterPillMyAccountsOnly;
	
	@FindBy(how=How.XPATH, using = "//div[contains(.,'Off-premise')]")
	public WebElement filterPillOffPremise;
	
	@FindBy(how=How.XPATH, using = "//div[contains(.,'On-premise')]")
	public WebElement filterPillOnPremise;
	
	@FindBy(how=How.XPATH, using = "//div[contains(.,'Open')]")
	public WebElement filterPillOpen;
	
	@FindBy(how=How.XPATH, using = "//div[contains(.,'Targeted')]")
	public WebElement filterPillTargeted;
	
	@FindBy(how=How.XPATH, using = "//div[contains(.,'High Impact')]")
	public WebElement filterPillHighImpact;
	
	@FindBy(how=How.XPATH, using = "//div[contains(.,'Medium Impact')]")
	public WebElement filterPillMediumImpact;
	
	@FindBy(how=How.XPATH, using = "//div[contains(.,'Low Impact')]")
	public WebElement filterPillLowImpact;
	
	@FindBy(how=How.XPATH, using = "//div[contains(.,'Featured')]")
	public WebElement filterPillFeatured;
	
	@FindBy(how=How.XPATH, using = "//div[contains(.,'Priority Packages')]")
	public WebElement filterPillPriorityPackages;
	
	@FindBy(how=How.XPATH, using = "//div[contains(.,'Authorized')]")
	public WebElement filterPillAuthorized;
	
	@FindBy(how=How.XPATH, using = "//div[contains(.,'Grocery')]")
	public WebElement filterPillGrocery;
	
	@FindBy(how=How.XPATH, using = "//div[contains(.,'Drug')]")
	public WebElement filterPillDrug;
	
	@FindBy(how=How.XPATH, using = "//div[contains(.,'Liquor')]")
	public WebElement filterPillLiquor;
	
	@FindBy(how=How.XPATH, using = "//div[contains(.,'Recreation')]")
	public WebElement filterPillRecreation;
	
	@FindBy(how=How.XPATH, using = "//div[contains(.,'Convenience')]")
	public WebElement filterPillConvenience;
	
	@FindBy(how=How.XPATH, using = "//div[contains(.,'Mass Merchandiser')]")
	public WebElement filterPillMassMerchandiser;
	
	@FindBy(how=How.XPATH, using = "//div[contains(.,'Military')]")
	public WebElement filterPillMilitary;
	
	@FindBy(how=How.XPATH, using = "//div[contains(.,'Other Trade Channel')]")
	public WebElement filterPillOtherTradeChannel;

	@FindBy(how=How.XPATH, using = "//div[contains(.,'Independent')]")
	public WebElement filterPillIndependent;
	
	@FindBy(how=How.XPATH, using = "//div[contains(.,'CBBD Chain')]")
	public WebElement filterPillCbbdChain;
	
	@FindBy(how=How.XPATH, using = "//div[contains(.,'Segment A')]")
	public WebElement filterPillSegmentA;
	
	@FindBy(how=How.XPATH, using = "//div[contains(.,'Segment B')]")
	public WebElement filterPillSegmentB;
	
	@FindBy(how=How.XPATH, using = "//div[contains(.,'Segment C')]")
	public WebElement filterPillSegmentC;
	
	@FindBy(how=How.XPATH, using = "//div[contains(.,'All Types')]")
	public WebElement filterPillAllTypes;
	
	@FindBy(how=How.XPATH, using = "//div[contains(.,'Non-Buy')]")
	public WebElement filterPillNonBuy;
	
	@FindBy(how=How.XPATH, using = "//legend[contains(.,'Select premise type followed by a retailer and/or distributor to begin your search')]")
	public WebElement filterInstruction;
	
	@FindBy(how=How.CSS, using = "a[class='accent save-filterset-icon ng-scope disabled save-filterset-icon-disabled']")
	public WebElement SaveReportLinkDisabled;
	
	@FindBy(how=How.CSS, using = "md-checkbox[aria-label='Independent']")
	public WebElement storeTypeIndependentRadioButton;
	
	@FindBy(how=How.CSS, using = "md-checkbox[aria-label='CBBD Chain']")
	public WebElement storeTypeCBBDChain;
	
	@FindBy(how=How.CSS, using = "md-checkbox[aria-label='Predicted Impact High']")
	public WebElement predictedImpactHigh;
	
	@FindBy(how=How.CSS, using = "md-checkbox[aria-label='Predicted Impact Medium']")
	public WebElement predictedImpactMedium;
	
	@FindBy(how=How.CSS, using = "md-checkbox[aria-label='Predicted Impact Low']")
	public WebElement predictedImpactLow;
	
	//@FindBy(how=How.XPATH, using = "//span[contains(.,'Authorized')]")
	@FindBy(how=How.CSS, using = "md-checkbox[aria-label='Product Type Authorized']")
	public WebElement productTypeAuthorized;
	
	@FindBy(how=How.CSS, using = "md-checkbox[aria-label='Product Type Featured']")
	public WebElement productTypeFeatured;
	
	@FindBy(how=How.CSS, using = "md-checkbox[aria-label='Product Type Priority Packages']")
	public WebElement productTypePriorityPackages;
	
	@FindBy(how=How.CSS, using = "md-checkbox[aria-label='Trade Channel Grocery']")
	public WebElement tradeChannelGrocery;
	
	@FindBy(how=How.CSS, using = "md-checkbox[aria-label='Trade Channel Drug']")
	public WebElement tradeChannelDrug;
	
	@FindBy(how=How.CSS, using = "md-checkbox[aria-label='Trade Channel Liquor']")
	public WebElement tradeChannelLiquor;
	
	@FindBy(how=How.CSS, using = "md-checkbox[aria-label='Trade Channel Recreation']")
	public WebElement tradeChannelRecreation;
	
	@FindBy(how=How.CSS, using = "md-checkbox[aria-label='Trade Channel Convenience']")
	public WebElement tradeChannelConvenience;
	
	@FindBy(how=How.CSS, using = "md-checkbox[aria-label='Trade Channel Mass Merchandiser']")
	public WebElement tradeChannelMassMerchandiser;
	
	@FindBy(how=How.CSS, using = "md-checkbox[aria-label='Trade Channel Military']")
	public WebElement tradeChannelMilitary;
	
	@FindBy(how=How.CSS, using = "md-checkbox[aria-label='Trade Channel Other Trade Channel']")
	public WebElement tradeChannelOther;
	
	@FindBy(how=How.CSS, using = "md-checkbox[aria-label='Trade Channel Dining']")
	public WebElement tradeChannelDining;
	
	@FindBy(how=How.CSS, using = "md-checkbox[aria-label='Trade Channel Transportation']")
	public WebElement tradeChannelTransportation;
	
	@FindBy(how=How.CSS, using = "md-checkbox[aria-label='Trade Channel Bar']")
	public WebElement tradeChannelBar;
	
	@FindBy(how=How.CSS, using = "md-checkbox[aria-label='Trade Channel Lodging']")
	public WebElement tradeChannelLodging;
	
	@FindBy(how=How.CSS, using = "md-checkbox[aria-label='Store Segmentation A']")
	public WebElement storeSegmentationA;
	
	@FindBy(how=How.CSS, using = "md-checkbox[aria-label='Store Segmentation B']")
	public WebElement storeSegmentationB;
	
	@FindBy(how=How.CSS, using = "md-checkbox[aria-label='Store Segmentation C']")
	public WebElement storeSegmentationC;
	
	@FindBy(how=How.CSS, using = "input[placeholder='City or Zip']")
	public WebElement locationSearchBox;
	
	@FindBy(how=How.CSS, using = "md-select[placeholder='State']")
	public WebElement stateDropDown;
	
	@FindAll(@FindBy(how=How.CSS, using = "input[placeholder='Name']"))
	public List <WebElement> searchBoxwithPlaceHolderValueName;
	
	@FindBy(how=How.CSS, using = "md-option[value='All Types']")
	public WebElement opportunityTypeAllTypes;
	
	public WebElement firstStore;
	
	@FindBy(how=How.XPATH, using="//div[3]/md-dialog/div/div[2]/div[1]/input")
	public WebElement newTargetListName;
	
	@FindBy(how=How.XPATH, using="//div[3]/md-dialog/div/div[2]/button")
	public WebElement newTargetListSave;
	
	
	@FindBy(how=How.XPATH, using="//div[4]/span")
	public WebElement OpputunitiesAddedConfirmToast;
	
	
	//@FindBy(how=How.CSS, using="label[ng-click='list.sortBy('store')']")
	//driver.findElement(By.xpath("//label[contains(.,'Store / Number')]"));
	@FindBy(how=How.XPATH, using="//label[contains(.,'Store / Number')]")
	private WebElement storeNumber;
	
	public Opportunities(WebDriver driver) {
		this.driver = driver;
	}

	public Opportunities clickShowMoreFilter() {
		showMoreFilterLink.click();
		return this;
	}
	
	public Opportunities clickOffPremise() {
		offPremise.click();
		return this;
	}
	
	public Opportunities clickOnPremise() {
		onPremise.click();
		return this;
	}
	
	public Opportunities switchPremiseToOn() {
		Actions action = new Actions(driver);
		WebElement element = findElements(By.cssSelector("div.md-off")).get(1);
		//action.moveToElement(element).click().perform();
		element.click();
		if (element.getAttribute("aria-checked")=="false"){
			action.click(element).perform();
		}
		return this;
	}
	
	public Opportunities clickSaveReport() {
		saveReport.click();
		waitForVisible(By.xpath("//input[@placeholder='Enter a name']"));
		return this;
	}
	
	
	public Opportunities clickApplyFilters() {
		if (applyFilters.isEnabled()){
			applyFilters.click();
		}
		//waitForElementVisible(applyFilters, false);
		return this;
	}
	
	//This method has been created for Run 10 and can be used when the click on Apply Filters does not work
	public Opportunities clickApplyFilters_run10() {
		if (applyFilters.isEnabled()){
			applyFilters.sendKeys(Keys.ENTER);
		}
		waitForElementVisible(applyFilters, false);
		return this;
	}
	
	public Opportunities selectOpporunityType(String type){
		
		WebElement element1 = findElement(By.cssSelector("md-select[ng-model='filter.filtersService.model.selected.opportunityType']"));
		element1.click();
		WebElement element = findElement(By.xpath("//md-option[@aria-label='"+type+"']")); 
		element.click();

		Actions action = new Actions(driver); 
		WebElement element2 = findElement(By.xpath("//div[@class='md-select-menu-container md-active md-clickable']/div[@class='done-btn']")); ////div[@class='done-btn']
		action.moveToElement(element2).perform();
		action.click();
		action.perform();
		return this;
	}
	
	//This method is used to verify whether the options in Opportunity Type drop down is clickable or not.
	public Opportunities clickOpporunityType(String type){			
		WebElement element = findElement(By.xpath("//md-option[@aria-label='"+type+"']"));
		if (type=="Low Velocity"){
			element.sendKeys(Keys.DOWN);
			element.sendKeys(Keys.ENTER);
		} else {
		element.click();
		}
		return this;
	}
	
	public Opportunities clickOpporunityTypeDone(){			
		WebElement opportunityTypeDropDownDoneButton = findElements(By.cssSelector("div[class='done-btn']")).get(3);
		opportunityTypeDropDownDoneButton.click();
		return this;
	}
	
	public Opportunities selectRetailer() {
		retailer.click();
		return this;
	}
	
	public Opportunities selectOpenOpportunityStatus() {
		opportunityStatusOpen.click();
		return this;
	}
	
	public Opportunities selectTargetedOpportunityStatus() {
		opportunityStatusTargeted.click();
		return this;
	}
	
	public Opportunities selectAccountScope() {
		accountScope.click();
		return this;
	}
	
	public Opportunities selectAccountScope_run10() {
		accountScope.sendKeys(Keys.SPACE);
		return this;
	}

	@Override
	protected void load() {
		driver.get(PropertiesCache.getInstance().getProperty("qa.host.address") + "/opportunities");

	}

	@Override
	protected void isLoaded() throws Error {
		Assert.assertTrue(driver.getCurrentUrl().contains("opportunities"));

	}

	public Opportunities typeDistributor(String name) {
		distributor.sendKeys(name);
		
		WebElement element = findElement(By.xpath("//div[3]/inline-search[1]/div[1]/input[2]"));
		waitForElementToClickable(element, true).click();
		WebElement element1 = findElement(By.xpath("//div[3]/inline-search[1]/div[1]/div[1]/ul[1]/li[1]/span[1]"));
		waitForElementToClickable(element1, true).click();
		return this;
		
	}
	
	public Opportunities searchDistributor(String name) {
		waitForVisible(By.cssSelector("input[placeholder='Name']"));
		distributor.sendKeys(name);
		waitForVisible(By.cssSelector("input.submit-btn.visible"));
		waitForElementToClickable(searchButton,true);
		searchButton.click();
		waitForVisible(By.cssSelector("span[class='result ng-binding']"));
		WebElement result = findElements(By.cssSelector("span[class='result ng-binding']")).get(0);
		waitForElementToClickable(result, true);
		result.click();
		return this;
	}

	public Opportunities typeSaveReportName(String reportName) {
		//waitForVisible(By.cssSelector("span[class='result ng-binding']"));
		waitForVisible(By.xpath("//input[@placeholder='Enter a name']"));
		WebElement name = findElement(By.xpath("//input[@placeholder='Enter a name']"));
		name.click();
		name.sendKeys(reportName);
		return this;
	}
	
	public Opportunities clickDialogSaveReport() {
		WebElement button = findElement(By.xpath("//button[contains(.,'Save Report')]"));
		button.click();
		return this;
	}
	
	public Opportunities clickDialogUpdateReport() {
		WebElement button = findElement(By.xpath("//button[contains(.,'Update Report')]"));
		button.click();
		return this;
	}
	
	public Opportunities reloadPage() {
		refresh();
		return this;
	}
	
	public Login logOut(Login login) {
		login.logOut();
		return login;
	}
	
	public Login logOutwithWait(Login login) {
		login.logOutwithWait();;
		return login;
	}

	@Deprecated
	public Opportunities selectSaveFilterDropdown() {
		WebElement button1 = findElement(By.xpath("//md-select[@placeholder='Select Saved Report']"));
		button1.click();
		WebElement button2 = findElement(By.xpath("//md-option[contains(.,'Chris Off Coastal (Wil) At Risk 1')]"));
		button2.click();
		return this;
	}
	
	public Opportunities selectSaveReportDropdownByName(String itemName) {
		findElement(By.cssSelector("md-select[placeholder='Select Saved Report']")).click();
		Actions actions = new Actions(driver);
		WebElement button2 = findElement(By.xpath("//md-option[contains(.,'"+itemName+"')]"));
		actions.moveToElement(button2).click().build().perform();
		return this;
	} 
	
	public List<String> getTextSaveReport(String itemName){
		List<String> l1 = new ArrayList<String>();
		WebElement element1= findElement(By.xpath("//div[1]/div/div/md-input-container/div/div/md-select/md-select-value/span[1]"));
		l1.add(element1.getText());
		return l1;
		
	}
	
	public Opportunities deleteSaveReportDropdownByName(String itemName) {
		Actions actions = new Actions(driver);
		findElement(By.cssSelector("md-select[placeholder='Select Saved Report']")).click();

		List<WebElement> results = findElements(By.cssSelector("md-option[ng-click='o.applySavedFilter($event, savedFilter)']"));
		
		for (WebElement webElement : results) {
			if(webElement.getText().equalsIgnoreCase(itemName)){
				actions.moveToElement(webElement).build().perform();
				WebElement button = webElement.findElement(By.xpath("//md-option[contains(.,'"+itemName+"')]/div[1]/span"));
				JavascriptExecutor js = (JavascriptExecutor) driver;
				js.executeScript("arguments[0].click();", button);
			}
		}
		
		/*
		waitForVisible(By.xpath("//md-option[contains(.,'"+itemName+"')]"));
		WebElement button2 = findElement(By.xpath("//md-option[contains(.,'"+itemName+"')]"));
		actions.moveToElement(button2).build().perform();
		WebElement button3 = button2.findElement(By.xpath("//md-option[contains(.,'"+itemName+"')]/div[1]/span"));
		JavascriptExecutor js = (JavascriptExecutor)driver; 
		js.executeScript("arguments[0].click();", button3); */
		return this;
	}
	
	public String getOpportunitySent()
	{

		WebElement element = findElement(By.xpath("//p[contains(.,'Opportunity Sent!')]"));
		return element.getText();
	}
	
	public Opportunities clickDeleteReportBtn() {
		//WebElement deleteReport = findElement(By.xpath("//p[@ng-click='o.deleteSavedFilter(o.currentFilter[0].id)']"));
		//waitForElementVisible(deleteReport, true).click();;
		
		WebElement button = findElement(By.xpath("//div/div[2]/p"));
		JavascriptExecutor js = (JavascriptExecutor) driver;
		js.executeScript("arguments[0].click();", button);
		return this;
	}

	public Opportunities clickFirstResult() {
		WebElement pane1 = findElement(By.xpath("//*[@id='opportunities']/v-pane[1]/div/div/v-pane-header")); 
		waitForVisibleFluentWait(pane1).click();
		return this;
	}
	
	//Get the first record of selected opportunity
	public NotificationContent getWebElementOfFirstItem() {
		String storeName = findElement(By.xpath("//*[@id='opportunities']/v-pane[1]/div/div/v-pane-header")).getText();
		storeName = storeName.split("\n")[0];
		storeName = storeName.split("#")[0].trim();
		
		
		List<String> list = new ArrayList<String>();
		List<WebElement> elements = findElements(By.xpath("//*[@id='opportunities']/v-pane/div/v-pane-content/div/v-accordion/v-pane[1]/v-pane-header/div/div[2]/div[2]"));
		
		for (WebElement webElement : waitForElementsVisibleFluentWait(elements)) {
			list.add(webElement.getText());
		}
		
		String productName = list.get(0).split("\n")[1];
		
		NotificationContent content = new NotificationContent();
		content.setStoreName(storeName);
		content.setProductSku(productName);
		
		return content;
	}
	
	public Opportunities sendOpportunityTo(String name) {
		
		List<WebElement> elements = findElements(By.xpath("//*[@class='md-menu ng-scope _md']/button"));
		
		JavascriptExecutor js = (JavascriptExecutor) driver;
		js.executeScript("arguments[0].click();", elements.get(0));
		
		//waitForVisibleFluentWait(pane2).click();
		//*[@id="menu_container_274"]/md-menu-content/md-menu-item[1]/p
		//WebElement pane3 = findElement(By.cssSelector("div._md.md-open-menu-container.md-whiteframe-z2.md-active.md-clickable p"));
		//WebElement pane3 = findElement(By.cssSelector("p[ng-click='list.openShareModal(product.id); $pane.collapse()']"));
		//List<WebElement> elements = findElements(By.cssSelector(".md-icon-button.md-button"));
		//waitForVisibleFluentWait(elements.get(0)).click();
		
		
		
		WebElement pane3 = findElement(By.xpath("//*[@class='_md md-open-menu-container md-whiteframe-z2 md-active md-clickable']/md-menu-content/md-menu-item[1]/p"));
		waitForVisibleFluentWait(pane3).click();
		WebElement popWindow = findElement(By.cssSelector("input[placeholder='Name or CBI email address']"));
		waitForElementVisible(popWindow, true);
		Actions actions = new Actions(driver);
		actions.sendKeys(popWindow, name).build().perform();
		popWindow.sendKeys(Keys.SPACE);
		WebElement searchBtn = findElement(By.cssSelector("input.submit-btn.visible"));
		waitForElementVisible(searchBtn, true).click();
		WebElement result = findElement(By.cssSelector("ul.results>li.ng-binding.ng-scope>span.user-data.ng-binding"));
		waitForElementToClickable(result, true).click();
		WebElement sendBtn = findElement(By.xpath("//button[contains(.,'Send')]"));
		waitForElementToClickable(sendBtn, true).click();
		return this;
	}

	public Opportunities clickNotification() {
		WebElement button = findElement(By.xpath("//a[@analytics-event='Notifications Click']"));
		button.click();
		return this;
	}
	
	public HomePage navigateToHome() {
		home.click();
		return PageFactory.initElements(driver, HomePage.class);
	}
	
	public TargetList navigateToTargetList() {
		waitForElementToClickable(targetList, true).click();
		targetList.click();
		return PageFactory.initElements(driver, TargetList.class);
	}
	
	public Opportunities clickSelectAllButton(){
		if (selectAllButton.isEnabled())
			selectAllButton.click();
		return this;
	}
	
	public Opportunities clickExpandAllButton(){
		if (expandAllButton.isEnabled())
			expandAllButton.click();
		return this;
	}
	
	public Opportunities clickCollapseAllButton(){
		if (collapseAllButton.isEnabled())
			collapseAllButton.click();
		return this;
	}
	
	public Opportunities clickAddToTargetListButton(){
		if (addToTargetListButton.isEnabled()){
			waitForElementToClickable(addToTargetListButton, true).click();
			System.out.println(addToTargetListButton.getAttribute("aria-expanded").trim() + " value");
			
			if(addToTargetListButton.getAttribute("aria-expanded").trim().equalsIgnoreCase("false")){
				WebElement element = driver.findElement(By.xpath("//div[2]/span/span/md-menu[1]/button"));
				JavascriptExecutor executor = (JavascriptExecutor)driver;
				executor.executeScript("arguments[0].click();", element);
			}
		}
		return this;
	}
	
	public Opportunities resetFilters(){
		reset.click();
		return this;
	}
	
	public Opportunities pageRefresh(){
		//setTimeout(10);
		refresh();
		waitForVisible(By.cssSelector("input[placeholder='Account or Subaccount Name']"),20);
		return this;
	}
	
	public Opportunities selectRetailerOptionStore(){
		Actions actions = new Actions(driver);
		
		actions.moveToElement(retailerDropDown).click(retailerDropDown).perform();
		//retailerDropDown.click();
		WebElement retailDropDownValueStore = findElements(By.xpath("//md-option[@value='Store']")).get(0);
		actions.moveToElement(retailDropDownValueStore).click(retailDropDownValueStore).perform();
		//retailDropDownValueStore.click();
		waitForVisible(By.cssSelector("input[placeholder='Name, Address, TDLinx, or Store#']"));
		return this;
	}
	
	public Opportunities selectRetailerOptionStore2(){
		Actions action = new Actions(driver);
/*		WebElement dropdown = findElement(By.cssSelector("md-select-value[class='md-select-value"));
		dropdown.click();
		if (dropdown.getAttribute("aria-expanded")=="false"){
			action.moveToElement(dropdown).click(dropdown).perform();
		}*/
		
		WebElement retailerDropdownIcon = findElements(By.cssSelector("span[class='md-select-icon'][aria-hidden='true']")).get(1);
		retailerDropdownIcon.click();
		//waitForVisible(By.cssSelector("md-option[aria-label='Store']"));
		waitForVisible(By.xpath("//md-option[@value='Store']"));
		WebElement valueStore = findElement(By.xpath("//md-option[@value='Store']"));
		//findElements(By.xpath("//md-option[@value='Store']")).get(0).click();
		valueStore.click();
		if (valueStore.getAttribute("aria-selected")=="false"){
			action.click(valueStore).perform();
		}
		waitForVisible(By.cssSelector("input[placeholder='Name, Address, TDLinx, or Store#']"));
		return this;
	}
	
	public Opportunities selectRetailerOptionStore3(){
		WebDriverWait wait = new WebDriverWait(driver,30);
		wait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("md-select[ng-model='filter.filtersService.model.selected.retailer'][placeholder='Chain']")));
		findElement(By.cssSelector("md-select[ng-model='filter.filtersService.model.selected.retailer']")).click();
		findElements(By.xpath("//md-option[@value='Store']")).get(0).click();
		return this;
	}
	
	public Opportunities searchRetailerStore(String storeNameorID){
		waitForVisible(By.cssSelector("input[placeholder='Name, Address, TDLinx, or Store#']"));
		Actions actions = new Actions(driver);
		actions.moveToElement(retailerSearchBoxStore).click(retailerSearchBoxStore).perform();
		//retailerSearchBoxStore.click();
		retailerSearchBoxStore.sendKeys(storeNameorID);
		actions.moveToElement(searchButton).click(searchButton).perform();
		//searchButton.click();
		WebElement storeSearchResultFirst = findElements(By.cssSelector("ul.results>li.ng-binding.ng-scope")).get(0);
		actions.moveToElement(storeSearchResultFirst).click(storeSearchResultFirst).perform();
		//storeSearchResultFirst.click();
		return this;
	}
	
	/**
	 * 
	 * @deprecated Do not use this method! Use searchRetailerChainByName
	 */
	@Deprecated
	public Opportunities searchRetailerChain(String storeNameorID){
		waitForElementToClickable(retailerSearchBoxChain, true).click();
		retailerSearchBoxChain.sendKeys(storeNameorID);
		searchButton.click();
		WebElement storeSearchResultFirst = findElements(By.cssSelector("ul.results>li.ng-binding.ng-scope")).get(0);
		storeSearchResultFirst.click();
		return this;
	}
	
	public Opportunities searchRetailerChainByName(String storeNameorID){
		retailerSearchBoxChain.sendKeys(storeNameorID);
		searchButton.click();
		List<WebElement> storeSearchResultFirst = findElements(By.cssSelector("ul.results>li.ng-binding.ng-scope"));
		for (WebElement webElement : storeSearchResultFirst) {
			if(webElement.getText().split("\n")[0].equalsIgnoreCase((storeNameorID.trim()))){
				webElement.click();
				return this;
			}
		}
		return this;
	}
	
	//need to delete this later
	public Opportunities searchRetailerStore2(String storeNameorID){
		retailerSearchBoxStore.click();
		retailerSearchBoxStore.sendKeys(storeNameorID);
		searchButton.click();
		WebElement storeSearchResultFirst2 = findElements(By.cssSelector("ul.results>li.ng-binding.ng-scope")).get(1);
		storeSearchResultFirst2.click();
		return this;
	}
	
	
	public Opportunities searchBrandPackage(String brandOrSKU){
		brandPackageSearchBox.click();
		brandPackageSearchBox.sendKeys(brandOrSKU);
		searchButton.click();
		WebElement packageSearchResultFirst = findElements(By.cssSelector("span[class='result ng-binding']")).get(0);
		packageSearchResultFirst.click();
		return this;
	}
	
	public List<WebElement> BrandPackageSearchResults(String brandOrSKU){
		brandPackageSearchBox.click();
		brandPackageSearchBox.sendKeys(brandOrSKU);
		searchButton.click();
		List<WebElement> SearchResults = findElements(By.cssSelector("span[class='result ng-binding']"));
		return SearchResults;
	}
	
	public Opportunities searchBrandSKU(String brandOrSKU){
		brandMasterSkuSearchBox.click();
		brandMasterSkuSearchBox.sendKeys(brandOrSKU);
		searchButton.click();
		waitForVisible(By.cssSelector("span[class='result ng-binding']"), 30);
		WebElement packageSearchResultFirst = findElements(By.cssSelector("span[class='result ng-binding']")).get(0);
		packageSearchResultFirst.click();
		return this;
	}
	
	public List<WebElement> BrandSKUSearchResults(String brandOrSKU){
		brandMasterSkuSearchBox.click();
		brandMasterSkuSearchBox.sendKeys(brandOrSKU);
		searchButton.click();
		List<WebElement> SearchResults = findElements(By.cssSelector("span[class='result ng-binding']"));
		return SearchResults;
	}
	
	public Opportunities selectProductTypeFeatured(){
		productTypeFeatured.click();
		return this;
	}
	
	public Opportunities selectProductTypePriorityPackages(){
		productTypePriorityPackages.click();
		return this;
	}
	
	public Opportunities selectProductTypeAuthorized(){
		waitForVisible(By.cssSelector("md-checkbox[aria-label='Product Type Authorized']"));
		//productTypeAuthorized.click();
		productTypeAuthorized.sendKeys(Keys.SPACE);
		return this;
	}
	
	public Opportunities selectTradeChannelGrocery(){
		//tradeChannelGrocery.click();
		tradeChannelGrocery.sendKeys(Keys.SPACE);
		return this;
	}
	
	public Opportunities selectTradeChannelDrug(){
		tradeChannelDrug.click();
		return this;
	}
	
	public Opportunities selectTradeChannelLiquor(){
		tradeChannelLiquor.click();
		return this;
	}
	
	public Opportunities selectTradeChannelRecreation(){
		tradeChannelRecreation.click();
		return this;
	}
	
	public Opportunities selectTradeChannelConvenience(){
		//tradeChannelConvenience.click();
		tradeChannelConvenience.sendKeys(Keys.SPACE);
		return this;
	}
	
	public Opportunities selectTradeChannelMassMerchandiser(){
		tradeChannelMassMerchandiser.click();
		return this;
	}
	
	public Opportunities selectTradeChannelMilitary(){
		tradeChannelMilitary.click();
		return this;
	}
	
	public Opportunities selectTradeChannelOther(){
		tradeChannelOther.click();
		return this;
	}
	
	public Opportunities selectStoreTypeIndependent(){
		//storeTypeIndependentRadioButton.click();
		storeTypeIndependentRadioButton.sendKeys(Keys.SPACE);
		return this;
	}
	
	public Opportunities selectStoreTypeCBBDCHAIN(){
		storeTypeCBBDChain.click();
		return this;
	}
	
	public Opportunities selectStoreSegmentationA(){
		storeSegmentationA.click();
		return this;
	}
	
	public Opportunities selectStoreSegmentationB(){
		storeSegmentationB.click();
		return this;
	}
	
	public Opportunities selectStoreSegmentationC(){
		storeSegmentationC.click();
		return this;
	}
	
	
	public Opportunities clickFeatureType(){
		Actions action = new Actions(driver);
		action.moveToElement(featureTypeLink).click(featureTypeLink).perform();
		//featureTypeLink.click();
		return this;
	}
	
	public Opportunities closeSecondaryModal(){
		waitForVisible(By.cssSelector("a.hide-row"),20);
		secondaryModalCloseIcon.click();
		//findElement(By.cssSelector("a[ng-click='list.closeModal()']")).click();
		return this;
	}
	
	public Opportunities downloadOpportunities(){
		if (downloadButton.isEnabled())
			downloadButton.click();
		return this;
	}
	
	public Opportunities selectPredictedImpactHigh(){
		predictedImpactHigh.click();
		return this;
	}
	
	public Opportunities selectPredictedImpactMedium(){
		predictedImpactMedium.click();
		return this;
	}
	
	public Opportunities selectPredictedImpactLow(){
		predictedImpactLow.click();
		return this;
	}
	
	public Opportunities clickShowLessFilters() {
		WebElement showLessFilters = findElement(By.xpath("//span[contains(.,'Show Less Filters')]"));
		showLessFilters.click();
		return this;
	}
	
	
	public Opportunities escpageFromDropdown() {
		//driver.findElement(By.xpath("//h1[contains(.,'Opportunities')]")).click();
		findElement(By.cssSelector("md-option[ng-click='o.applySavedFilter($event, savedFilter)']")).sendKeys(Keys.ESCAPE);
		
		return this;
	}
		
	public Opportunities clearFirstRemovableFilterPill() {
		WebElement filterPillXIcon = findElements(By.cssSelector("md-icon[aria-hidden='true']")).get(0);
		filterPillXIcon.click();
		return this;
	}
	
	public Opportunities clickOpportunityTypeDropdown() {
		opportunityTypeDropDown.click();
		return this;
	}
	
	public Opportunities clickOpportunitySearchFirstResult() {
		findElements(By.cssSelector("v-pane-header[class='checkbox-sibling ng-isolate-scope']")).get(0).click();
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
	
	public boolean verifyPresenceofSavedReport(List<String> filters, String reportName){
		for(String str:filters){
			if(str.trim().contains(reportName))
				return true;
		}
		return false;
	}

	public List<String> getListForSaveReport() {
		//findElement(By.cssSelector("md-select[placeholder='Select Saved Report']")).click();
		findElement(By.cssSelector("md-select[ng-init='o.filtersService.model.selected.currentFilter.id']")).click();
		List<WebElement> results = findElements(By.cssSelector("md-option[ng-click='o.applySavedFilter($event, savedFilter)']"));
		List<String> filters = new ArrayList<String>();
		for (WebElement webElement : results) {
			filters.add(webElement.getText());
		}
		return filters;
	}

	public Opportunities selectDropdownFromSaveReportPopup(String reportName) {
		findElement(By.cssSelector("md-select[ng-model='filter.userService.model.newServiceSelect']")).click();
		List<WebElement> results = findElements(By.cssSelector("md-option[ng-value='savedFilter.id']"));
		for (WebElement webElement : results) {
			if (webElement.getText().equalsIgnoreCase(reportName)) {
				webElement.click();
				return this;
			}
		}
		return this;
	}
	
	public Opportunities selectFirstStore(){
		firstStore = findElement(By.xpath("//v-pane[1]/v-pane-header/div/div[2]/div[1]/md-checkbox/div[1]"));
		firstStore.click();
		return this;
	}
	
	public Opportunities selectMultipleStore(){
		WebElement element = findElement(By.xpath("//v-pane[1]/v-pane-header/div/div[2]/div[1]/md-checkbox/div[1]"));
		element.click();
		
		element = findElement(By.xpath("//v-pane[2]/v-pane-header/div/div[2]/div[1]/md-checkbox/div[1]"));
		element.click();
		
		element = findElement(By.xpath("//v-pane[3]/v-pane-header/div/div[2]/div[1]/md-checkbox/div[1]"));
		element.click();
		
		
		return this;
	}
	
	public boolean checkTargetListExists(String targetListName) {
		WebElement element1 = findElement(By.xpath("//div[2]/md-menu-content"));
		boolean targetListExists = false;
		String [] array = element1.getText().split("\\n");

		for(String txt: array){
			if(txt.trim().equalsIgnoreCase(targetListName)){
				targetListExists = true;
				return targetListExists;
			}
		}
		
		return targetListExists;
	}
	
	public Opportunities selectDropdownFromTargetList(String targetListName){
		WebElement element1 = findElement(By.xpath("//div[2]/md-menu-content"));
		
		String [] array = element1.getText().split("\\n");
		for(String txt: array){
			if(txt.trim().equalsIgnoreCase(targetListName)){
				//driver.findElement(By.xpath("//md-menu-item[text()='"+targetListName+"']")).click();
				
				driver.findElement(By.xpath("//p[text()='"+targetListName+"']")).click();
				return this;
			}
		}
		
		return this;
	}
	
	public Opportunities typeNewTargetListName(String name){
		newTargetListName.sendKeys(name);
		return this;
	}
	
	public Opportunities clickNewTargetListSave(){
		newTargetListSave.click();
		return this;
	}
	
	public String getOpputunitiesAddedConfirmToast(){
		return OpputunitiesAddedConfirmToast.getText();
	}

	public List<NotificationContent> getListOfNotifications() {
		List<WebElement> elements = findElements(By.xpath("//*[@id='menu_container_0']/md-menu-content/div/div/div[@class='notification-card clearfix SHARE_OPPORTUNITY']"));
		List<NotificationContent> notificationContents = new ArrayList<NotificationContent>();
		for (WebElement webElement : elements) {
			notificationContents.add(new NotificationContent(webElement.getText().split("\n")[0], 
															 webElement.getText().split("\n")[1], 
															 "", 
															 webElement.getText().split("\n")[3],
															 webElement.getText().split("\n")[2] 
															 ));
			
		}
		return notificationContents;
	}
	
	public boolean verifySegmentationSort(){
		String resultText = findElements(By.cssSelector("v-pane-header[class='checkbox-sibling ng-isolate-scope']")).get(0).getText();
		char segmentationValue = resultText.charAt(resultText.length()-1);
			if(segmentationValue =='A'){
				return true;
			}
			else if(segmentationValue =='B'){
				return true;
			}
		return false;
	}
	
	public Opportunities clickFirstSearchResult(){
		WebElement firstResult = findElements(By.cssSelector("v-pane-header[class='checkbox-sibling ng-isolate-scope']")).get(0);
		Actions actions = new Actions(driver);
		firstResult.click();
		if (firstResult.getAttribute("aria-expanded")=="false"){
			actions.moveToElement(firstResult).click(firstResult).perform();
		}
		return this;
	}
	
	public boolean verifySortPackageSKU(){
		String firstProduct = findElements(By.cssSelector("div[class='pad-cell ng-binding'][column='2']")).get(0).getText();
		String secondProduct = findElements(By.cssSelector("div[class='pad-cell ng-binding'][column='2']")).get(1).getText();
		if (firstProduct.compareToIgnoreCase(secondProduct) < 0){
			return true;
		}
		return false;
	}
	
	public Opportunities sortDepletionsCYTDDescending(){
		findElements(By.cssSelector("span[class='chevron-down-small']")).get(1).click();
		return this;
	}
	
	public boolean verifySortStore(){
		WebElement storeNumberDownArrow = findElements(By.cssSelector("span.chevron-down-small")).get(0);
		storeNumberDownArrow.click();
		//Hard wait introduced to wait for sorting to complete. Wait for element methods does not work in this situation, as the elements don't change
		try {
			Thread.sleep(2000);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
		String firstStore = findElements(By.cssSelector("div[class='pad-cell semi-bold ng-binding'][column='3']")).get(0).getText();
		storeNumberDownArrow.click();
		try {
			Thread.sleep(2000);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
		String lastStore = findElements(By.cssSelector("div[class='pad-cell semi-bold ng-binding'][column='3']")).get(0).getText();
		if (firstStore.compareToIgnoreCase(lastStore) < 0){
			return true;
		}
		return false;
	}
	
	public boolean verifySortDepletionsCYTD(){
		WebElement depletionsDownArrow = findElements(By.cssSelector("span.chevron-down-small")).get(1);
		depletionsDownArrow.click();
		//Hard wait introduced to wait for sorting to complete. Wait for element methods does not work in this situation, as the elements don't change
		try {
			Thread.sleep(2000);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
		int firstResult = Integer.parseInt(findElements(By.cssSelector("div[class='text-center semi-bold ng-binding'][column='1']")).get(0).getText().replaceAll(",",""));
		depletionsDownArrow.click();
		try {
			Thread.sleep(2000);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
		int secondResult = Integer.parseInt(findElements(By.cssSelector("div[class='text-center semi-bold ng-binding'][column='1']")).get(0).getText().replaceAll(",",""));
		if (firstResult < secondResult){
			return true;
		}
		return false;
	}
	
}
