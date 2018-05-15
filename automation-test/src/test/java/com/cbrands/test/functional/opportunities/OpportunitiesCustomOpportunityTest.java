package com.cbrands.test.functional.opportunities;

import java.lang.reflect.Method;
import java.net.MalformedURLException;
import org.openqa.selenium.support.PageFactory;
import org.testng.Assert;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;
import com.cbrands.TestUser;
import com.cbrands.pages.CustomOpportunityModal;
import com.cbrands.pages.LoginPage;
import com.cbrands.pages.LogoutPage;
import com.cbrands.pages.opportunities.OpportunitiesPage;
import com.cbrands.test.BaseTestCase;

public class OpportunitiesCustomOpportunityTest extends BaseTestCase {
  private CustomOpportunityModal customOpportunityModal;

  @BeforeMethod
  public void setUp(Method method) throws MalformedURLException {
    final String testCaseName = method.getAnnotation(Test.class).description();
    final String sauceTitle = String.format("Functional - Opportunities - Custom Opportunity - %s", testCaseName);
    final OpportunitiesPage opportunitiesPage;
    this.startUpBrowser(sauceTitle);

    PageFactory.initElements(driver, LoginPage.class).loginAs(TestUser.ACTOR4);
    customOpportunityModal = PageFactory.initElements(driver, CustomOpportunityModal.class);
    opportunitiesPage = PageFactory.initElements(driver, OpportunitiesPage.class);
    opportunitiesPage.goToPage();    
    Assert.assertTrue(
        opportunitiesPage.dismissStrayBackdropElement(),
        "Error resetting focus to element"
      );
  }

  @AfterMethod
  public void tearDown() {
    PageFactory.initElements(driver, LogoutPage.class).goToPage();
    this.shutDownBrowser();
  }

  @Test(description = "Attempt to save a custom opportunity without completing required fields")
  public void attemptToSaveBlankCustomOpportunity() {
    customOpportunityModal = customOpportunityModal
        .launchModal()
        .clickAddButton();

    Assert.assertTrue(customOpportunityModal.isAccountRequiredFieldErrorDisplayed(), 
        "Required field message for Account failed to display" );

    Assert.assertTrue(customOpportunityModal.isRecommendedPackageSkuRequiredFieldErrorDisplayed(), 
        "Required field message for Recommended Package/SKU failed to display" );

    Assert.assertTrue(customOpportunityModal.isRationaleRequiredFieldErrorDisplayed(), 
        "Rationale required field message is not displayed" );

    Assert.assertTrue(customOpportunityModal.isImpactRequiredFieldErrorDisplayed(), 
        "Required field message for Impact failed to display" );

    Assert.assertTrue(customOpportunityModal.clickOutsideModal().isModalDisplayed(), 
        "Add Opportunity Modal failed to close after clicking outside modal dialog");

    Assert.assertTrue(customOpportunityModal.clickCancelButton().isModalClosed(),
        "Add Opportunity modal failed to close after canceling modal dialog");
  }
}