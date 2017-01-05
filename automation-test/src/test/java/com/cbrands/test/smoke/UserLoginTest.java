package com.cbrands.test.smoke;

import org.testng.annotations.AfterMethod;
import org.testng.annotations.DataProvider;
import org.testng.annotations.Test;

import com.cbrands.BaseSeleniumTestCase;
import com.cbrands.pages.Login;

public class UserLoginTest extends BaseSeleniumTestCase{

	@Test(dataProvider = "data1")
	public void logIn(String user, String password) {
		login = new Login(driver);
		homePage = login.loginWithValidCredentials(user, password);
	}
	
	@AfterMethod
	public void signOut() {
		logout();
	}
	
	@DataProvider(name = "data1")
	public static Object[][] data1() {
		return new Object[][] { 
								{ "juan.baez@cbrands.com", "Corona.2016" } ,
								{ "stash.rowley@cbrands.com", "Corona.2016" } ,
								{ "eric.ramey@cbrands.com", "Corona.2016" } ,
								{ "chris.williams@cbrands.com", "Corona.2016" }, 
								{ "juan.baez@cbrands.com", "Corona.2016" } ,
								{ "stash.rowley@cbrands.com", "Corona.2016" } ,
								{ "eric.ramey@cbrands.com", "Corona.2016" } ,
								{ "chris.williams@cbrands.com", "Corona.2016" }, 
								{ "juan.baez@cbrands.com", "Corona.2016" } ,
								{ "stash.rowley@cbrands.com", "Corona.2016" } ,
								{ "eric.ramey@cbrands.com", "Corona.2016" } ,
								{ "chris.williams@cbrands.com", "Corona.2016" }, 
								{ "juan.baez@cbrands.com", "Corona.2016" } ,
								{ "stash.rowley@cbrands.com", "Corona.2016" } ,
								{ "eric.ramey@cbrands.com", "Corona.2016" } ,
								{ "chris.williams@cbrands.com", "Corona.2016" }, 
								{ "juan.baez@cbrands.com", "Corona.2016" } ,
								{ "stash.rowley@cbrands.com", "Corona.2016" } ,
								{ "eric.ramey@cbrands.com", "Corona.2016" } ,
								{ "chris.williams@cbrands.com", "Corona.2016" }, 
								{ "juan.baez@cbrands.com", "Corona.2016" } ,
								{ "stash.rowley@cbrands.com", "Corona.2016" } ,
								{ "eric.ramey@cbrands.com", "Corona.2016" } ,
								{ "chris.williams@cbrands.com", "Corona.2016" }
							  };
	}
}
