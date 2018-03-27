package com.cbrands.pages.targetList;

import static com.cbrands.helper.SeleniumUtils.findElement;
import static com.cbrands.helper.SeleniumUtils.findElements;
import static com.cbrands.helper.SeleniumUtils.maximize;
import static com.cbrands.helper.SeleniumUtils.refresh;
import static com.cbrands.helper.SeleniumUtils.waitForCondition;
import static com.cbrands.helper.SeleniumUtils.waitForElementToClickable;
import static com.cbrands.helper.SeleniumUtils.waitForElementVisible;
import static com.cbrands.helper.SeleniumUtils.waitForElementsVisibleFluentWait;
import static com.cbrands.helper.SeleniumUtils.waitForVisible;
import static com.cbrands.helper.SeleniumUtils.waitForVisibleFluentWait;

import java.util.ArrayList;
import java.util.List;

import com.cbrands.pages.Home;
import com.cbrands.pages.NotificationContent;
import com.cbrands.pages.opportunities.Opportunities;
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
import org.testng.Assert;

import com.cbrands.helper.PropertiesCache;

/**
 * @deprecated This class represents at least three different pages. The elements and methods contained in this class are to be
 * split into their proper page objects. Please use the new page object classes, and extract/deprecate the needed
 * code accordingly.
 */
@Deprecated
public class TargetList extends LoadableComponent<TargetList> {

	private final WebDriver driver;

	@FindBy(how = How.CSS, using = "a.nav-icon.settings")
	private WebElement settingsIcon;

	@FindBy(how = How.XPATH, using = "//button[contains(.,'Logout')]")
	private WebElement logOutButton;

	@FindBy(how = How.XPATH, using = "//button[contains(.,'Create a New List')]")
	private WebElement createNewList;

	@FindBy(how = How.XPATH, using = "//button[contains(.,'Create New List')]")
	private WebElement createNewListModal;

	@FindBy(how = How.LINK_TEXT, using = "Target Lists")
	private WebElement targetList;

	@FindBy(how = How.CSS, using = "a[href='/opportunities']")
	private WebElement opportunities;

	//@FindBy(how = How.XPATH, using = "//div/div[2]/div[1]/input")
	@FindBy(how = How.CSS, using = "input[placeholder='Enter List Name']")
	private WebElement NameTextBox;

	//@FindBy(how = How.XPATH, using = "//*[@placeholder='Enter Description']")
	@FindBy(how = How.CSS, using = "textarea[placeholder='Enter Description']")
	private WebElement DescriptionTextBox;

	@FindBy(how = How.XPATH, using = "//div/div[2]/button")
	private WebElement SaveButton;

	//@FindBy(how = How.XPATH, using = "//div[2]/md-dialog/div/div[2]/div[3]/div/div[2]/md-menu/button")
	@FindBy(how=How.XPATH, using = "//*[@role='dialog']/div/div[@class='modal-form']/div[@class='modal-input']/div/div[2]/md-menu/button")
	private WebElement collaborator;

	@FindBy(how = How.XPATH, using = "//div[2]/md-dialog/div/div[3]/button[2]")
	private WebElement deleteList;

	// @FindBy(how=How.CSS,using="a[ng-click='tld.deleteList()']")
	@FindBy(how = How.XPATH, using = "//div[2]/md-dialog/div/div[3]/div/p[2]/a")
	private WebElement delete;

	@FindBy(how = How.XPATH, using = "//button[contains(.,'Manage')]")
	private WebElement TargetListManageButton;

	//@FindBy(how = How.XPATH, using = "//div/div[2]/div[5]/inline-search/div/input[1]")
	@FindBy(how = How.CSS, using = "input[placeholder='Enter names or CBI Email addresses']")
	private WebElement CollaboratorTextBox;

	@FindBy(how = How.XPATH, using = "//inline-search/div/input[3]")
	private WebElement SearchButton;

	@FindBy(how = How.XPATH, using = "//button[contains(.,'Save')]")
	private WebElement SaveCollaboratorButton;

	@FindBy(how = How.XPATH, using = "//div/div[2]/div[4]/md-checkbox/div[1]")
	private WebElement AllowCollaboratorCheckBox;

	@FindBy(how = How.XPATH, using = "//button[contains(.,'Search Opportunities')]")
	private WebElement SearchOpportunityButton;

	@FindBy(how = How.XPATH, using = "//span[contains(.,'On-Premise')]")
	private WebElement OnPremiseRadioButton;

	@FindBy(how = How.XPATH, using = "//input[@placeholder='Account or Subaccount Name']")
	private WebElement AccountsSubnameTextBox;

	@FindBy(how = How.XPATH, using = "//button[contains(.,'Apply Filters')]")
	private WebElement applyFilterButton;

	// @FindBy(how =
	// How.XPATH,using="//*[@id='opportunities']/v-pane/div/div/v-pane-header/div/div/div[1]")
	@FindBy(how = How.XPATH, using = "//v-pane/div/div/v-pane-header/div/div/div[1]/span")
	private WebElement first_store_opportunity;

	@FindBy(how = How.XPATH, using = "//v-pane[1]/v-pane-header/div/div[2]/div[1]/md-checkbox/div[1]")
	private WebElement firstOpportunity;

