package com.cbrands.test.functional.opportunities;

import java.lang.reflect.Method;
import java.net.MalformedURLException;

import org.openqa.selenium.support.PageFactory;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

import com.cbrands.pages.CustomOpportunityModal;
import com.cbrands.pages.LogoutPage;
import com.cbrands.test.BaseTestCase;

public class OpportunitiesCustomOpportunityTest extends BaseTestCase {

  private CustomOpportunityModal moC;

  @BeforeMethod
  public void setUp(Method method) throws MalformedURLException {
    final String testCaseName = method.getAnnotation(Test.class).description();

    final String sauceTitle = String.format("Functional - Opportunities - Saved Reports Test - %s", testCaseName);
    this.startUpBrowser(sauceTitle);

    moC = new CustomOpportunityModal( driver );
  }

  @Test
  public void attemptToSaveBlankCustomOpportunity() {
    
  }

  @AfterMethod
  public void tearDown() {
    PageFactory.initElements(driver, LogoutPage.class).goToPage();
    this.shutDownBrowser();
  }  
}
