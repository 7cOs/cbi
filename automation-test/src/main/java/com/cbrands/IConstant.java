package com.cbrands;

import static com.cbrands.TestUser.*;

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

  /** The actor1 user name. */
  String ACTOR1_USER_NAME = ACTOR1.userName();

  /** The actor1 password. */
  String ACTOR1_PASSWORD = ACTOR1.password();

  /** The actor1 first name. */
  String ACTOR1_FIRST_NAME = ACTOR1.firstName();

  /** The actor1 last name. */
  String ACTOR1_LAST_NAME = ACTOR1.lastName();

  /** The actor2 user name. */
  String ACTOR2_USER_NAME = ACTOR2.userName();

  /** The actor2 password. */
  String ACTOR2_PASSWORD = ACTOR2.password();

  /** The actor2 first name. */
  String ACTOR2_FIRST_NAME = ACTOR2.firstName();

  /** The actor3 user name. */
  String ACTOR3_USER_NAME = ACTOR3.userName();

  /** The actor3 password. */
  String ACTOR3_PASSWORD =   ACTOR3.password();

  /** The actor3 first name. */
  String ACTOR3_FIRST_NAME = ACTOR3.firstName();

  /** The actor4 user name. */
  String ACTOR4_USER_NAME = ACTOR4.userName();

  /** The actor4 password. */
  String ACTOR4_PASSWORD = ACTOR4.password();

  /** The actor4 first name. */
  String ACTOR4_FIRST_NAME = ACTOR4.firstName();
}
