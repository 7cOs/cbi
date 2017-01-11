package com.cbrands.test.functional.myperformance;

import org.testng.annotations.Test;

import com.cbrands.BaseSeleniumTestCase;
import com.cbrands.pages.Login;

public class US13475_AT_Scorecard_Depletions extends BaseSeleniumTestCase{

	@Test
	public void US13475_AT_Scorecard_Depletions() {
		login = new Login(driver);
		if(!login.isUserLoggedIn()) { 
			homePage = login.loginWithValidCredentials(ACTOR1_USER_NAME, ACTOR1_PASSWORD);
		}
		myScorecards = homePage.navigateToMyScoreCards();
		//driver.findElement(By.xpath("//p[contains(.,'Total Depletions / vs YA %')]"));
	}
}