	@FindBy(how = How.XPATH, using = "//button[contains(.,'Add to Target List')]")
	private WebElement AddToTargetListButton;

	@FindBy(how = How.XPATH, using = "//p[text()='Create New List']")
	private WebElement CreatNewListButton;

	@FindBy(how = How.XPATH, using = "//button[contains(.,'Remove')]")
	private WebElement removeOpportunity;

	@FindBy(how = How.CSS, using = "button[ng-click='list.toggleSelectAllStores()']")
	private WebElement selectALL;

	@FindBy(how = How.CSS, using = "button[ng-click='list.accordion.expandAll()']")
	private WebElement expandAll;

	@FindBy(how = How.XPATH, using = "//md-tab-item/span[text()='Shared with Me']")
	private WebElement sharedWithMeLink;

	@FindAll(@FindBy(how = How.CSS, using = "md-tab-item.md-tab.ng-scope.ng-isolate-scope"))
	private List<WebElement> sharedWithMe1;

	@FindBy(how = How.LINK_TEXT, using = "Home")
	private WebElement homePage;

	//@FindBy(how = How.XPATH, using = "//md-menu/button[contains(.,'Copy to Target List')]")
	//@FindBy(how = How.CSS, using = "button[class='btn-action'][analytics-event='Add to Target List']")
	@FindBy(how = How.XPATH, using = "//md-content/div/div/list/div[2]/span/span/md-menu[1]/button")
	private WebElement copyToTargetListButton;

	@FindBy(how = How.XPATH, using = "//span[contains(.,'Off-Premise')]")
	private WebElement OffPremiseRadioButton;

	@FindBy(how = How.XPATH, using = "//input[@placeholder='Name']")
	private WebElement DistributorTextBox;

	@FindBy(how = How.XPATH, using = "//div[3]/div[1]/md-checkbox[2]/div[1]")
	private WebElement OpportunityStatusCheckBox;

	@FindBy(how = How.XPATH, using = "//div[3]/inline-search/div/input[3]")
	private WebElement DistributorSearchButton;

	@FindBy(how = How.XPATH, using = "//div[2]/div[4]/md-checkbox/div[1]")
	private WebElement MyAccountCheckBox;

	@FindBy(how = How.XPATH, using = "//v-pane[1]/v-pane-header/div/div[2]/div[7]/div/md-menu/button")
	private WebElement ActionButton;

	@FindBy(how = How.XPATH, using = "//button[contains(.,'Download')]")
	private WebElement DownloadButton;

	@FindBy(how = How.XPATH, using = "//p[contains(.,'With Rationale')]")
	private WebElement With_RationaleButton;

	@FindBy(how = How.XPATH, using = "//p[contains(.,'Without Rationale')]")
	private WebElement Without_RationaleButton;

	@FindBy(how = How.XPATH, using = "//button[contains(.,'Delete')]")
	private WebElement deleteTarget;

	@FindBy(how = How.XPATH, using = "//button[contains(.,'Archive')]")
	private WebElement ArchiveButton;

	@FindBy(how = How.XPATH, using = "//span[contains(.,'Archive')]")
	private WebElement Archivespan;

	@FindBy(how = How.XPATH, using = "//a[contains(.,'Yes, Delete')]")
	private WebElement yesDelete;

	@FindBy(how = How.CSS, using = "button.icon.select-all.ng-scope")
	private WebElement selectAllTargetListsButton;

	@FindBy(how = How.CSS, using = "a[href='/target-lists']")
	private WebElement targetListLink;

	@FindBy(how = How.CSS, using = "input[placeholder='Name']")
	private WebElement distributor;

	@FindBy(how = How.CSS, using = "md-checkbox[aria-label='My Accounts']")
	private WebElement accountScope;

	@FindAll(@FindBy(how=How.CSS, using = "div[column='12']>h4[column='4']"))
	private List <WebElement> targetListRows;

	@FindBy(how = How.CSS, using = "div.target-action-buttons>button[class='btn-action']")
	private WebElement createNewListButton;

	@FindAll(@FindBy(how=How.CSS, using = "div[class='modal target-list-switch-modal']>div.modal-form>div.row>button[class='btn-action col-6']"))
	private List <WebElement> createTargetListModalButtons;

	@FindBy(how = How.XPATH, using = "//div[contains(.,'Target List Archived!')]")
	private WebElement archiveSuccessMessage;

	@FindBy(how = How.XPATH, using = "//md-menu-item[contains(.,'Make Owner')]")
	private WebElement makeOwnerOption;

  public TargetList(WebDriver driver) {
    this.driver = driver;
  }

  @Override
  protected void isLoaded() throws Error {
    Assert.assertTrue(driver.getCurrentUrl().contains("target-lists"));
  }

  @Override
  protected void load() {
    driver.get(PropertiesCache.getInstance().getProperty("host.address") + "/target-lists");
  }

  /**
   * @deprecated Please use the method extracted to the TargetListListings page object
   * @see ListsPage
   */
  @Deprecated
  public TargetList clickCreateNewListButton() {
    waitForVisibleFluentWait(createNewListButton).click();
    return this;
  }

