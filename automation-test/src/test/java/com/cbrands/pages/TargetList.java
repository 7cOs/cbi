package com.cbrands.pages;

import static com.cbrands.SeleniumUtils.findElement;
import static com.cbrands.SeleniumUtils.findElements;
import static com.cbrands.SeleniumUtils.refresh;
import static com.cbrands.SeleniumUtils.waitForElementToClickable;
import static com.cbrands.SeleniumUtils.waitForElementVisible;

import java.util.List;

import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.How;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.LoadableComponent;
import org.testng.Assert;

import com.cbrands.PropertiesCache;


public class TargetList extends LoadableComponent<TargetList> {
	
	private final WebDriver driver;
	
	
	@FindBy(how = How.CSS, using = "a.nav-icon.settings")
	private WebElement settingsIcon;
	
	@FindBy(how = How.XPATH, using = "//button[contains(.,'Logout')]")
	private WebElement logOutButton;

	@FindBy(how = How.XPATH,using="//button[contains(.,'Create a New List')]")
	public WebElement createNewList;
	
	@FindBy(how = How.XPATH,using="//button[contains(.,'Create New List')]")
	public WebElement createNewListModal;
	
	@FindBy(how=How.LINK_TEXT,using = "Target Lists")
	private WebElement targetList;
	
	@FindBy(how=How.CSS,using = "a[href='/opportunities']")
	private WebElement opportunities;
    
    @FindBy(how = How.XPATH,using="//div/div[2]/div[1]/input")
    public WebElement NameTextBox;

    @FindBy(how = How.XPATH,using="//*[@placeholder='Enter Description']")
    public WebElement DescriptionTextBox;
    
    @FindBy(how = How.XPATH,using="//div/div[2]/button")
    public WebElement SaveButton;
    
    
    @FindBy(how=How.XPATH, using="//div[2]/md-dialog/div/div[2]/div[3]/div/div[2]/md-menu/button")
    public WebElement collaborator;
    
    @FindBy(how=How.XPATH,using="//div[2]/md-dialog/div/div[3]/button[2]")
    public WebElement deleteList;
    
    // @FindBy(how=How.CSS,using="a[ng-click='tld.deleteList()']")
    @FindBy(how=How.XPATH,using="//div[2]/md-dialog/div/div[3]/div/p[2]/a")
    public WebElement delete;
	
    @FindBy(how = How.XPATH,using="//button[contains(.,'Manage')]")
    public WebElement TargetListManageButton;
    
    
    @FindBy(how = How.XPATH,using="//div/div[2]/div[5]/inline-search/div/input[1]")
    public WebElement CollaboratorTextBox;
  
    @FindBy(how = How.XPATH,using="//inline-search/div/input[2]")
    public WebElement SearchButton;
    
    @FindBy(how = How.XPATH,using="//button[contains(.,'Save')]")
    public WebElement SaveCollaboratorButton;
    
  
    @FindBy(how = How.XPATH,using="//div/div[2]/div[4]/md-checkbox/div[1]")
    public WebElement AllowCollaboratorCheckBox;
    
    @FindBy(how = How.XPATH,using="//button[contains(.,'Search Opportunities')]")
    public WebElement SearchOpportunityButton;
  
    @FindBy(how = How.XPATH,using="//span[contains(.,'On-Premise')]")
    public WebElement OnPremiseRadioButton;
   
    @FindBy(how = How.XPATH,using="//input[@placeholder='Account or Subaccount Name']")
    public WebElement AccountsSubnameTextBox;
      
    @FindBy(how = How.XPATH,using="//button[contains(.,'Apply Filters')]")
    public WebElement ApplyFIlterButton;
    
    //@FindBy(how = How.XPATH,using="//*[@id='opportunities']/v-pane/div/div/v-pane-header/div/div/div[1]")
    @FindBy(how = How.XPATH,using="//v-pane/div/div/v-pane-header/div/div/div[1]/span")
    public WebElement first_store_opportunity;
    
