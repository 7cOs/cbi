package com.cbrands.legacy;

import com.cbrands.TestUser;

import static com.cbrands.TestUser.ACTOR4;

/**
 * The Interface IConstant.
 *
 * @deprecated This class is using the Java constant interface anti-pattern.
 * Please use the TestUser enum class instead of inheriting constants from implementing this class.
 *
 * @see TestUser
 */
@Deprecated
public interface IConstant {

  enum LegacyUser{
    @Deprecated
    ACTOR1 ("juan.baez@cbrands.com", "Corona.2016", "Juan", "Baez"),
    @Deprecated
    ACTOR2 ("stash.rowley@cbrands.com", "Corona.2016", "Stash", ""),
    @Deprecated
    ACTOR3 ("eric.ramey@cbrands.com", "Corona.2016", "Eric", "Ramey");

    private final String userName;
    private final String password;
    private final String firstName;
    private final String lastName;

    LegacyUser(String username, String password, String firstName, String lastName) {
      this.userName = username;
      this.password = password;
      this.firstName = firstName;
      this.lastName = lastName;
    }
  }

  /** The actor1 user name. */
  String ACTOR1_USER_NAME = LegacyUser.ACTOR1.userName;

  /** The actor1 password. */
  String ACTOR1_PASSWORD = LegacyUser.ACTOR1.password;

  /** The actor1 first name. */
  String ACTOR1_FIRST_NAME = LegacyUser.ACTOR1.firstName;

  /** The actor1 last name. */
  String ACTOR1_LAST_NAME = LegacyUser.ACTOR1.lastName;

  /** The actor2 user name. */
  String ACTOR2_USER_NAME = LegacyUser.ACTOR2.userName;

  /** The actor2 password. */
  String ACTOR2_PASSWORD = LegacyUser.ACTOR2.password;

  /** The actor2 first name. */
  String ACTOR2_FIRST_NAME = LegacyUser.ACTOR2.firstName;

  /** The actor3 user name. */
  String ACTOR3_USER_NAME = LegacyUser.ACTOR3.userName;

  /** The actor3 password. */
  String ACTOR3_PASSWORD =   LegacyUser.ACTOR3.password;

  /** The actor3 first name. */
  String ACTOR3_FIRST_NAME = LegacyUser.ACTOR3.firstName;

  /** The actor4 user name. */
  String ACTOR4_USER_NAME = ACTOR4.userName();

  /** The actor4 password. */
  String ACTOR4_PASSWORD = ACTOR4.password();

  /** The actor4 first name. */
  String ACTOR4_FIRST_NAME = ACTOR4.firstName();
}
