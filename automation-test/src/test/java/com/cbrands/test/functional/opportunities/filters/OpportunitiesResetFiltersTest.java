package com.cbrands.test.functional.opportunities.filters;


import com.cbrands.TestUser;
import com.cbrands.pages.LoginPage;
import com.cbrands.pages.LogoutPage;
import com.cbrands.pages.opportunities.OpportunitiesPage;
import com.cbrands.test.BaseTestCase;
import org.openqa.selenium.support.PageFactory;
import org.testng.Assert;
import org.testng.annotations.*;


public class OpportunitiesResetFiltersTest extends BaseTestCase {

  private OpportunitiesPage oppsPg;

  @BeforeClass
  public void setUpClass() throws Exception  {
	
	 this.startUpBrowser( "Functional - OpportunitiesResetFiltersTest" );
  }

  @AfterClass
  public void tearDownClass() {
    this.shutDownBrowser();
  }

  @AfterMethod
  public void tearDown() {
    PageFactory.initElements(driver, LogoutPage.class).goToPage();
  }

  
  @Test( description = "Reset filters before clicking Applying Filters button", 
	  dataProvider = "resetFiltersData", priority = 1, invocationCount = 1 )
  public void resetBeforeApplyingFilters( TestUser usr, String dist ) {
	  
	 loginToOpportunitiesPage( usr );

	 selectDistributor( oppsPg, dist );

	 Assert.assertTrue( oppsPg.isQueryChipPresent( dist ), 
			  "Selected distributor chip IS NOT present post distributor select" );
	  
	 oppsPg.clickResetFilters();
	  
	  Assert.assertFalse( oppsPg.isQueryChipPresent( dist ), 
				  "Selected distributor chip IS present post distributor select" );	  
  }


  public static void selectDistributor( OpportunitiesPage oppsPg, String dist ) {
	 oppsPg.enterDistributorSearchText( dist )
     	.clickSearchForDistributor()
     	.clickFirstDistributorResult();
  }
  
  
  @DataProvider
  public static Object[][] resetFiltersData() {
    return new Object[][]{
      {TestUser.ACTOR4, "Healy Wholesale"}
    };
  }
  
  private void loginToOpportunitiesPage(TestUser user) {
    PageFactory.initElements(driver, LoginPage.class).loginAs(user);
    oppsPg = PageFactory.initElements(driver, OpportunitiesPage.class);
    oppsPg.goToPage();
  }

}