    @FindBy(how = How.XPATH,using=".//*[@id='opportunities']/v-pane/div/v-pane-content/div/v-accordion/v-pane[1]/v-pane-header/div/div[2]/div[1]/md-checkbox/div[1]")
    public WebElement firstOpportunity;
    
  
    @FindBy(how = How.XPATH,using="//button[contains(.,'Add to Target List')]")
    public WebElement AddToTargetListButton;
    
    @FindBy(how = How.XPATH,using="//p[text()='Create New List']")
    public WebElement CreatNewListButton;
    
    @FindBy(how = How.XPATH,using="//button[contains(.,'Remove')]")
    public WebElement removeOpportunity;
    
    @FindBy(how = How.CSS, using = "button[ng-click='list.toggleSelectAllStores()']")
    public WebElement selectALL;
    
    @FindBy(how = How.CSS, using = "button[ng-click='list.accordion.expandAll()']")
	public WebElement expandAll;

    @FindBy(how = How.XPATH, using = "//md-tab-item/span[text()='Shared with Me']")
	private WebElement sharedWithMeLink;

    @FindBy(how = How.LINK_TEXT, using = "Home")
	private WebElement homePage;
	
	public TargetList typeTargetName(String name)
	{
		
		WebElement element = findElement(By.xpath("//input[@placeholder='Enter List Name']"));
		waitForElementToClickable(element, true).click();
		element.sendKeys(name);
		return this;
	}
	
	public TargetList typeDescription(String description)
	{
		WebElement element = findElement(By.xpath("//textarea[@placeholder='Enter Description']"));
		waitForElementToClickable(element, true).click();
		element.sendKeys(description);
		return this;
	}
	
	public TargetList addCollaborator(String collaborator)
	{
		WebElement element = findElement(By.xpath("//input[@placeholder='Name or CBI email address']"));
		waitForElementToClickable(element, true).click();
		element.sendKeys(collaborator);
		WebElement element1 = findElement(By.xpath("//div[2]/div[3]/inline-search/div/input[2]"));
		element1.click();
		WebElement element2 = findElement(By.xpath("//div[2]/div[3]/inline-search/div/div/ul/li"));
		element2.click();
		return this;
	}
	
	public TargetList clickTargetSave()
	{
		WebElement element = findElement(By.xpath("//div[2]/md-dialog/div/div[2]/button"));
		element.click();
		return this;
	}
	
	public String getTargetListName()
	{
		WebElement element = findElement(By.xpath("//div[2]/div/h1"));
		return element.getText();
	}
	
	
	public TargetList clickCreateNewList(){
		waitForElementToClickable(createNewList, true).click();
		return this;
	}
	
	public TargetList clickCreateNewListModal(){
		waitForElementToClickable(createNewListModal, true).click();
		return this;
	}
	
	 public TargetList EnterNameTextBox(String name){
	    	NameTextBox.sendKeys(name);
	        return this;
	    }
	    
	    public TargetList EnterDescriptionTextBox(String description){
	    	DescriptionTextBox.sendKeys(description);
	        return this;
	    }
	    
	    public TargetList clickSaveButton(){
	    	SaveButton.click();
	        return this;
	    }
	    
	    public TargetList  clickNewTargetList(String name){
	    	WebElement MyTargetList = findElement(By.xpath("//h4[text()='"+ name + "']"));
	    	MyTargetList.click();
	        return this;
	    }
	    
	    public boolean checkTargetNameExists(String targetListName){
	    	WebElement element = findElement(By.xpath("//div[3]/md-tabs/md-tabs-content-wrapper/md-tab-content[1]/div/md-content"));
	    	boolean targetListExists = false;
	    	String [] array = element.getText().split("\\n");
	    	for(String txt: array){
				if(txt.trim().equalsIgnoreCase(targetListName)){
					System.out.println("element: " + txt);
					targetListExists = true;
					return targetListExists;
				}
			}
	    	return targetListExists;
	    }
		
		public Login logOut(){
			driver.get("https://orion-qa.cbrands.com/auth/logout");
			return PageFactory.initElements(driver, Login.class);
		}
	
	@Override
	protected void isLoaded() throws Error {
		Assert.assertTrue(driver.getCurrentUrl().contains("target-lists"));
		
	}

	@Override
	protected void load() {
		driver.get(PropertiesCache.getInstance().getProperty("qa.host.address") + "/target-lists");
		
	}
	
