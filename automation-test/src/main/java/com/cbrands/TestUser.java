package com.cbrands;

/**
 * Test users for automated testing. Only valid users currently used in the ATs should be in this enum.
 */
public enum TestUser {
  ACTOR4("chris.williams@cbrands.com", "Corona.2016", "Chris", "Williams"),
  NOTES_ACTOR("chelsea.hoff@cbrands.com", "Corona.2016", "Chelsea", "Hoff");

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

  public String userName() {
    return userName;
  }

  public String password() {
    return password;
  }

  public String firstName() {
    return firstName;
  }

  public String lastName() {
    return lastName;
  }

}
