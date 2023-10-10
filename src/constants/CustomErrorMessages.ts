export enum CustomErrorMessages {
  NOT_AUTHENTICATED_ERROR = 'You must be authenticated to access this function.',
  DEFAULT = 'Oops! Something went wrong. Please try again later.',

  /** User Role **/
  UNAUTHORIZED_ROLE = 'User does not have role permissions for this function.',
  PERMISSION_REQUIRED = `You don't have permission to add/remove amount available to withdraw.`,

  /** Login **/
  LOGIN = 'Sorry, we can’t sign in to your account.  Please contact support with questions!',
  INVALID_EMAIL_PASSWORD = 'Invalid email or password!',
  INVALID_PASSWORD = 'Invalid password!',
  USER_NOT_FOUND = 'User not found.',
  EMAIL_NOT_FOUND = 'User email not found.',
  LOGIN_REQUIRED = 'Login required.',
  LOGOUT_ERROR = 'This user is already signed out.',
  DELETE_ACCOUNT = 'Your account has been deleted.',

  /** Sign Up **/
  SIGNUP_ERROR = 'There was an error registering. Please try again later.',
  SIGNUP_DUPLICATE_ERROR = 'Sorry, user already registered.',
  NOT_VERIFIED = 'Your account is not verified. Please contact support with questions!',
  FAILED_VERIFICATION = 'User verification failed. You have provided incorrect/invalid information. Please try again.',
  SIGNUP_INVALID_PHONE = 'Invalid phone number.',

  /** TSEVO **/
  GIDX_DEFAULT = 'Oops! Something went wrong with your account. Please contact support with questions!',
  'ID-UA18' = 'Looks like you’re not of age to participate on our site. Please contact support with questions!',
  'ID-UA19' = 'Looks like you’re not of age to participate on our site. Please contact support with questions!',
  'ID-UA21' = 'Looks like you’re not of age to participate on our site. Please contact support with questions!',
  'ID-EX' = 'Whoops looks like you already have an account in our system. Please login to your original account.',
  'ID-BLOCK' = 'Your account isn’t active please contact support with questions.',
  'ID-HR' = 'Your account isn’t active please contact support with questions.',
  'ID-HVEL-ACTV' = 'Please contact support to verify your account.',
  'LL-BLOCK' = `Unfortunately you're in a location we aren't yet live in. Please check back soon as we always are adding more states! Contact us with Q's.`,
  BLOCKED_COLLEGE_SPORTS_ERROR = 'Sorry, your state doesn’t allow contests based on college sports.',
  ACCOUNT_TRANSACTION = 'Sorry, we were unable to process your transaction at this time. Please contact support with questions!',
  PAYMENT_METHOD = 'Sorry, we were unable to save your payment method at this time. Please contact support with questions!',
  CONTACT_US = 'Sorry, something went wrong. Please try again later!',
  SESSION_NOT_FOUND = 'Session not found.',
  USER_ACCOUNT_DETAILS_NOT_FOUND = 'Could not get the account details.',

  /** Forgot Password **/
  PASSWORD_RESET = 'There was an error sending password reset link.',
  PASSWORD_RESET_EXPIRED = 'Password reset token has expired/invalid. Please try resetting your password via email again.',
  PASSWORD_UPDATE_LINK = 'There was an error updating your password. Please request a new password reset link.',

  /** Place Entry **/
  SUBMIT_ENTRY_ERROR = 'Error submitting entry. Please try again!',
  INSUFFICIENT_FUNDS_ERROR = 'Insufficient funds. Please deposit funds in your account and try again.',
  NOT_OF_AGE_STATE_ERROR = 'Sorry you’re not of age to participate in your state!',
  SUSPENDED_PLACE_BET = 'Sorry you’re not allowed to place an entry at this time. Please contact support with questions!',
  ACCOUNT_INACTIVE = 'Your account is inactive. Please contact support.',

  /** Referrals **/
  DUPLICATE_REFERRAL_CODE = 'Referral Code is already in use. Please try another code.',
  REFERRAL_CODE_NOT_FOUND = 'Referral Code not found.',
  REFERRAL_USER_NOT_FOUND = 'Referral user not found.',

  /** Market **/
  DELETE_MARKET_ERROR = 'Unable to delete market. Someone already placed an entry.',

  /** Contest **/
  CONTEST_REQUIRE_LOGIN = 'You must be logged in to view contests.',
  CONTEST_NOT_FOUND = 'Contest not found.',
  CONTEST_LATE_ENTRY = `It's too late to join this contest.`,
  CONTEST_DUPLICATE_ENTRY = 'Already registered for this contest.',
  CONTEST_INSUFFICIENT_FUNDS = 'Insufficient funds. Please deposit funds in your account and try again.',
  CONTEST_ENTRY_MISSING = 'Missing contest entry for this user.',

  /** TOURNAMENT **/
  TOURNAMENT_NOT_FOUND = 'Tournament not found.',
  TOURNAMENT_DELETE_ERROR = 'There was an error deleting tournament event. Please try again later.',
  TOURNAMENT_DELETE_WITH_ENTRY_ERROR = 'Unable to delete tournament. Someone already placed an entry.',
  TOURNAMENT_SAVE_ERROR = 'There was an error saving tournament event. Please try again later.',
  TOURNAMENT_COPY_ERROR = 'There was an error copying tournament event. Please try again later.',
  TOURNAMENT_EVENT_NOT_FOUND = 'Tournament event not found.',
  UNABLE_TO_DELETE_TEAM = 'Sorry, you cannot delete this team. It is already in use.',
  UNABLE_TO_DELETE_PLAYER = 'Sorry, you cannot delete this player. It is already in use.',
  OFFER_COPY_ERROR = 'There was an error copying offer. Please try again later.',
  OFFER_DELETE_ERROR = 'There was an error deleting the offer. Please try again later.',
  OFFER_DELETE_WITH_ENTRY_ERROR = 'Unable to delete offer. Someone already placed an entry.',

  /** Bet **/
  BET_LEG_NOT_FOUND = 'Entry leg not found.',
  BET_STAKE_NOT_ALLOWED = `Entry amount is not allowed.`,
  BET_ENTRY_AMOUNT_ALLOWED = `Entry amount is not allowed.`,
  BET_REPEAT_ENTRY_LIMIT = `Sorry, you have reached the limit for repeating the same offers in an entry. Please choose different offers to continue.`,
  BET_PICK_NOT_AVAILABLE = `Sorry, but the pick you have selected is not available. Please choose another pick.`,
  BET_PICK_FREE_SQUARE_LIMIT = `Sorry, you have reached the limit for repeating the same free square offer in an entry. Please choose different offers to continue.`,
  BET_FREE_SQUARE_FREE_ENTRY_ERROR = `Sorry, You cannot select a Free Square in a Free Entry. Please choose another pick.`,

  /** AppSettings **/
  APP_SETTINGS_NOT_FOUND = 'App settings not found.',

  /** Bonus Credit Limits **/
  FREE_ENTRY_NOT_ALLOWED = 'Free entry is not allowed. Please add more picks to your entry.',
}