	public TargetList(WebDriver driver){
		this.driver = driver;
	}
	
	public Opportunities navigateToOpportunities(){
		waitForElementToClickable(opportunities, true).click();
		opportunities.click();
		return PageFactory.initElements(driver, Opportunities.class);
	}
	
	public TargetList navigateToTargetList(){
		targetList.click();
		return PageFactory.initElements(driver, TargetList.class);
	}
	
	public HomePage navigateToHomePage(){
		homePage.click();
		return PageFactory.initElements(driver, HomePage.class);
	}
	
	
	public TargetList clickManage(){
		TargetListManageButton.click();
		return this;
	}
	
	public TargetList clickCollaborator(){
		collaborator.click();
		return this;
	}

	public TargetList removeCollaborator(){
		//WebElement element =findElement(By.cssSelector("//md-menu-item[contains(.,'REMOVE')]"));
		WebElement element =findElement(By.xpath("//div[3]/md-menu-content/md-menu-item[2]"));
		element.click();
		element = findElement(By.xpath("//div[2]/md-dialog/div/div[2]/div[6]/button"));
		element.click();
		return this;
	}
	
	public TargetList deleteTargetList(){
		deleteList.click();
		delete.click();
		return this;
	}
	
	public String getSuccessMessage(){
		WebElement element = findElement(By.xpath("//div[contains(@class,'success ng-scope')]"));
		return element.getText();
	}
	
	public TargetList getTargetList(String targetListName){
		WebElement element = findElement(By.xpath("//h1[text()='"+targetListName+"']"));
		element.click();
		return this;
	}
	
	public TargetList clickMangeButton(){
    	TargetListManageButton.click();
        return this;
    }
    
    public TargetList EnterCollaboratorNameTextBox(String name){
    	CollaboratorTextBox.clear();
    	CollaboratorTextBox.sendKeys(name);
        return this;
    }
    
    public TargetList clickSearchButton(){
    	SearchButton.click();
        return this;
    }
    
    public TargetList clickCollaboratorList(String name){
    	
    	WebElement CollaboratorList = findElement(By.xpath("//span[contains(.,'"+ name +"')]"));
    	CollaboratorList.click();
        return this;
    }
    public TargetList clickSaveCollaboratorButton(){
    	SaveCollaboratorButton.click();
        return this;
    }
    
    public TargetList clickAllowCollaboratorCheckBox(){
    	AllowCollaboratorCheckBox.click();
        return this;
    }
    
    public TargetList clickSearchOpportunityButton(){
    	SearchOpportunityButton.click();
    //	waitForCondition(ExpectedConditions.invisibilityOfElementLocated(By.cssSelector("md-dialog[class='_md md-transition-in']")),10);
    	return this;
    }

    public TargetList clickOnPremiseRadioButton(){
    //	OnPremiseRadioButton.click();
		Actions action = new Actions(driver);
		WebElement element = findElements(By.cssSelector("div.md-off")).get(1);
		element.click();
		if (element.getAttribute("aria-checked")=="false"){
			action.click(element).perform();
		}
    	return this;
    }
  
    public TargetList EnterAccountsSubnameTextBox(String name){
    	AccountsSubnameTextBox.clear();
    	AccountsSubnameTextBox.sendKeys(name);
        return this;
    }

    public TargetList clickChainName(String name){
    	
    	WebElement ChainName = findElement(By.xpath("//ul/li[text() = '"+name+"']"));
    	ChainName.click();
        return this;
    }
    
    public TargetList clickApplyFIlterButton(){
    	ApplyFIlterButton.click();
    	return this;
    }
    
    public TargetList clickfirst_store_opportunity(){
    //	first_store_opportunity.click();
		WebElement firstResult = findElements(By.cssSelector("v-pane-header[class='checkbox-sibling ng-isolate-scope']")).get(0);
		Actions actions = new Actions(driver);
		firstResult.click();
		if (firstResult.getAttribute("aria-expanded")=="false"){
			actions.moveToElement(firstResult).click(firstResult).perform();
		}
    	return this;
    }
    