  /**
   * @deprecated Please use the method extracted to the TargetListListings page object
   * @see ListsPage
   */
  @Deprecated
  public TargetList clickCreateNewListButtonInModal() {
    waitForVisibleFluentWait(createTargetListModalButtons.get(0)).click();
    return this;
  }

  /**
   * @deprecated Please use the method extracted to the EditTargetListModal page object
   * @see ListManagementModal
   */
  @Deprecated
  public TargetList EnterNameTextBox(String name) {
    final ListManagementModal listManagementModal = PageFactory.initElements(driver, ListManagementModal.class);
    listManagementModal.enterListName(name);
    return this;
  }

  /**
   * @deprecated Please use the method extracted to the EditTargetListModal page object
   * @see ListManagementModal
   */
  @Deprecated
  public TargetList typeDescription(String description) {
    final ListManagementModal listManagementModal = PageFactory.initElements(driver, ListManagementModal.class);
    listManagementModal.enterDescription(description);
    return this;
  }

  /**
   * @deprecated Please use the method extracted to the EditTargetListModal page object
   * @see ListManagementModal
   */
  @Deprecated
  public TargetList addCollaborator(String collaborator) {
    final ListManagementModal listManagementModal = PageFactory.initElements(driver, ListManagementModal.class);
    listManagementModal.addCollaborator(collaborator);
    return this;
  }

  /**
   * @deprecated Please use the method extracted to the EditTargetListModal page object
   * @see ListManagementModal
   */
  @Deprecated
  public TargetList clickSaveButton() {
    final ListManagementModal listManagementModal = PageFactory.initElements(driver, ListManagementModal.class);
    listManagementModal.clickSaveButton();
    return this;
  }

  /**
   * @deprecated Please use the method extracted to the TargetListListingsPage page object
   * @see ListsPage
   */
  @Deprecated
  public TargetList clickTargetList(String name) {
    final ListsPage listsPage = PageFactory.initElements(
      driver,
      ListsPage.class
    );
    listsPage.clickTargetListByName(name);

    return this;
  }

  /**
   * @deprecated Please use the method extracted to the TargetListDetailPage page object
   * @see ListDetailPage
   */
  @Deprecated
  public TargetList clickManage() {
    final ListDetailPage listDetailPage = PageFactory.initElements(driver, ListDetailPage.class);
    listDetailPage.clickManageButton();

    return this;
  }

  /**
   * @deprecated Please use the method extracted to the TargetListDetailPage page object
   * @see ListDetailPage
   */
  @Deprecated
  public TargetList clickManageButton() {
    final ListDetailPage listDetailPage = PageFactory.initElements(driver, ListDetailPage.class);
    listDetailPage.clickManageButton();

    return this;
  }

  /**
   * @deprecated Please use the method extracted to the EditTargetListModal page object
   * @see ListManagementModal
   */
  @Deprecated
  public TargetList clickDelete_TargetListPage() {
    final ListManagementModal listManagementModal = PageFactory.initElements(driver, ListManagementModal.class);
    listManagementModal.clickDeleteTargetListButton();
    return this;
  }

  /**
   * @deprecated Please use the method extracted to the EditTargetListModal page object
   * @see ListManagementModal
   */
  @Deprecated
  public TargetList clickYesDelete() {
    final ListManagementModal listManagementModal = PageFactory.initElements(driver, ListManagementModal.class);
    listManagementModal.confirmListDelete();
    return this;
  }

  public TargetList typeTargetName(String name) {

		WebElement element = findElement(By.xpath("//input[@placeholder='Enter List Name']"));
		waitForElementToClickable(element, true).click();
		element.sendKeys(name);
		return this;
	}

	public TargetList clickTargetSave() {
		WebElement element = findElement(By.xpath("//div[2]/md-dialog/div/div[2]/button"));
		element.click();
		return this;
	}

	public String getTargetListName() {
		WebElement element = findElement(By.xpath("//div[2]/div/h1"));
		waitForElementVisible(element, true);
		return element.getText();
	}

	public TargetList clickCreateNewList() {
		// waitForElementToClickable(createNewList, true).click();
		waitForVisibleFluentWait(createNewList).click();;
		return this;
	}

	public TargetList clickCreateNewListModal() {
		waitForElementToClickable(createNewListModal, true).click();
		return this;
	}

	public TargetList EnterDescriptionTextBox(String description) {
		DescriptionTextBox.sendKeys(description);
		return this;
	}

	@Deprecated
	public TargetList clickNewTargetList2(String name) {
		// waitForVisible(By.xpath("//h4[text()='"+ name + "']"));
		WebElement MyTargetList = findElement(By.xpath("//h4[text()='" + name + "']"));
		//waitForElementToClickable(MyTargetList, true);
		waitForVisibleFluentWait(MyTargetList);
		System.out.println(MyTargetList.getText());

		JavascriptExecutor js = (JavascriptExecutor) driver;
		js.executeScript("arguments[0].click();", MyTargetList);
		return this;
		// MyTargetList.click();
		// return this;

	}

