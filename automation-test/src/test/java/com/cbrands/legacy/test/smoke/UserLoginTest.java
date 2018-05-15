package com.cbrands.legacy.test.smoke;

import org.testng.annotations.AfterMethod;
import org.testng.annotations.DataProvider;
import org.testng.annotations.Test;

import com.cbrands.legacy.BaseSeleniumTestCase;
import com.cbrands.legacy.pages.Login;

/**
 * Logs in and out repeatedly as the same set of users.
 *
 * @deprecated This test should not be included in the test suite.
 * Please use the new Login testing file.
 */
@Deprecated
public class UserLoginTest extends BaseSeleniumTestCase{

	@Test(dataProvider = "data1")
	public void logIn(String user, String password) {
		login = new Login(driver);
		homePage = login.loginWithValidCredentials(user, password);
		homePage.get();
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
