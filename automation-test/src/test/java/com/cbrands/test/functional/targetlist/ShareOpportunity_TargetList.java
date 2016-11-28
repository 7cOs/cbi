package com.cbrands.test.functional.targetlist;

import static com.cbrands.SeleniumUtils.waitForElementVisible;
import static net.javacrumbs.hamcrest.logger.HamcrestLoggerMatcher.log;
import static org.hamcrest.CoreMatchers.containsString;
import static org.hamcrest.MatcherAssert.assertThat;

import org.testng.annotations.AfterMethod;
import org.testng.annotations.DataProvider;
import org.testng.annotations.Test;

import com.cbrands.BaseSeleniumTestCase;
import com.cbrands.pages.Login;

public class ShareOpportunity_TargetList extends BaseSeleniumTestCase {
	
	@Test(dataProvider="targetlistData1", description="US12999: AT_Target List_Share An Opportunity",priority=1)
	public void shareOpportunity(String listname,String sendTo1, String sendTo2){
		System.out.println("");
		login = new Login(driver);
		homePage = login.loginWithValidCredentials(ACTOR1_USER_NAME, ACTOR1_PASSWORD);
		
		targetListPage = homePage.navigateTargetList();
		
		if(targetListPage.checkTargetListExists(listname)){
			targetListPage.clickNewTargetList(listname);
			waitForElementVisible(targetListPage.expandAll, true);
			
			if(targetListPage.expandAll.isEnabled()){
			targetListPage.clickExpandAll();
			targetListPage.clickFirstRecord();
			targetListPage.clickSendTo(sendTo1, sendTo2);
			
			assertThat(targetListPage.getOpportunitySent(),log(containsString("Opportunity Sent!")));
			
			signOut();
			login = new Login(driver);
			homePage = login.loginWithValidCredentials(ACTOR2_USER_NAME, ACTOR2_PASSWORD);
			
			signOut();
			login = new Login(driver);
			homePage = login.loginWithValidCredentials(ACTOR3_USER_NAME, ACTOR3_PASSWORD);
			
			}
			else{
				assertThat("There is no opportunity in Target List" + listname, !targetListPage.expandAll.isEnabled());
			}
		}
		else{
			assertThat("Target List Does not exists. Create Target List " + listname, !targetListPage.checkTargetListExists(listname));
		}
	}
	
	

	@DataProvider(name="targetlistData1")
	public static Object[][] data1(){
		return new Object[][]{{"Smoke Test", "Stan Rowley","Eric Ramey"}};
	}
	
	
	@AfterMethod
	public void signOut() {
		logout();
	}

}
