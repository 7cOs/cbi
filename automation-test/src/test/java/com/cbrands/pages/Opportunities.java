package com.cbrands.pages;

import static com.cbrands.helper.SeleniumUtils.findElement;
import static com.cbrands.helper.SeleniumUtils.findElements;
import static com.cbrands.helper.SeleniumUtils.refresh;
import static com.cbrands.helper.SeleniumUtils.waitForElementToClickable;
import static com.cbrands.helper.SeleniumUtils.waitForElementVisible;
import static com.cbrands.helper.SeleniumUtils.waitForElementsVisibleFluentWait;
import static com.cbrands.helper.SeleniumUtils.waitForVisible;
import static com.cbrands.helper.SeleniumUtils.waitForVisibleFluentWait;

import java.util.ArrayList;
import java.util.List;

import com.cbrands.pages.targetList.TargetList;
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
import org.openqa.selenium.support.ui.LoadableComponent;
import org.testng.Assert;

import com.cbrands.helper.PropertiesCache;

/**
 * @deprecated Please use {@link OpportunitiesPage} instead.
 */
@Deprecated
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
	private WebElement distributor;
	@FindBy(how = How.CSS, using = "md-checkbox[aria-label='My Accounts']")
	private WebElement accountScope;
	@FindBy(how = How.CSS, using = "md-checkbox[aria-label='Open']")
	private WebElement opportunityStatusOpen;
	@FindBy(how = How.CSS, using = "md-checkbox[aria-label='Targeted']")
	private WebElement opportunityStatusTargeted;

	@FindBy(how = How.CSS, using = "md-select[aria-label='Opportunity Type Dropdown: All Types']")
	private WebElement opportunityTypeDropDown;

	private WebElement predictedImpact;

	private WebElement productType;

	@FindBy(how = How.CSS, using = "input[placeholder='Brand or Package']")
	private WebElement brandPackageSearchBox;

	@FindBy(how = How.CSS, using = "input[placeholder='Brand or SKU']")
	private WebElement brandMasterSkuSearchBox;

	@FindBy(how = How.CSS, using = "input[placeholder='Account or Subaccount Name']")
	private WebElement retailerSearchBoxChain;

	private WebElement storeType;

	private WebElement storeSegmentation;

	private WebElement location;

	private WebElement cbbdContact;

	private WebElement tradeChannel;

	@FindBy(how = How.CSS, using = "button[class='btn-action'][value='Apply Filters']")
	private WebElement applyFilters;

	//@FindBy(how = How.XPATH, using = "//div[5]/div[1]/div[1]/a[1]")
	@FindBy(how = How.XPATH, using = "//a[text()='Save Report']")
	private WebElement saveReport;

	@FindBy(how = How.CSS, using = "a[ng-click='filter.resetFilters()']")
	private WebElement reset;

	@FindBy(how = How.CSS, using = "button[ng-click='list.toggleSelectAllStores()']")
	private WebElement selectAllButton;

	@FindBy(how=How.XPATH, using = "//button[contains(.,'Download')]")
	private WebElement downloadButton;

	@FindBy(how=How.XPATH, using = "//label[contains(.,'Store / Number')]")
	private WebElement columnHeaderStoreNumber;

	@FindBy(how=How.XPATH, using = "//label[contains(.,'Address')]")
	private WebElement columnHeaderAddress;

	@FindBy(how=How.XPATH, using = "//label[contains(.,'Opportunities')]")
	private WebElement columnHeaderOpportunitites;

	@FindBy(how=How.XPATH, using = "//label[contains(.,'Depletions CYTD')]")
	private  WebElement columnHeaderDepletionsCYTD;

	@FindBy(how=How.XPATH, using = "//label[contains(.,'vs Ya%')]")
	private WebElement columnHeaderVsYA;

	@FindBy(how=How.XPATH, using = "//label[contains(.,'Segmentation')]")
	private WebElement columnHeaderSegmentation;

	@FindBy(how = How.CSS, using = "button[ng-click='list.accordion.expandAll()']")
	private WebElement expandAllButton;

	@FindBy(how = How.CSS, using = "button[ng-click='list.accordion.collapseAll()']")
	private WebElement collapseAllButton;

	@FindBy(how=How.XPATH, using = "//button[contains(.,'Add to Target List')]")
	private WebElement addToTargetListButton;

	@FindBy(how=How.XPATH, using = "//button[contains(.,'Delete')]")
	private WebElement deleteButton;

	@FindBy(how = How.CSS, using = "div.retailer.dropdown-filter>div.dropdown")
	private WebElement retailerDropDown;

	@FindBy(how=How.CSS, using = "input[placeholder='Name, Address, TDLinx']")
	private WebElement retailerSearchBoxStore;

	@FindBy(how=How.CSS, using = "input.submit-btn.visible")
	private WebElement searchButton;

	@FindBy(how=How.CSS, using = "div[class='sub-item-select flag-green']")
	private WebElement greenFlagIcon;

	@FindBy(how=How.CSS, using = "div[class='sub-item-select flag-yellow']")
	private WebElement yellowFlagIcon;

	@FindBy(how=How.CSS, using = "span[class='open-memo ng-binding']")
	private WebElement featureTypeLink;

	@FindBy(how=How.CSS, using = "div[class='modal-form clearfix']")
	private WebElement secondaryModal;

	@FindBy(how=How.CSS, using = "a.hide-row")
	private WebElement secondaryModalCloseIcon;

	@FindBy(how=How.XPATH, using = "//div[contains(.,'My Accounts Only')]")
	private WebElement filterPillMyAccountsOnly;

	@FindBy(how=How.XPATH, using = "//div[contains(.,'Off-premise')]")
	private WebElement filterPillOffPremise;

	@FindBy(how=How.XPATH, using = "//div[contains(.,'On-premise')]")
	private WebElement filterPillOnPremise;

	@FindBy(how=How.XPATH, using = "//div[contains(.,'Open')]")
	private WebElement filterPillOpen;

	@FindBy(how=How.XPATH, using = "//div[contains(.,'Targeted')]")
	private WebElement filterPillTargeted;

	@FindBy(how=How.XPATH, using = "//div[contains(.,'High Impact')]")
	private WebElement filterPillHighImpact;

	@FindBy(how=How.XPATH, using = "//div[contains(.,'Medium Impact')]")
	private WebElement filterPillMediumImpact;

	@FindBy(how=How.XPATH, using = "//div[contains(.,'Low Impact')]")
	private WebElement filterPillLowImpact;

	@FindBy(how=How.XPATH, using = "//div[contains(.,'Featured')]")
	private WebElement filterPillFeatured;

	@FindBy(how=How.XPATH, using = "//div[contains(.,'Priority Packages')]")
	private WebElement filterPillPriorityPackages;

	@FindBy(how=How.XPATH, using = "//div[contains(.,'Authorized')]")
	private WebElement filterPillAuthorized;

	@FindBy(how=How.XPATH, using = "//div[contains(.,'Grocery')]")
	private WebElement filterPillGrocery;

	@FindBy(how=How.XPATH, using = "//div[contains(.,'Drug')]")
	private WebElement filterPillDrug;

	@FindBy(how=How.XPATH, using = "//div[contains(.,'Liquor')]")
	private WebElement filterPillLiquor;

	@FindBy(how=How.XPATH, using = "//div[contains(.,'Recreation')]")
	private WebElement filterPillRecreation;

	@FindBy(how=How.XPATH, using = "//div[contains(.,'Wholesale Club')]")
	private WebElement filterPillWholesaleClub;

	@FindBy(how=How.XPATH, using = "//div[contains(.,'Convenience')]")
	private WebElement filterPillConvenience;

	@FindBy(how=How.XPATH, using = "//div[contains(.,'Mass Merchandiser')]")
	private WebElement filterPillMassMerchandiser;

	@FindBy(how=How.XPATH, using = "//div[contains(.,'Military')]")
	private WebElement filterPillMilitary;

	@FindBy(how=How.XPATH, using = "//div[contains(.,'Other Trade Channel')]")
	private WebElement filterPillOtherTradeChannel;

	@FindBy(how=How.XPATH, using = "//div[contains(.,'Independent')]")
	private WebElement filterPillIndependent;

	@FindBy(how=How.XPATH, using = "//div[contains(.,'CBBD Chain')]")
	private WebElement filterPillCbbdChain;

	@FindBy(how=How.XPATH, using = "//div[contains(.,'Segment A')]")
	private WebElement filterPillSegmentA;

	@FindBy(how=How.XPATH, using = "//div[contains(.,'Segment B')]")
	private WebElement filterPillSegmentB;

	@FindBy(how=How.XPATH, using = "//div[contains(.,'Segment C')]")
	private WebElement filterPillSegmentC;

	@FindBy(how=How.XPATH, using = "//div[contains(.,'All Types')]")
	private WebElement filterPillAllTypes;

	@FindBy(how=How.XPATH, using = "//div[contains(.,'Non-Buy')]")
	private WebElement filterPillNonBuy;

	@FindBy(how=How.XPATH, using = "//legend[contains(.,'Select premise type followed by a retailer and/or distributor to begin your search')]")
	private WebElement filterInstruction;

	@FindBy(how=How.CSS, using = "a[class='accent save-filterset-icon ng-scope disabled save-filterset-icon-disabled']")
	private WebElement saveReportLinkDisabled;

	@FindBy(how=How.CSS, using = "md-checkbox[aria-label='Independent']")
	private WebElement storeTypeIndependentRadioButton;

	@FindBy(how=How.CSS, using = "md-checkbox[aria-label='CBBD Chain']")
	private WebElement storeTypeCBBDChain;

	@FindBy(how=How.CSS, using = "md-checkbox[aria-label='Predicted Impact High']")
	private WebElement predictedImpactHigh;

	@FindBy(how=How.CSS, using = "md-checkbox[aria-label='Predicted Impact Medium']")
	private WebElement predictedImpactMedium;

	@FindBy(how=How.CSS, using = "md-checkbox[aria-label='Predicted Impact Low']")
	private WebElement predictedImpactLow;

	//@FindBy(how=How.XPATH, using = "//span[contains(.,'Authorized')]")
	@FindBy(how=How.CSS, using = "md-checkbox[aria-label='Product Type Authorized']")
	private WebElement productTypeAuthorized;

	@FindBy(how=How.CSS, using = "md-checkbox[aria-label='Product Type Featured']")
	private WebElement productTypeFeatured;

	@FindBy(how=How.CSS, using = "md-checkbox[aria-label='Product Type Priority Packages']")
	private WebElement productTypePriorityPackages;

	@FindBy(how=How.CSS, using = "md-checkbox[aria-label='Trade Channel Grocery']")
	private WebElement tradeChannelGrocery;

	@FindBy(how=How.CSS, using = "md-checkbox[aria-label='Trade Channel Drug']")
	private WebElement tradeChannelDrug;

	@FindBy(how=How.CSS, using = "md-checkbox[aria-label='Trade Channel Liquor']")
	private WebElement tradeChannelLiquor;

	@FindBy(how=How.CSS, using = "md-checkbox[aria-label='Trade Channel Recreation']")
	private WebElement tradeChannelRecreation;

	@FindBy(how=How.CSS, using = "md-checkbox[aria-label='Trade Channel Wholesale Club']")
	private WebElement tradeChannelWholesaleClub;

	@FindBy(how=How.CSS, using = "md-checkbox[aria-label='Trade Channel Convenience']")
	private WebElement tradeChannelConvenience;

	@FindBy(how=How.CSS, using = "md-checkbox[aria-label='Trade Channel Mass Merchandiser']")
	private WebElement tradeChannelMassMerchandiser;

	@FindBy(how=How.CSS, using = "md-checkbox[aria-label='Trade Channel Military']")
	private WebElement tradeChannelMilitary;

	@FindBy(how=How.CSS, using = "md-checkbox[aria-label='Trade Channel Other Trade Channel']")
	private WebElement tradeChannelOther;

	@FindBy(how=How.CSS, using = "md-checkbox[aria-label='Trade Channel Dining']")
	private WebElement tradeChannelDining;

	@FindBy(how=How.CSS, using = "md-checkbox[aria-label='Trade Channel Transportation']")
	private WebElement tradeChannelTransportation;

	@FindBy(how=How.CSS, using = "md-checkbox[aria-label='Trade Channel Bar']")
	private WebElement tradeChannelBar;

	@FindBy(how=How.CSS, using = "md-checkbox[aria-label='Trade Channel Lodging']")
	private WebElement tradeChannelLodging;

	@FindBy(how=How.CSS, using = "md-checkbox[aria-label='Store Segmentation A']")
	private WebElement storeSegmentationA;

	@FindBy(how=How.CSS, using = "md-checkbox[aria-label='Store Segmentation B']")
	private WebElement storeSegmentationB;

	@FindBy(how=How.CSS, using = "md-checkbox[aria-label='Store Segmentation C']")
	private WebElement storeSegmentationC;

	@FindBy(how=How.CSS, using = "input[placeholder='City or Zip']")
	private WebElement locationSearchBox;

	@FindBy(how=How.CSS, using = "md-select[placeholder='State']")
	private WebElement stateDropDown;

	@FindAll(@FindBy(how=How.CSS, using = "input[placeholder='Name']"))
	private List <WebElement> searchBoxwithPlaceHolderValueName;

	@FindBy(how=How.CSS, using = "md-option[value='All Types']")
	private WebElement opportunityTypeAllTypes;

	private WebElement firstStore;

	@FindBy(how=How.XPATH, using="//div[3]/md-dialog/div/div[2]/div[1]/input")
	private WebElement newTargetListName;

	@FindBy(how=How.XPATH, using="//div[3]/md-dialog/div/div[2]/button")
	private WebElement newTargetListSave;


	@FindBy(how=How.XPATH, using="//div[4]/span")
	private WebElement OpputunitiesAddedConfirmToast;

	@FindAll(@FindBy(how=How.CSS, using="v-pane-header[class='checkbox-sibling ng-isolate-scope']"))
	private List<WebElement> opportunitySearchResults;

	@FindBy(how=How.CSS, using="div[class='title-row ng-scope']")
	private WebElement levelTwoHeader;

	@FindAll(@FindBy(how=How.CSS, using="div[class='cell-parent sub-item ng-scope']"))
	private List<WebElement> levelOneRows;

	@FindBy(how=How.CSS, using="div[class='pad-cell brand-icons']")
	private WebElement brandIconSet;

	@FindBy(how=How.CSS, using="div[class='hero-row']")
	private WebElement levelTwoHeaderBar;

	@FindAll(@FindBy(how=How.CSS, using="div.toolTip"))
	private List<WebElement> toolTips;

	@FindBy(how=How.XPATH, using="//label[contains(.,'Store / Number')]")
	private WebElement storeNumber;

	@FindAll(@FindBy(how=How.CSS, using = "span.chevron-down-small"))
	private List <WebElement> chevronDownArrows;

	@FindBy(how=How.CSS, using = "span.chevron-down-small.chevron-up-small")
	private WebElement chevronUpArrow;

	@FindBy(how=How.XPATH, using = "//label[contains(.,'Store / Number')]")
	private WebElement storeHeaderSort;

	@FindBy(how=How.XPATH, using = "//label[contains(.,'Depletions CYTD')]")
	private WebElement depletionsCYTDSort;

	@FindBy(how=How.XPATH, using = "//label[contains(.,'Opportunities')]")
	private WebElement opportunitiesHeaderSort;

	@FindAll(@FindBy(how=How.CSS, using = "label[class='sort']"))
	private List <WebElement> sortHeaders;

	@FindBy(how = How.XPATH, using = "//*[@class='target-list-menu']/md-menu-item[@ng-click='list.createNewList($event)']")
	private WebElement CreatNewListButton;

	@FindBy(how = How.CSS, using = "input[placeholder='Enter List Name']")
	private WebElement NameTextBox;

	@FindBy(how = How.XPATH, using = "//div/div[2]/button")
	private WebElement SaveButton;

	@FindAll(@FindBy(how=How.CSS, using = "button[aria-label='More']"))
	private List <WebElement> actionButtons;

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
		element.click();
		if (element.getAttribute("aria-checked")=="false"){
			action.click(element).perform();
		}
		return this;
	}

	public Opportunities clickSaveReport() {
		JavascriptExecutor js = (JavascriptExecutor) driver;
		js.executeScript("arguments[0].click();", saveReport);
		return this;
	}


	public Opportunities clickApplyFilters() {
		if (applyFilters.isEnabled()){
			applyFilters.click();
		}
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
	public Opportunities clickOpportunityType(String type){
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
		waitForVisibleFluentWait(opportunityStatusOpen).click();
		return this;
	}

	public Opportunities selectTargetedOpportunityStatus() {
		waitForVisibleFluentWait(opportunityStatusTargeted).click();
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
		driver.get(PropertiesCache.getInstance().getProperty("host.address") + "/opportunities");

	}

	@Override
	protected void isLoaded() throws Error {
		Assert.assertTrue(driver.getCurrentUrl().contains("opportunities"));

	}

	public Opportunities typeDistributor(String name) {
		distributor.sendKeys(name);
		WebElement element = distributor.findElement(By.xpath("//input[contains(@class,'submit-btn visible')]"));
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

		return this;
	}

	public String getOpportunitySent()
	{

		WebElement element = findElement(By.xpath("//p[contains(.,'Opportunity Sent!')]"));
		return element.getText();
	}

	public String getOpportunityDismiss()
	{

		WebElement element = findElement(By.xpath("//p[contains(.,'Opportunity Dismissed!')]"));
		return element.getText();
	}

	public Opportunities clickDeleteReportBtn() {
		WebElement button = findElement(By.xpath("//p[contains(.,'Delete Report')]"));
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

		for (WebElement webElement : elements) {
			list.add(webElement.getText());
		}

		String productName = list.get(0).split("\n")[1];

		NotificationContent content = new NotificationContent();
		content.setStoreName(storeName);
		content.setProductSku(productName);


		return content;
	}
	public Opportunities dismiss(String feedback){
		List<WebElement> elements = findElements(By.xpath("//*[@class='md-menu ng-scope _md']/button"));
		JavascriptExecutor js = (JavascriptExecutor) driver;
		js.executeScript("arguments[0].click();", elements.get(0));

		WebElement pane3 = findElement(By.xpath("//*[@class='_md md-open-menu-container md-whiteframe-z2 md-active md-clickable']/md-menu-content/md-menu-item[2]/p"));
		waitForVisibleFluentWait(pane3).click();

		WebElement popWindow = findElement(By.cssSelector("textarea[ng-model='list.opportunity.feedback.feedback']"));
		popWindow.sendKeys(feedback);

		WebElement sendBtn = findElement(By.xpath("//p[contains(.,'X Cancel')]"));
		waitForElementToClickable(sendBtn, true).click();

		return this;
	}
	public boolean isDismissVisiable(){
		List<WebElement> elements = findElements(By.xpath("//*[@class='md-menu ng-scope _md']/button"));
		JavascriptExecutor js = (JavascriptExecutor) driver;
		js.executeScript("arguments[0].click();", elements.get(0));

		WebElement pane3 = findElement(By.xpath("//*[@class='_md md-open-menu-container md-whiteframe-z2 md-active md-clickable']/md-menu-content/md-menu-item[2]/p"));
		return pane3.isDisplayed();
	}

	public Opportunities sendOpportunityTo(String name) throws InterruptedException {

		List<WebElement> elements = findElements(By.xpath("//*[@class='md-menu ng-scope _md']/button"));

		JavascriptExecutor js = (JavascriptExecutor) driver;
		js.executeScript("arguments[0].click();", elements.get(0));

		WebElement pane3 = findElement(By.xpath("//*[@class='_md md-open-menu-container md-whiteframe-z2 md-active md-clickable']/md-menu-content/md-menu-item[1]/p"));
		waitForElementToClickable(pane3, true).click();

		WebElement popWindow = findElement(By.cssSelector("input[placeholder='Name or CBI email address']"));
		waitForElementToClickable(popWindow, true).clear();
		Thread.sleep(2000);
		Actions actions = new Actions(driver);
		actions.moveToElement(popWindow).click().build().perform();
		actions.sendKeys(popWindow, name).build().perform();
		popWindow.sendKeys(Keys.SPACE);

		//js.executeScript(String.format("document.getElementById('cred-password-inputtext').value='{0}';", name));

		WebElement searchBtn = findElements(By.cssSelector("input.submit-btn.visible")).get(1);
		waitForElementVisible(searchBtn, true).click();
		WebElement result = findElement(By.cssSelector("ul.results>li.ng-binding.ng-scope>span.user-data.ng-binding"));
		waitForElementToClickable(result, true).click();
		WebElement sendBtn = findElement(By.cssSelector("button[class='btn-action'][ng-click='list.shareOpportunity()']"));
		waitForElementToClickable(sendBtn, true).click();
		return this;
	}

	public Opportunities clickNotification() {
		WebElement button = findElement(By.xpath("//a[@analytics-event='Notifications Click']"));
		button.click();
		return this;
	}

	public Home navigateToHome() {
		driver.get(PropertiesCache.getInstance().getProperty("host.address"));
		return PageFactory.initElements(driver, Home.class);
	}

	public TargetList navigateToTargetList() {
		driver.get(PropertiesCache.getInstance().getProperty("host.address") + "/target-lists");
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
		refresh();
		waitForVisible(By.cssSelector("input[placeholder='Account or Subaccount Name']"),20);
		return this;
	}

	public Opportunities selectRetailerOptionStore(){
		WebElement retailerDropdownIcon1 = findElements(By.cssSelector("span.md-select-icon")).get(1);
		retailerDropdownIcon1.click();
		waitForVisible(By.cssSelector("md-option[ng-repeat='type in filter.filtersService.model.retailer'][aria-label='Store']"));
		WebElement element1 = findElement(By.cssSelector("md-option[ng-repeat='type in filter.filtersService.model.retailer'][aria-label='Store']"));
		element1.click();
		waitForVisibleFluentWait(retailerSearchBoxStore);
		return this;
	}

	public Opportunities searchRetailerStore(String storeNameorID){

		waitForVisibleFluentWait(retailerSearchBoxStore);
		Actions actions = new Actions(driver);
		actions.moveToElement(retailerSearchBoxStore).click(retailerSearchBoxStore).perform();
		retailerSearchBoxStore.sendKeys(storeNameorID);
		actions.moveToElement(searchButton).click(searchButton).perform();
		WebElement storeSearchResultFirst = findElements(By.cssSelector("ul.results>div.ng-scope>li.ng-binding.ng-scope")).get(0);
		actions.moveToElement(storeSearchResultFirst).click(storeSearchResultFirst).perform();
		return this;
	}


	public Opportunities searchRetailerChainByName(String storeNameorID){
		retailerSearchBoxChain.sendKeys(storeNameorID);
		waitForVisibleFluentWait(searchButton).click();
		List<WebElement> storeSearchResultFirst = findElements(By.cssSelector("ul.results>li.ng-binding.ng-scope"));
		for (WebElement webElement : storeSearchResultFirst) {
			if(webElement.getText().split("\n")[0].equalsIgnoreCase((storeNameorID.trim()))){
				webElement.click();
				return this;
			}
		}
		return this;
	}


	public Opportunities searchBrandPackage(String brandOrSKU){
		brandPackageSearchBox.click();
		brandPackageSearchBox.sendKeys(brandOrSKU);
		brandPackageSearchBox.sendKeys(Keys.ENTER);
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
		brandMasterSkuSearchBox.sendKeys(Keys.ENTER);
		WebElement packageSearchResultFirst = findElements(By.xpath("//span[contains(.,'"+brandOrSKU+"')]")).get(0);
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
		productTypeAuthorized.sendKeys(Keys.SPACE); ////Using SendKeys as the element click is not behaving consistently
		return this;
	}

	public Opportunities selectTradeChannelGrocery(){
		waitForVisibleFluentWait(tradeChannelGrocery).sendKeys(Keys.SPACE); //Using SendKeys as the element click is not behaving consistently
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

	public Opportunities selectTradeChannelWholeSaleClub(){
		tradeChannelWholesaleClub.click();
		return this;
	}

	public Opportunities selectTradeChannelConvenience(){
		tradeChannelConvenience.sendKeys(Keys.SPACE); //Using SendKeys as the element click is not behaving consistently
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
		storeTypeIndependentRadioButton.sendKeys(Keys.SPACE); //Using SendKeys as the element click is not behaving consistently
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
		return this;
	}

	public Opportunities closeSecondaryModal(){
		waitForVisibleFluentWait(secondaryModalCloseIcon).click();
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
		waitForVisibleFluentWait(opportunitySearchResults.get(0)).click();;
		return this;
	}

	public List<String> getListofSavedReport(){
		WebElement button1 = findElement(By.cssSelector("md-select[placeholder='Select Saved Report']"));
		button1.click();

		waitForVisible(By.cssSelector("md-option[class='saved-filter-option ng-scope md-ink-ripple']"));
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

				WebElement elements = findElement(By.xpath("//v-pane[1]/v-pane-header/div/div[2]/div[1]/md-checkbox/div[1]"));

				JavascriptExecutor js = (JavascriptExecutor) driver;
				js.executeScript("arguments[0].click();", elements);
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
				findElement(By.xpath("//p[text()='"+targetListName+"']")).click();
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
				WebElement element = findElement(By.xpath("//span[@class='ng-binding']"));
				return element.getText();
	}

	public List<NotificationContent> getListOfNotifications() {
		List<WebElement> elements = findElements(By.xpath("//*[@id='menu_container_0']/md-menu-content/div/div[@class='notification-card clearfix SHARE_OPPORTUNITY']"));
		List<NotificationContent> notificationContents = new ArrayList<NotificationContent>();
		for (WebElement webElement : elements) {
			String storeName = webElement.getText().split("\n")[1].toUpperCase();
			storeName = storeName.split("#")[0].trim();
			notificationContents.add(new NotificationContent(storeName,
															 webElement.getText().split("\n")[2].toUpperCase(),
															 "",
															 webElement.getText().split("\n")[4].toUpperCase(),
															 webElement.getText().split("\n")[3].toUpperCase()
															 ));

		}
		return notificationContents;
	}

	public List<NotificationContent> getFirtNotifications() {
		List<WebElement> elements = findElements(By.xpath("//*[@id='menu_container_0']/md-menu-content/div/div[@class='notification-card clearfix SHARE_OPPORTUNITY']"));
		List<NotificationContent> notificationContents = new ArrayList<NotificationContent>();
		System.out.println(elements.get(0).getText());
			String storeName = elements.get(0).getText().split("\n")[1].toUpperCase();
			storeName = storeName.split("#")[0].trim();
			notificationContents.add(new NotificationContent(storeName,
															elements.get(0).getText().split("\n")[2].toUpperCase(),
															 "",
															 elements.get(0).getText().split("\n")[4].toUpperCase(),
															 elements.get(0).getText().split("\n")[3].toUpperCase()
															 ));


		return notificationContents;
	}

	/**
	 * Verifies the default sort order for Segmentation.
	 *
	 * @return true, if successful
	 */
	public boolean verifyDefaultSegmentationSort(){
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

	/**
	 * Verifies the default sort order for package SKU.
	 *
	 * @return true, if successful
	 */
	public boolean verifyDefaultSortPackageSKU(){
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
		JavascriptExecutor je = (JavascriptExecutor)driver;
		je.executeScript("window.scrollBy(0,-500)", "");
		waitForVisibleFluentWait(chevronDownArrows.get(0)).click();
		//Hard wait introduced to wait for sorting to complete. Wait for element methods does not work in this situation, as the elements don't change
		try {
			Thread.sleep(3000);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
		String firstStore = findElements(By.cssSelector("div[class='pad-cell semi-bold ng-binding'][column='3']")).get(0).getText();
		waitForVisibleFluentWait(chevronUpArrow).click();
		try {
			Thread.sleep(3000);
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
		waitForVisibleFluentWait(chevronDownArrows.get(2)).click();
		//Hard wait introduced to wait for sorting to complete. Wait for element methods does not work in this situation, as the elements don't change
		try {
			Thread.sleep(2000);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
		int firstResult = Integer.parseInt(findElements(By.cssSelector("div[class='text-center semi-bold ng-binding'][column='1']")).get(0).getText().replaceAll(",",""));
		waitForVisibleFluentWait(chevronUpArrow).click();
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

	public boolean verifySortOpportunities(){
		waitForVisibleFluentWait(chevronDownArrows.get(1)).click();
		//Hard wait introduced to wait for sorting to complete. Wait for element methods does not work in this situation, as the elements don't change
		try {
			Thread.sleep(5000);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
		int firstResult = Integer.parseInt(findElements(By.cssSelector("div[class='text-center semi-bold ng-binding'][column='2']")).get(0).getText().replaceAll(" \\(.*\\)", ""));
		waitForVisibleFluentWait(chevronUpArrow).click();
		try {
			Thread.sleep(5000);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
		int secondResult = Integer.parseInt(findElements(By.cssSelector("div[class='text-center semi-bold ng-binding'][column='2']")).get(0).getText().replaceAll(" \\(.*\\)", ""));
		if (firstResult < secondResult){
			return true;
		}
		return false;
	}

	public WebElement getOpportunityFirstSearchResult(){
		waitForElementsVisibleFluentWait(opportunitySearchResults);
		return opportunitySearchResults.get(0);
	}

	public WebElement getLevelTwoHeader(){
		return levelTwoHeader;
	}

	public WebElement getLevelOneRow(){
		return levelOneRows.get(0);
	}

	public Opportunities clickLevelOneRow(){
		waitForVisibleFluentWait(levelOneRows.get(0)).click();
		return this;
	}

	public WebElement getBrandIconSet(){
		return brandIconSet;
	}

	public WebElement getLevelTwoHeaderBar(){
		return levelTwoHeaderBar;
	}

	public String velocityToolTipText(){
		WebElement velocityToolTip = toolTips.get(1);
		String velocityToolTipText = velocityToolTip.getAttribute("aria-label").replaceAll("\\s+", " ");
		return velocityToolTipText;
	}

	public WebElement getGreenFlagIcon(){
		return greenFlagIcon;
	}

	public WebElement getYellowFlagIcon(){
		return yellowFlagIcon;
	}

	public WebElement getSecondaryModal(){
		return secondaryModal;
	}

	public WebElement getColumnHeaderStoreNumber(){
		return columnHeaderStoreNumber;
	}

	public WebElement getColumnHeaderAddress(){
		return columnHeaderAddress;
	}

	public WebElement getColumnHeaderOpportunitites(){
		return columnHeaderOpportunitites;
	}

	public WebElement getColumnHeaderDepletionsCYTD(){
		return columnHeaderDepletionsCYTD;
	}

	public WebElement getColumnHeaderVsYA(){
		return columnHeaderVsYA;
	}

	public WebElement getColumnHeaderSegmentation(){
		return columnHeaderSegmentation;
	}

	public WebElement getSelectAllButton(){
		return selectAllButton;
	}

	public WebElement getExpandAllButton(){
		return expandAllButton;
	}

	public WebElement getCollapseAllButton(){
		return collapseAllButton;
	}

	public WebElement getAddToTargetListButton(){
		return addToTargetListButton;
	}

	public WebElement getDeleteButton(){
		return deleteButton;
	}

	public WebElement getDownloadButton(){
		return downloadButton;
	}

	public WebDriver getDriver() {
		return driver;
	}

	public WebElement getHome() {
		return home;
	}

	public WebElement getTargetList() {
		return targetList;
	}

	public WebElement getShowMoreFilterLink() {
		return showMoreFilterLink;
	}

	public WebElement getOffPremise() {
		return offPremise;
	}

	public WebElement getOnPremise() {
		return onPremise;
	}

	public WebElement getRetailer() {
		return retailer;
	}

	public WebElement getDistributor() {
		return distributor;
	}

	public WebElement getAccountScope() {
		return accountScope;
	}

	public WebElement getOpportunityStatusOpen() {
		return opportunityStatusOpen;
	}

	public WebElement getOpportunityStatusTargeted() {
		return opportunityStatusTargeted;
	}

	public WebElement getOpportunityTypeDropDown() {
		return opportunityTypeDropDown;
	}

	public WebElement getPredictedImpact() {
		return predictedImpact;
	}

	public WebElement getProductType() {
		return productType;
	}

	public WebElement getBrandPackageSearchBox() {
		return brandPackageSearchBox;
	}

	public WebElement getBrandMasterSkuSearchBox() {
		return brandMasterSkuSearchBox;
	}

	public WebElement getRetailerSearchBoxChain() {
		return retailerSearchBoxChain;
	}

	public WebElement getStoreType() {
		return storeType;
	}

	public WebElement getStoreSegmentation() {
		return storeSegmentation;
	}

	public WebElement getLocation() {
		return location;
	}

	public WebElement getCbbdContact() {
		return cbbdContact;
	}

	public WebElement getTradeChannel() {
		return tradeChannel;
	}

	public WebElement getApplyFilters() {
		return applyFilters;
	}

	public WebElement getSaveReport() {
		return saveReport;
	}

	public WebElement getReset() {
		return reset;
	}

	public WebElement getRetailerDropDown() {
		return retailerDropDown;
	}

	public WebElement getRetailerSearchBoxStore() {
		return retailerSearchBoxStore;
	}

	public WebElement getSearchButton() {
		return searchButton;
	}

	public WebElement getFeatureTypeLink() {
		return featureTypeLink;
	}

	public WebElement getSecondaryModalCloseIcon() {
		return secondaryModalCloseIcon;
	}

	public WebElement getFilterPillMyAccountsOnly() {
		return filterPillMyAccountsOnly;
	}

	public WebElement getFilterPillOffPremise() {
		return filterPillOffPremise;
	}

	public WebElement getFilterPillOnPremise() {
		return filterPillOnPremise;
	}

	public WebElement getFilterPillOpen() {
		return filterPillOpen;
	}

	public WebElement getFilterPillTargeted() {
		return filterPillTargeted;
	}

	public WebElement getFilterPillHighImpact() {
		return filterPillHighImpact;
	}

	public WebElement getFilterPillMediumImpact() {
		return filterPillMediumImpact;
	}

	public WebElement getFilterPillLowImpact() {
		return filterPillLowImpact;
	}

	public WebElement getFilterPillFeatured() {
		return filterPillFeatured;
	}

	public WebElement getFilterPillPriorityPackages() {
		return filterPillPriorityPackages;
	}

	public WebElement getFilterPillAuthorized() {
		return filterPillAuthorized;
	}

	public WebElement getFilterPillGrocery() {
		return filterPillGrocery;
	}

	public WebElement getFilterPillDrug() {
		return filterPillDrug;
	}

	public WebElement getFilterPillLiquor() {
		return filterPillLiquor;
	}

	public WebElement getFilterPillRecreation() {
		return filterPillRecreation;
	}

	public WebElement getFilterPillWholesaleClub() {
		return filterPillWholesaleClub;
	}

	public WebElement getFilterPillConvenience() {
		return filterPillConvenience;
	}

	public WebElement getFilterPillMassMerchandiser() {
		return filterPillMassMerchandiser;
	}

	public WebElement getFilterPillMilitary() {
		return filterPillMilitary;
	}

	public WebElement getFilterPillOtherTradeChannel() {
		return filterPillOtherTradeChannel;
	}

	public WebElement getFilterPillIndependent() {
		return filterPillIndependent;
	}

	public WebElement getFilterPillCbbdChain() {
		return filterPillCbbdChain;
	}

	public WebElement getFilterPillSegmentA() {
		return filterPillSegmentA;
	}

	public WebElement getFilterPillSegmentB() {
		return filterPillSegmentB;
	}

	public WebElement getFilterPillSegmentC() {
		return filterPillSegmentC;
	}

	public WebElement getFilterPillAllTypes() {
		return filterPillAllTypes;
	}

	public WebElement getFilterPillNonBuy() {
		return filterPillNonBuy;
	}

	public WebElement getFilterInstruction() {
		return filterInstruction;
	}

	public WebElement getSaveReportLinkDisabled() {
		return saveReportLinkDisabled;
	}

	public WebElement getStoreTypeIndependentRadioButton() {
		return storeTypeIndependentRadioButton;
	}

	public WebElement getStoreTypeCBBDChain() {
		return storeTypeCBBDChain;
	}

	public WebElement getPredictedImpactHigh() {
		return predictedImpactHigh;
	}

	public WebElement getPredictedImpactMedium() {
		return predictedImpactMedium;
	}

	public WebElement getPredictedImpactLow() {
		return predictedImpactLow;
	}

	public WebElement getProductTypeAuthorized() {
		return productTypeAuthorized;
	}

	public WebElement getProductTypeFeatured() {
		return productTypeFeatured;
	}

	public WebElement getProductTypePriorityPackages() {
		return productTypePriorityPackages;
	}

	public WebElement getTradeChannelGrocery() {
		return tradeChannelGrocery;
	}

	public WebElement getTradeChannelDrug() {
		return tradeChannelDrug;
	}

	public WebElement getTradeChannelLiquor() {
		return tradeChannelLiquor;
	}

	public WebElement getTradeChannelRecreation() {
		return tradeChannelRecreation;
	}

	public WebElement getTradeChannelConvenience() {
		return tradeChannelConvenience;
	}

	public WebElement getTradeChannelMassMerchandiser() {
		return tradeChannelMassMerchandiser;
	}

	public WebElement getTradeChannelMilitary() {
		return tradeChannelMilitary;
	}

	public WebElement getTradeChannelOther() {
		return tradeChannelOther;
	}

	public WebElement getTradeChannelDining() {
		return tradeChannelDining;
	}

	public WebElement getTradeChannelTransportation() {
		return tradeChannelTransportation;
	}

	public WebElement getTradeChannelBar() {
		return tradeChannelBar;
	}

	public WebElement getTradeChannelLodging() {
		return tradeChannelLodging;
	}

	public WebElement getStoreSegmentationA() {
		return storeSegmentationA;
	}

	public WebElement getStoreSegmentationB() {
		return storeSegmentationB;
	}

	public WebElement getStoreSegmentationC() {
		return storeSegmentationC;
	}

	public WebElement getLocationSearchBox() {
		return locationSearchBox;
	}

	public WebElement getStateDropDown() {
		return stateDropDown;
	}

	public List<WebElement> getSearchBoxwithPlaceHolderValueName() {
		return searchBoxwithPlaceHolderValueName;
	}

	public WebElement getOpportunityTypeAllTypes() {
		return opportunityTypeAllTypes;
	}

	public WebElement getFirstStore() {
		return firstStore;
	}

	public WebElement getNewTargetListName() {
		return newTargetListName;
	}

	public WebElement getNewTargetListSave() {
		return newTargetListSave;
	}

	public List<WebElement> getOpportunitySearchResults() {
		return opportunitySearchResults;
	}

	public List<WebElement> getLevelOneRows() {
		return levelOneRows;
	}

	public List<WebElement> getToolTips() {
		return toolTips;
	}

	public WebElement getStoreNumber() {
		return storeNumber;
	}

	public Opportunities clickfirst_store_opportunity() {
		// Introducing a hard wait, as sometimes clicking the opportunity
		// immediately after page load does not return data.
		try {
			Thread.sleep(2000);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
		WebElement firstResult = findElements(By.cssSelector("v-pane-header[class='checkbox-sibling ng-isolate-scope']")).get(0);
		Actions actions = new Actions(driver);
		firstResult.click();
		if (firstResult.getAttribute("aria-expanded") == "false") {
			actions.moveToElement(firstResult).click(firstResult).perform();
		}
		return this;
	}

	public Opportunities clickfirstOpportunity() {
		waitForVisible(By.cssSelector("md-checkbox[aria-label='Select Item'][ng-checked='product.selected']"));
		WebElement firstStoreOpportunity = findElements(By.cssSelector("md-checkbox[aria-label='Select Item'][ng-checked='product.selected']")).get(0);
		firstStoreOpportunity.click();
		if (firstStoreOpportunity.getAttribute("aria-checked") == "false") {
			firstStoreOpportunity.sendKeys(Keys.SPACE);
		}
		return this;
	}

	public Opportunities clickSecondOpportunity() {
		waitForVisible(By.cssSelector("md-checkbox[aria-label='Select Item'][ng-checked='product.selected']"));
		WebElement secondStoreOpportunity = findElements(By.cssSelector("md-checkbox[aria-label='Select Item'][ng-checked='product.selected']")).get(1);
		secondStoreOpportunity.click();
		if (secondStoreOpportunity.getAttribute("aria-checked") == "false") {
			secondStoreOpportunity.sendKeys(Keys.SPACE);
		}
		return this;
	}

	public Opportunities clickCreatNewListButton() {
		CreatNewListButton.click();
		return this;
	}

	public Opportunities EnterNameTextBox(String name) {
		waitForVisibleFluentWait(NameTextBox);
		NameTextBox.clear();
		NameTextBox.sendKeys(name);
		return this;
	}

	public Opportunities clickSaveButton() {
		SaveButton.click();
		waitForVisibleFluentWait(targetList);
		return this;
	}

	public Opportunities sortOpportunities() {
		JavascriptExecutor je = (JavascriptExecutor)driver;
		je.executeScript("arguments[0].scrollIntoView(false);",opportunitiesHeaderSort);
		waitForVisibleFluentWait(opportunitiesHeaderSort).click();
		try {
			Thread.sleep(4000);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
		return this;
	}

	public Opportunities clickActionButton() {
		waitForVisibleFluentWait(actionButtons.get(0)).click();
		return this;
	}

	public Opportunities waitForTargetListConfirmation() {
		waitForVisible(By.xpath("//md-content/navbar/div[4]"));
		return this;
	}

	public Opportunities searchRetailerChain(String storeNameorID){
		retailerSearchBoxChain.sendKeys(storeNameorID);
		waitForVisibleFluentWait(searchButton).click();
		findElements(By.cssSelector("ul.results>li.ng-binding.ng-scope")).get(0).click();;
		return this;
	}

}