	public boolean checkTargetLists(String name) {
		List<WebElement> MyTargetLists = findElements(By.xpath("//*[@id='tab-content-2']/div/md-content/div[@class='target-list-detail-container']/ul/li/div/div[@class='stats']/div/h4[1]"));
		for (WebElement webElement : MyTargetLists) {
			if(webElement.getText().equalsIgnoreCase(name)){
				return true;
			}
		}
		return false;
	}

	public TargetList clickTargetListFromShared(String name) {
		List<WebElement> MyTargetLists = findElements(By.xpath("//*[@id='tab-content-3']/div/md-content/div[@class='target-list-detail-container']/ul/li/div/div/h4[1]"));
		for (WebElement webElement : MyTargetLists) {
			if(webElement.getText().equalsIgnoreCase(name)){
				JavascriptExecutor js = (JavascriptExecutor) driver;
				js.executeScript("arguments[0].click();", webElement);
				break;
			}

		}
		return this;
	}

	public TargetList clickTargetListDuplicate(String name) {
		findElement(By.cssSelector("span.ng-scope")).click();
		WebElement list = findElements(By.xpath("//h4[text()='" + name + "']")).get(0);
		System.out.println(list.getText());
		// list.sendKeys(Keys.ENTER);
		Actions action = new Actions(driver);
		list.click();
		// action.click(list).perform();
		return this;
	}

	public boolean checkTargetNameExists(String targetListName) {
		WebElement element = findElement(By.xpath("//div[3]/md-tabs/md-tabs-content-wrapper/md-tab-content[1]/div/md-content"));
		boolean targetListExists = false;
		String[] array = element.getText().split("\\n");
		for (String txt : array) {
			if (txt.trim().equalsIgnoreCase(targetListName)) {
				System.out.println("element: " + txt);
				targetListExists = true;
				return targetListExists;
			}
		}
		return targetListExists;
	}

	public Opportunities navigateToOpportunities() {
		//waitForElementToClickable(opportunities, true).click();
		//opportunities.click();
		driver.get(PropertiesCache.getInstance().getProperty("host.address") + "/opportunities");
		return PageFactory.initElements(driver, Opportunities.class);
	}

	public TargetList navigateToTargetList() {
		//targetList.click();
		driver.get(PropertiesCache.getInstance().getProperty("host.address") + "/target-lists");
		return PageFactory.initElements(driver, TargetList.class);
	}

	public Home navigateToHomePage() {
		homePage.click();
		return PageFactory.initElements(driver, Home.class);
	}

	public TargetList clickCollaborator() {
		//System.out.println("Inside collaborator");
		//waitForElementVisible(collaborator, true);
		//waitForElementToClickable(collaborator, true).click();
		waitForVisibleFluentWait(collaborator).click();
		return this;
	}

	public TargetList removeCollaborator() {
		// WebElement element
		// =findElement(By.cssSelector("//md-menu-item[contains(.,'REMOVE')]"));
//		WebElement element = findElement(By.xpath("//div[3]/md-menu-content/md-menu-item[2]"));
//		waitForElementToClickable(element, true).click();
//		element = findElement(By.xpath("//div[2]/md-dialog/div/div[2]/div[6]/button"));
//		waitForElementToClickable(element, true).click();
		//findElement(By.cssSelector("md-menu-content.collaborator-options>md-menu-item[ng-click='tld.removeCollaboratorClick(collaborator.user.employeeId)']")).click();
		findElement(By.xpath("//md-menu-item[contains(.,'Remove')]")).click();
		return this;
	}

	public TargetList deleteTargetList() {
		deleteList.click();
		delete.click();
		return this;
	}

	public String getSuccessMessage() {
		WebElement element = findElement(By.xpath("//div[contains(@class,'success ng-scope')]"));
		return element.getText();
	}

	public TargetList getTargetList(String targetListName) {
		WebElement element = findElement(By.xpath("//h1[text()='" + targetListName + "']"));
		waitForElementVisible(element, true);
		element.click();
		return this;
	}

	public TargetList EnterCollaboratorNameTextBox(String name) {
		CollaboratorTextBox.clear();
		CollaboratorTextBox.sendKeys(name);
		return this;
	}

	public TargetList clickSearchButton() {
		waitForVisibleFluentWait(SearchButton).click();
		return this;
	}

	public TargetList clickCollaboratorList(String name) {

		WebElement CollaboratorList = findElement(By.xpath("//span[contains(.,'" + name + "')]"));
		CollaboratorList.click();
		return this;
	}

