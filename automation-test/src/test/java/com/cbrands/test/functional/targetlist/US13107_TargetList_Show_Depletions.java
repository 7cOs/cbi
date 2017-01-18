package com.cbrands.test.functional.targetlist;

import org.testng.annotations.Test;

import com.cbrands.BaseSeleniumTestCase;
import com.cbrands.helper.RetryAnalyzer;
import com.cbrands.pages.Login;

import static net.javacrumbs.hamcrest.logger.HamcrestLoggerMatcher.log;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.equalToIgnoringCase;
import static org.hamcrest.Matchers.hasItems;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.not;

import org.testng.annotations.AfterMethod;
import org.testng.annotations.DataProvider;

public class US13107_TargetList_Show_Depletions extends BaseSeleniumTestCase{
	
  @Test(retryAnalyzer = RetryAnalyzer.class,dataProvider="showDepletionsData", priority=1)
  public void us13107_TargetList_Show_Depletions(String listname, String listURL) {
	  login = new Login(driver);
	  homePage = login.loginWithValidCredentials(ACTOR4_USER_NAME, ACTOR4_PASSWORD);
	  homePage.get();
	  targetListPage = homePage.navigateTargetList();
		if(targetListPage.checkTargetLists(listname)){
			assertThat(targetListPage.getDepletionSince_TargetListPage(listname), log((not(equalToIgnoringCase("0")))));
			targetListPage.openTargetListUsingURL(listURL)
						  .getDepletionsSinceClosed();
			assertThat(targetListPage.getDepletionsSinceClosed(),log(is(not(equalTo("0CE")))));
		}
		else{
			assertThat(targetListPage.getTargetLists(), log(hasItems(not(equalToIgnoringCase(listname)))));
		}
	
  }
  
  @DataProvider(name = "showDepletionsData")
  public static Object[][] data1() {
	  return new Object[][] { {"Closed Oppty Test - DO NOT DELETE", "https://orion-qa.cbrands.com/target-lists/fc692d94-e17f-4085-945e-4d23768042db"} };
  }  
  
  @AfterMethod
  public void signOut() {
	  logout();
  }

}
