package com.cbrands.pages;

import com.cbrands.helper.PropertiesCache;
import org.testng.Assert;

/**
 * Base Page Object class to be extended by TestNG Page Object classes.
 *
 * Created by ediel on 7/18/17.
 */
public abstract class TestNGBasePage {
  protected static final String webAppBaseUrl = PropertiesCache.getInstance().getProperty("host.address");

	/**
   * This method safely loads the page that the page object class represents and asserts that the page is loaded. It
   * uses both the {@link #load()} and the {@link #isLoaded()} methods to accomplish this. Asserts that the result of
   * {@link #isLoaded()} is true using {@link Assert#assertTrue(boolean)}
   */
  public void goToPage() {
    load();
    Assert.assertTrue(isLoaded());
  }

	/**
   * This method loads the page that the page object class represents. The {#goToPage()} method uses this method to
   * navigate to the desired page safely.
   *
   * If the represented page is not directly loadable (for example, when it is a modal or shared component), please
   * use {Assert#fail(String)} and include a useful message why this method has not been implemented.
   */
  abstract protected void load();

	/**
   * This method is used to check if a defining major component on the page which this class represents has been
   * loaded. The {#goToPage()} method asserts that this method returns true.
   *
   * @return true, when a defining major component on the page has finished loading
   * false, if the component fails to load
   */
  abstract public boolean isLoaded();
}
