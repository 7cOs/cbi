package com.cbrands.pages;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.support.PageFactory;

public class CustomOpportunityModal extends TestNGBasePage {

  private final WebDriver driver;
  
  public CustomOpportunityModal(WebDriver driver) {
    this.driver = driver;
    PageFactory.initElements(driver, this);
  }

  @Override
  protected void load() {
    // TODO Auto-generated method stub
    
  }

  @Override
  public boolean isLoaded() {
    // TODO Auto-generated method stub
    return false;
  }
}
