package com.cbrands;

/**
 * Test users for automated testing.
 */
public enum TestUser {

  ACTOR1 ("juan.baez@cbrands.com", "Corona.2016", "Juan", "Baez"),
  ACTOR2 ("stash.rowley@cbrands.com", "Corona.2016", "Stash", ""),
  ACTOR3 ("eric.ramey@cbrands.com", "Corona.2016", "Eric", "Ramey"),
  ACTOR4 ("chris.williams@cbrands.com", "Corona.2016", "Chris", "Williams");

  private final String userName;
  private final String password;
  private final String firstName;
  private final String lastName;

  TestUser(String username, String password, String firstName, String lastName) {
    this.userName = username;
    this.password = password;
    this.firstName = firstName;
    this.lastName = lastName;
  }

  public String userName(){
    return userName;
  }

  public String password(){
    return password;
  }

  public String firstName(){
    return firstName;
  }

  public String lastName(){
    return lastName;
  }

}