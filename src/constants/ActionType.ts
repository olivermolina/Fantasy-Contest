export enum ActionType {
  /*
   *  Deposit cash balance
   */
  PAY = 'PAY',
  /*
   *  Withdraw cash balance
   */
  PAYOUT = 'PAYOUT',
  /*
   *  Customer signup
   */
  CREATE_CUSTOMER = 'CREATE_CUSTOMER',
  /*
   *  GIDX user profile API query
   */
  GET_CUSTOMER_PROFILE = 'GET_CUSTOMER_PROFILE',
  /*
   *  Adding new payment method
   */
  SAVE_PAYMENT_METHOD = 'SAVE_PAYMENT_METHOD',
  /*
   *  GIDX payment details API query
   */
  PAYMENT_DETAILS = 'PAYMENT_DETAILS',
  /*
   *  Add bet/entry
   */
  PLACE_BET = 'PLACE_BET',
  /*
   *  Joining a contest
   */
  JOIN_CONTEST = 'JOIN_CONTEST',
  /*
   *  GIDX customer monitor API query
   */
  CUSTOMER_MONITOR = 'CUSTOMER_MONITOR',
  /*
   *  Winning a contest
   */
  TOKEN_CONTEST_WIN = 'TOKEN_CONTEST_WIN',
  /*
   *  Winning a cash bet/entry
   */
  CASH_CONTEST_WIN = 'CASH_CONTEST_WIN',
  /*
   *  Adding free credits to a user
   */
  ADD_FREE_CREDIT = 'ADD_FREE_CREDIT',
  /*
   *  GIDX customer registration API query
   */
  CUSTOMER_REGISTRATION = 'CUSTOMER_REGISTRATION',
  /*
   *  Refund bet/entry for no action picks
   */
  CASH_CONTEST_CANCELLED = 'CASH_CONTEST_CANCELLED',
  /*
   * Increment user's amount available to withdraw
   */
  ADD_WITHDRAWABLE = 'ADD_WITHDRAWABLE',
  /*
   * Decrease user's amount available to withdraw
   */
  REMOVE_WITHDRAWABLE = 'REMOVE_WITHDRAWABLE',
  /*
   * Convert cash balance to bonus credit
   * when the user accepts the offer to keep the cash balance on the platform
   */
  WITHDRAW_BONUS_CREDIT = 'WITHDRAW_BONUS_CREDIT',
}
