package com.cbrands.test.functional.targetlist; 

import static net.javacrumbs.hamcrest.logger.HamcrestLoggerMatcher.log;
import static org.hamcrest.CoreMatchers.containsString;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.equalToIgnoringCase;
import static org.hamcrest.Matchers.hasItems;


import java.util.List;

import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.testng.Assert;
import org.testng.annotations.DataProvider;
import org.testng.annotations.Test;

import com.cbrands.BaseSeleniumTestCase;
import com.cbrands.pages.HomePage;
import com.cbrands.pages.Login;

public class Add_Collaborators_to_Target_List extends BaseSeleniumTestCase{
	
	
	
	@Test(dataProvider = "targetData", description = "Create a new Target List", priority = 1)
	public void createTargetListNew(String name, String description,  String listname, String collaboratorname1, String collaboratorname2, String listname2) throws InterruptedException {
		
		login = new Login(driver);
		if(!login.isUserLoggedIn()) { 
			homePage = login.loginWithValidCredentials(ACTOR1_USER_NAME, ACTOR1_PASSWORD);
		}
				targetListPage = homePage.navigateTargetList();
				
				
				targetListPage.clickNewTargetList(listname);
			
				targetListPage.clickMangeButton();
	
				targetListPage.EnterCollaboratorNameTextBox(collaboratorname1);
				
				targetListPage.clickSearchButton();
				
				targetListPage.clickCollaboratorList(collaboratorname1);
		
				targetListPage.EnterCollaboratorNameTextBox(collaboratorname2);

				targetListPage.clickSearchButton();

				targetListPage.clickCollaboratorList(collaboratorname2);
			
				targetListPage.clickSaveCollaboratorButton();
				
				
				
				targetListPage = homePage.navigateTargetList();
				
	
				targetListPage.clickNewTargetList(listname2);

				
				targetListPage.clickMangeButton();
		
				targetListPage.EnterCollaboratorNameTextBox(collaboratorname2);
				
				targetListPage.clickSearchButton();
		
				targetListPage.clickCollaboratorList(collaboratorname2);
			
				targetListPage.clickAllowCollaboratorCheckBox();
				targetListPage.clickSaveCollaboratorButton();
				targetListPage.logOut();
				
			} 
	
	
	@DataProvider(name = "targetData")
	public static Object[][] data4() {
		return new Object[][] { { "US12830", "add collaborators to a Target List", "Automated Test Target List","eric.ramey@cbrands.com","stash.rowley@cbrands.com","Automated Test Target List 2" } };
	}
	
	
	
	

}