	public TargetList clickSaveCollaboratorButton() {
		waitForVisibleFluentWait(SaveCollaboratorButton).click();
		//Introducing a hard wait, as waiting for 2 seconds makes the behavior more consistent and reliable than waiting for element visibility.
		try {
			Thread.sleep(2000);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
		//waitForVisibleFluentWait(TargetListManageButton);
		return this;
	}

	public TargetList clickAllowCollaboratorCheckBox() {
		AllowCollaboratorCheckBox.click();
		return this;
	}

	public Opportunities clickSearchOpportunityButton() {
		SearchOpportunityButton.click();
		return PageFactory.initElements(driver, Opportunities.class);
	}

	public TargetList clickOnPremiseRadioButton() {
		// OnPremiseRadioButton.click();
		Actions action = new Actions(driver);
		WebElement element = findElements(By.cssSelector("div.md-off")).get(1);
		element.click();
		if (element.getAttribute("aria-checked") == "false") {
			action.click(element).perform();
		}
		return this;
	}

	public TargetList EnterAccountsSubnameTextBox(String name) {
		AccountsSubnameTextBox.clear();
		AccountsSubnameTextBox.sendKeys(name);
		return this;
	}

	public TargetList clickChainName(String name) {

		WebElement ChainName = findElement(By.xpath("//ul/li[text() = '" + name + "']"));
		ChainName.click();
		return this;
	}

	public TargetList clickApplyFilterButton() {
		applyFilterButton.click();
		return this;
	}

	public TargetList clickfirst_store_opportunity() {
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

	public TargetList clickfirstOpportunity() {
		waitForVisible(By.cssSelector("md-checkbox[aria-label='Select Item'][ng-checked='product.selected']"));
		WebElement firstStoreOpportunity = findElements(By.cssSelector("md-checkbox[aria-label='Select Item'][ng-checked='product.selected']")).get(0);
		firstStoreOpportunity.click();
		if (firstStoreOpportunity.getAttribute("aria-checked") == "false") {
			firstStoreOpportunity.sendKeys(Keys.SPACE);
		}
		return this;
	}

	public TargetList clickSecondOpportunity() {
		waitForVisible(By.cssSelector("md-checkbox[aria-label='Select Item'][ng-checked='product.selected']"));
		WebElement secondStoreOpportunity = findElements(By.cssSelector("md-checkbox[aria-label='Select Item'][ng-checked='product.selected']")).get(1);
		secondStoreOpportunity.click();
		if (secondStoreOpportunity.getAttribute("aria-checked") == "false") {
			secondStoreOpportunity.sendKeys(Keys.SPACE);
		}
		return this;
	}

	public TargetList clickAddToTargetListButton() {
		waitForElementToClickable(AddToTargetListButton, true);
		AddToTargetListButton.sendKeys(Keys.ENTER);
		return this;
	}

	public TargetList clickCreatNewListButton() {
		CreatNewListButton.click();
		return this;
	}

	public TargetList reloadPage() {
		refresh();
		return this;
	}

	public TargetList maximizeWindow() {
		maximize();
		return this;
	}

	public TargetList selectFirstOpportunity() {
		WebElement element = findElement(By.xpath("//v-pane/div/div/div/md-checkbox/div[1]"));
		element.click();
		return this;
	}

	public TargetList deleteOpportunity() {
		removeOpportunity.click();
		return this;
	}

	public TargetList clickSharedWithMeLink() {
		waitForVisibleFluentWait(sharedWithMe1.get(1));
		WebElement tab = sharedWithMe1.get(1);
		tab.click();
		tab.click();
		waitForCondition(ExpectedConditions.attributeToBe(sharedWithMe1.get(1), "aria-selected", "true"), 20);

		return this;
	}

	public TargetList clickFirstRecord() {
		List<WebElement> element = findElements(By.xpath("//md-content/div[2]/ul/li[1]/div"));
		for (WebElement webElement : element) {
			if (webElement.isDisplayed()) {
				webElement.click();
				break;
			}
		}
		return this;
	}

	public TargetList clickBackToTargetList() {
		findElement(By.xpath("//span[contains(@ng-click,'tld.navigateToTL()')]")).click();
		;
		return this;
	}

	public String getNumberOfOpportunities(int opportunities) {
		return findElement(By.xpath("//h4[contains(.,'" + opportunities + "') opportunities]")).getText();

	}

	public TargetList clickSelectAll() {
		waitForElementToClickable(selectALL, true).click();
		return this;
	}

	public TargetList clickExpandAll() {
		waitForElementToClickable(expandAll, true).click();
		return this;
	}

	public TargetList clickSendTo(String sendTo1) {
		// List<WebElement> elements =
		// findElements(By.xpath("//*[@class='md-menu ng-scope _md']/button"));
		List<WebElement> elements = findElements(By.xpath("//button[@class='md-icon-button md-button']"));
		JavascriptExecutor js = (JavascriptExecutor) driver;
		js.executeScript("arguments[0].click();", elements.get(0));

		WebElement element;

		element = findElement(By.xpath("//div[2]/md-menu-content/md-menu-item[1]/p"));
		element.click();

		element = findElement(By.cssSelector("input[placeholder='Name or CBI email address']"));
		waitForElementVisible(element, true);
		element.clear();
		element.sendKeys(sendTo1);

		element = findElement(By.xpath("//div[3]/md-dialog/div/div[2]/div[1]/inline-search/div/input[3]"));
		waitForElementToClickable(element, true).click();

		// element =
		// findElement(By.xpath("//div[3]/md-dialog/div/div[2]/div[1]/inline-search/div/div/ul/li"));
		// waitForElementToClickable(element, true).click();
		WebElement result = findElement(By.cssSelector("ul.results>li.ng-binding.ng-scope>span.user-data.ng-binding"));
		waitForElementToClickable(result, true).click();

		/*element = findElement(By.cssSelector("input[placeholder='Name or CBI email address']"));
		waitForElementVisible(element, true);
		element.sendKeys(sendTo2);

		element = findElement(By.xpath("//div[3]/md-dialog/div/div[2]/div[1]/inline-search/div/input[3]"));
		waitForElementToClickable(element, true).click();

		element = findElement(By.xpath("//div[3]/md-dialog/div/div[2]/div[1]/inline-search/div/div/ul/li"));
		waitForElementToClickable(element, true).click();
*/
		element = findElement(By.xpath("//button[contains(.,'Send')]"));
		waitForElementToClickable(element, true).click();
		return this;
	}

	public String getOpportunitySent() {

		WebElement element = findElement(By.xpath("//p[contains(.,'Opportunity Sent!')]"));
		return element.getText();
	}

	public TargetList copyToTargetList(String name) {
		waitForVisibleFluentWait(copyToTargetListButton).click();
		waitForVisible(By.xpath("//p[text()='" + name + "']"));
		findElement(By.xpath("//p[text()='" + name + "']")).click();
		waitForVisible(By.xpath("//div[contains(.,'added to target list!')]"));
		return this;
	}

	public TargetList navigateBackToTargetLists() {
		refresh();
		waitForVisible(By.cssSelector("span[class='accent white link']"));
		findElement(By.cssSelector("div[class='hero ng-scope']")).click();
		WebElement element = findElement(By.cssSelector("span[class='accent white link']"));
		element.click();
		try {
			Thread.sleep(5000);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
		return this;
	}

	public TargetList navigateToTargetLists() {
		waitForVisibleFluentWait(targetListLink).click();
		waitForVisibleFluentWait(createNewList);
		return this;
	}

	public TargetList selectFirstRecord() {
		WebElement element = findElement(By.xpath("//v-pane/v-pane-header/div/div[2]/div[1]/md-checkbox/div[1]"));
		waitForElementToClickable(element, true);
		element.click();
		return this;
	}

	// Get the first record of selected opportunity
	public NotificationContent getWebElementOfFirstItem() {
		String storeName = findElement(By.xpath("//v-pane/div/div/v-pane-header/div/div/div[1]")).getText();
		storeName = storeName.split("#")[0].trim();
		System.out.println("Store Name" + storeName);
		storeName = storeName.trim();

		List<String> list = new ArrayList<String>();
		List<WebElement> elements = findElements(By.xpath("//v-pane-content/div/v-accordion/v-pane/v-pane-header/div/div[2]/div[2]"));

		for (WebElement webElement : waitForElementsVisibleFluentWait(elements)) {
			list.add(webElement.getText());
		}

		String productName = list.get(0).split("\n")[1];

		NotificationContent content = new NotificationContent();
		content.setStoreName(storeName);
		content.setProductSku(productName);
		return content;

	}

	public TargetList clickOffPremiseRadioButton() {
		OffPremiseRadioButton.click();
		return this;
	}

	public TargetList EnterDistributorTextBox(String name) {
		DistributorTextBox.clear();
		DistributorTextBox.sendKeys(name);
		return this;
	}

	public TargetList clickOpportunityStatusCheckBox() {
		OpportunityStatusCheckBox.click();
		return this;
	}

	public TargetList clickDistributorSearchButton() {
		DistributorSearchButton.click();
		return this;
	}

	public TargetList clickDistributorName(String name) {

		WebElement DistributorName = findElement(By.xpath("//span[contains(.,'" + name + "')]"));
		DistributorName.click();
		return this;
	}

	public TargetList clickMyAccountCheckBox() {
		MyAccountCheckBox.click();
		return this;
	}

	public TargetList clickActionButton() {
		ActionButton.click();
		return this;
	}

	public String checkNumberofCollaborator(String listname) {
		WebElement element = findElement(By.cssSelector("div[class='target-list-detail-container']"));
		waitForElementVisible(element, true);

		String[] array = element.getText().split("\\n");

		for (int i = 0; i < array.length; i++) {
			if (array[i].trim().equalsIgnoreCase(listname)) {
				return array[i + 1];
			}
		}

		return null;
	}

	public TargetList clickSharedWithMe() {
		WebElement element = findElement(By.xpath("//span[contains(.,'Shared with Me')]"));
		waitForElementToClickable(element, true);
		element.click();
		return this;
	}

	public String checkSharedTargetListExists(String listname) {
		// WebElement element =
		// findElement(By.cssSelector("div[class='target-list-detail-container']"));
		WebElement element = findElement(By.xpath("//div[3]/md-tabs/md-tabs-content-wrapper/md-tab-content[2]/div/md-content/div[2]"));
		String[] array = element.getText().split("\\n");

		for (String txt : array) {
			if (txt.trim().equalsIgnoreCase(listname)) {
				return txt;
			}
		}

		return "does not exist";
	}

	public String getDepletionsSinceClosed() {
		WebElement element = findElement(By.xpath("//div[3]/div[2]/div[1]/span"));
		return element.getText();
	}

	public List<String> getTargetLists() {
		WebElement element = findElement(By.cssSelector("div[class='target-list-detail-container']"));
		waitForElementVisible(element, true);

		String[] array = element.getText().split("\\n");
		List<String> targetLists = new ArrayList<String>();

		for (String txt : array) {
			targetLists.add(txt.trim());
		}

		return targetLists;
	}


	public String getDepletionSince_TargetListPage(String listname){
		WebElement element = findElement(By.cssSelector("div[class='target-list-detail-container']"));
		waitForElementVisible(element, true);

		String[] array = element.getText().split("\\n");

		for (int i = 0; i < array.length; i++) {
			if (array[i].trim().equalsIgnoreCase(listname)) {
				System.out.println(array[i + 5]);

				element = driver.findElement(By.xpath("//h4[text()='" + listname + "']"));
				((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", element);
				//Thread.sleep(500);

				return array[i + 5].trim();
			}
		}

		return "";
	}

	public TargetList clickDownloadButton() {
		waitForVisibleFluentWait(DownloadButton).click();
		return this;
	}

	public TargetList clickWith_RationaleButton() {
		waitForVisibleFluentWait(With_RationaleButton).click();
		return this;
	}

	public TargetList clickWithout_RationaleButton() {
		Without_RationaleButton.click();
		return this;
	}

	public TargetList makeOwner() {
		//WebElement element = findElement(By.xpath("//div[3]/md-menu-content/md-menu-item[1]"));
		//WebElement element = findElement(By.xpath("//md-menu-item[contains(.,'Make Owner')]"));
		//element.click();
		waitForVisibleFluentWait(makeOwnerOption).click();
		return this;
	}

	public String getmakeOwnerConfirmationToast() {
		WebElement element = findElement(By.xpath("//div[2]/md-dialog/div/div[2]/div[3]/div/div[2]/div[2]/div[1]/p"));
		return element.getText();
	}

	public TargetList cancelMakeOwnerConfirmationToast() {
		WebElement element = findElement(By.xpath("//div[@class='hide-wrapper hide-icon-wrapper hide-row']"));
		element.click();

		return this;
	}

	public TargetList clickContinueTransfer() {
		WebElement element = findElement(By.xpath("//a[@ng-click='tld.makeOwner(collaborator.user.employeeId)']"));
		element.click();

		return this;
	}

	public String getManageTargetListContents() {
		WebElement element = findElement(By.xpath("//div[@class='collaborator-list']"));

		return element.getText().trim();
	}

	public TargetList cancelManageTargetList() {
		WebElement element = findElement(By.xpath("//p[@class='cancel accent']"));
		element.click();

		return this;
	}

	public String getDeleteListText() {
		WebElement element = findElement(By.xpath("//md-content/navbar/div[2]"));
		return element.getText().trim();
	}

	public String getCannotDeleteListText() {
		WebElement element = findElement(By.xpath("//md-content/navbar/div[5]"));
		return element.getText().trim();
	}

	public TargetList clickSharedTargetList(String name) {
		WebElement MyTargetList = findElement(By.xpath("//h4[text()='" + name + "']"));
		MyTargetList.click();
		return this;
	}

	public String checkDeleteListExists() {
		WebElement element = findElement(By.xpath("//div[@class='modal-footer clearfix ng-scope']"));

		if (element.getText().contains("Delete List") && element.isEnabled()) {
			return "Delete list exists";
		}

		return "Delete List does not exists";
	}

	public TargetList clickTargetListCheckBox(String name) {
		// waitForVisible(By.xpath("//div/md-content/div[2]/ul/li[contains(.,'"+
		// name + "')]/div[1]/md-checkbox/div[1]"));
		WebElement MyTargetListCheckBox = findElement(By.xpath("//div/md-content/div[2]/ul/li[contains(.,'" + name + "')]/div[1]/md-checkbox/div[1]/div"));
		MyTargetListCheckBox.click();
		return this;
	}

	public TargetList clickArchiveButton() {
		waitForVisibleFluentWait(ArchiveButton).click();
		waitForVisible(By.xpath("//div[contains(.,'Target List Archived!')]"));
		return this;
	}

	public TargetList clickArchiveSpan() {
		Archivespan.click();
		return this;
	}

	public TargetList clickArchiveTargetList(String name) {
		// waitForVisible(By.xpath("//h4[text()='"+ name + "']"));
		WebElement ArchiveTargetList = findElement(By.xpath("//li[1]/div[2]/div[1]//h4[contains(.,'" + name + "')]"));
		waitForElementToClickable(ArchiveTargetList, true);
		System.out.println(name);
		// ArchiveTargetList.sendKeys(Keys.ENTER);

		JavascriptExecutor js = (JavascriptExecutor) driver;
		js.executeScript("arguments[0].click();", ArchiveTargetList);
		return this;

	}

	public String getTargetListURL() {
		waitForVisibleFluentWait(TargetListManageButton);
		String url = driver.getCurrentUrl();
		/*
		 * String segments[] = url.split(".com"); String href =
		 * segments[segments.length - 1];
		 */
		return url;
	}

	public TargetList clickTargetListUsingHrefValue(String elementHref) {
		WebElement targetListRow = findElement(By.cssSelector("div[href='" + elementHref + "']"));
		targetListRow.click();
		return this;
	}

	public TargetList openTargetListUsingURL(String URL) {
		driver.get(URL);
		return this;
	}

	public WebDriver getDriver() {
		return driver;
	}

	public WebElement getSettingsIcon() {
		return settingsIcon;
	}

	public WebElement getLogOutButton() {
		return logOutButton;
	}

	public WebElement getCreateNewList() {
		return createNewList;
	}

	public WebElement getCreateNewListModal() {
		return createNewListModal;
	}

	public WebElement getTargetList() {
		return targetList;
	}

	public WebElement getAndUpdateStoresWithOpportunities() {
		return opportunities;
	}

	public WebElement getNameTextBox() {
		return NameTextBox;
	}

	public WebElement getDescriptionTextBox() {
		return DescriptionTextBox;
	}

	public WebElement getSaveButton() {
		return SaveButton;
	}

	public WebElement getCollaborator() {
		return collaborator;
	}

	public WebElement getDeleteList() {
		return deleteList;
	}

	public WebElement getDelete() {
		return delete;
	}

	public WebElement getTargetListManageButton() {
		return TargetListManageButton;
	}

	public WebElement getCollaboratorTextBox() {
		return CollaboratorTextBox;
	}

	public WebElement getSearchButton() {
		return SearchButton;
	}

	public WebElement getSaveCollaboratorButton() {
		return SaveCollaboratorButton;
	}

	public WebElement getAllowCollaboratorCheckBox() {
		return AllowCollaboratorCheckBox;
	}

	public WebElement getSearchOpportunityButton() {
		return SearchOpportunityButton;
	}

	public WebElement getOnPremiseRadioButton() {
		return OnPremiseRadioButton;
	}

	public WebElement getAccountsSubnameTextBox() {
		return AccountsSubnameTextBox;
	}

	public WebElement getApplyFIlterButton() {
		return applyFilterButton;
	}

	public WebElement getFirst_store_opportunity() {
		return first_store_opportunity;
	}

	public WebElement getFirstOpportunity() {
		return firstOpportunity;
	}

	public WebElement getAddToTargetListButton() {
		return AddToTargetListButton;
	}

	public WebElement getCreatNewListButton() {
		return CreatNewListButton;
	}

	public WebElement getRemoveOpportunity() {
		return removeOpportunity;
	}

	public WebElement getSelectALL() {
		return selectALL;
	}

	public WebElement getExpandAll() {
		return expandAll;
	}

	public WebElement getSharedWithMeLink() {
		return sharedWithMeLink;
	}

	public List<WebElement> getSharedWithMe1() {
		return sharedWithMe1;
	}

	public WebElement getHomePage() {
		return homePage;
	}

	public WebElement getCopyToTargetListButton() {
		return copyToTargetListButton;
	}

	public WebElement getOffPremiseRadioButton() {
		return OffPremiseRadioButton;
	}

	public WebElement getDistributorTextBox() {
		return DistributorTextBox;
	}

	public WebElement getOpportunityStatusCheckBox() {
		return OpportunityStatusCheckBox;
	}

	public WebElement getDistributorSearchButton() {
		return DistributorSearchButton;
	}

	public WebElement getMyAccountCheckBox() {
		return MyAccountCheckBox;
	}

	public WebElement getActionButton() {
		return ActionButton;
	}

	public WebElement getDownloadButton() {
		return DownloadButton;
	}

	public WebElement getWith_RationaleButton() {
		return With_RationaleButton;
	}

	public WebElement getWithout_RationaleButton() {
		return Without_RationaleButton;
	}

	public WebElement getDeleteTarget() {
		return deleteTarget;
	}

	public WebElement getArchiveButton() {
		return ArchiveButton;
	}

	public WebElement getArchivespan() {
		return Archivespan;
	}

	public WebElement getYesDelete() {
		return yesDelete;
	}

	public WebElement getSelectAllTargetListsButton() {
		return selectAllTargetListsButton;
	}

	public TargetList typeDistributor(String name) {
		distributor.sendKeys(name);
		WebElement element = distributor.findElement(By.xpath("//input[contains(@class,'submit-btn visible')]"));
		waitForElementToClickable(element, true).click();
		WebElement element1 = findElement(By.xpath("//div[3]/inline-search[1]/div[1]/div[1]/ul[1]/li[1]/span[1]"));
		waitForElementToClickable(element1, true).click();
		return this;
	}

	public TargetList selectAccountScope() {
		accountScope.click();
		return this;
	}

	public TargetList clickFirstTargetList() {
		waitForVisibleFluentWait(targetListRows.get(0)).click();
		waitForVisibleFluentWait(TargetListManageButton);
		return this;
	}

	public TargetList clickNewTargetListUsingXpath(String name) {
		WebElement MyTargetList = findElement(By.xpath("//h4[contains(.'" + name + "']"));
		waitForVisibleFluentWait(MyTargetList);
		System.out.println(MyTargetList.getText());
		JavascriptExecutor js = (JavascriptExecutor) driver;
		js.executeScript("arguments[0].click();", MyTargetList);
		return this;

	}

	public String sharedTargetList(String listName){
		WebElement list = findElement(By.xpath("//h4[contains(.,'"+listName+"')]"));
		return list.getText();
	}

	public TargetList EnterCollaboratorName(String name) {
		WebElement textbox = findElement(By.cssSelector("input[placeholder='Name or CBI email address']"));
		textbox.clear();
		textbox.sendKeys(name);
		return this;
	}

}