    public TargetList clickfirstOpportunity(){
    	//firstOpportunity.click();
    	WebElement firstStoreOpportunity = findElements(By.cssSelector("md-checkbox[aria-label='Select Item'][ng-checked='product.selected']")).get(0);
    	firstStoreOpportunity.click();
    	if (firstStoreOpportunity.getAttribute("aria-checked")=="false"){
    		firstStoreOpportunity.sendKeys(Keys.SPACE);
    	}
    	return this;
    }
    
    public TargetList clickAddToTargetListButton(){
    	AddToTargetListButton.click();
    	return this;
    }
    
    public TargetList clickCreatNewListButton(){
    	CreatNewListButton.click();
    	return this;
    }
    
    public TargetList reloadPage() {
		refresh();
		return this;
	}
    
   
    public TargetList selectFirstOpportunity(){
    	WebElement element = findElement(By.xpath("//v-pane/div/div/div/md-checkbox/div[1]"));
    	element.click();
    	return this;
    }
    
    public TargetList deleteOpportunity()
    {
    	removeOpportunity.click();
    	return this;
    }

	public TargetList clickSharedWithMeLink() {
		sharedWithMeLink.click();
		return this;
	}

	public TargetList clickFirstRecord() {
		List<WebElement> element = findElements(By.xpath("//md-content/div[2]/ul/li[1]/div"));
		for (WebElement webElement : element) {
			if(webElement.isDisplayed()) {
				webElement.click();
				break;
			}
		}
		return this;
	}

	public TargetList clickBackToTargetList() {
		findElement(By.xpath("//span[contains(@ng-click,'tld.navigateToTL()')]")).click();;
		return this;
	}
	
	public String getNumberOfOpportunities(int opportunities) {
		return findElement(By.xpath("//h4[contains(.,'"+opportunities+"') opportunities]")).getText();
		
	}
	
	public TargetList clickSelectAll(){
		waitForElementToClickable(selectALL, true).click();
		return this;
	}
	
	public TargetList clickExpandAll(){
		waitForElementToClickable(expandAll, true).click();
		return this;
	}
	
	public boolean checkTargetListExists(String listname){
		WebElement element = findElement(By.cssSelector("div[class='target-list-detail-container']"));
		
		boolean targetListExists = false;
		String [] array = element.getText().split("\\n");

		for(String txt: array){
			if(txt.trim().equalsIgnoreCase(listname)){
				targetListExists = true;
				return targetListExists;
			}
		}
		
		return targetListExists;
	}
	
	public TargetList clickSendTo(String sendTo1, String sendTo2){
		WebElement element = findElement(By.xpath("//v-pane[1]/v-pane-header/div/div[2]/div[7]/div/md-menu/button"));
		element.click();
		
		element = findElement(By.xpath("//div[2]/md-menu-content/md-menu-item[1]/p"));
		element.click();
		
		element = findElement(By.cssSelector("input[placeholder='Name or CBI email address']"));
		waitForElementVisible(element, true);
		
		element.sendKeys(sendTo1);
		
		element = findElement(By.xpath("//div[3]/md-dialog/div/div[2]/div[1]/inline-search/div/input[2]"));
		element.click();
		

		element = findElement(By.xpath("//div[3]/md-dialog/div/div[2]/div[1]/inline-search/div/div/ul/li"));
		element.click();
		
		element = findElement(By.cssSelector("input[placeholder='Name or CBI email address']"));
		waitForElementVisible(element, true);
		element.sendKeys(sendTo2);
		
		element = findElement(By.xpath("//div[4]/md-dialog/div/div[2]/div[1]/inline-search/div/input[2]"));
		waitForElementVisible(element, true);
		element.click();
		

		element = findElement(By.xpath("//div[4]/md-dialog/div/div[2]/div[1]/inline-search/div/div/ul/li"));
		waitForElementVisible(element, true);
		waitForElementToClickable(element, true).click();

		
		
		element = findElement(By.xpath("//button[contains(.,'Send')]"));
		waitForElementToClickable(element, true).click();
		return this;
	}
	
	public String getOpportunitySent()
	{

		WebElement element = findElement(By.xpath("//p[contains(.,'Opportunity Sent!')]"));
		return element.getText();
	}
}

