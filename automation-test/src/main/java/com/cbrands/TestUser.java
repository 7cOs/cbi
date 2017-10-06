package com.cbrands;

/**
 * Test users for automated testing. Only valid users currently used in the ATs should be in this enum.
 */
public enum TestUser {
  ACTOR4("chris.williams@cbrands.com", "Corona.2016", "Chris", "Williams", "Non-Corporate"),
  NOTES_ACTOR("chelsea.hoff@cbrands.com", "Corona.2016", "Chelsea", "Hoff", "Non-Corporate"),
  CORPORATE_ACTOR("colleen.mclaughlin@cbrands.com", "Corona.2016", "Colleen", "McLaughlin", "Corporate");

  private final String userName;
  private final String password;
  private final String firstName;
  private final String lastName;
  private final String role;

  TestUser(String username, String password, String firstName, String lastName, String role) {
    this.userName = username;
    this.password = password;
    this.firstName = firstName;
    this.lastName = lastName;
    this.role = role;
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

  public String role() {
    return role;
  }

}
