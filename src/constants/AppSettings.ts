import { ReloadBonusType } from '~/constants/ReloadBonusType';

export const DefaultAppSettings = {
  MIN_BET_AMOUNT: 1,
  MAX_BET_AMOUNT: 100,
  REPEAT_ENTRIES: 0,
  MAX_RETENTION_BONUS: 100,
  RETENTION_BONUS_MATCH_MULTIPLIER: 1,
  RETENTION_BONUS_WEEKLY_CHANCE: 1,
  NUMBER_OF_PLAYERS_FREE_ENTRY: '2,3,4',
  STAKE_TYPE_FREE_ENTRY: 'ALL_IN,INSURED',
  BONUS_CREDIT_FREE_ENTRY_EQUIVALENT: 25,
  REFERRAL_CREDIT_AMOUNT: 25,
  MAX_MATCH_DEPOSIT_AMOUNT: 100,
  REFERRAL_CUSTOM_TEXT:
    'Refer a friend from the link or code in your profile and get $25 in bonus credit!',
  DEPOSIT_AMOUNT_OPTIONS: '10,25,50,75,100,200',
  RELOAD_BONUS_TYPE: ReloadBonusType.FLAT,
  RELOAD_BONUS_AMOUNT: 100,
  MIN_MARKET_ODDS: -150,
  MAX_MARKET_ODDS: 150,
  CHALLENGE_PROMO_MESSAGE:
    'Pick 2-4 players. Predict if they will get MORE or LESS than their projection.',
  SIGNUP_FREE_ENTRY: 1,
  MAX_DAILY_TOTAL_BET_AMOUNT: 0,
  WEEKLY_REFERRAL_MAX_AMOUNT_EARNED: '0',
  HOMEPAGE_HEADING_1: 'Daily Fantasy Contests!',
  HOMEPAGE_HEADING_2:
    'Select More or Less on player stats to win up to 35x your cash!',
  ACH_DEPOSIT_AUTO_APPROVE_COUNT: 3,
  MIN_DEPOSIT_AMOUNT: 20,
};
