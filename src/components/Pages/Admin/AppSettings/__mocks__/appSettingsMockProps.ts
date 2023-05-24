export const appSettingsMockProps = {
  appSettings: {
    BONUS_CREDIT_FREE_ENTRY_EQUIVALENT: '25',
    STAKE_TYPE_FREE_ENTRY: 'ALL_IN,INSURED',
    NUMBER_OF_PLAYERS_FREE_ENTRY: '2,3,4',
    MAX_MATCH_DEPOSIT_AMOUNT: '100',
    DEPOSIT_AMOUNT_OPTIONS: '10,25,50,75,100,200',
    RELOAD_BONUS_TYPE: 'FLAT',
    RELOAD_BONUS_AMOUNT: '0',
    MAX_RETENTION_BONUS: '50',
    RETENTION_BONUS_WEEKLY_CHANCE: '1',
    RETENTION_BONUS_MATCH_MULTIPLIER: '1',
    REFERRAL_CREDIT_AMOUNT: '25',
    REFERRAL_CUSTOM_TEXT:
      'Refer a friend from the link or code in your profile and get $25 in bonus credit!!',
    MIN_BET_AMOUNT: '1',
    MAX_BET_AMOUNT: '50',
    MAX_MARKET_ODDS: '150',
    MIN_MARKET_ODDS: '-150',
    initial: false,
    CHALLENGE_PROMO_MESSAGE:
      'Pick 2-4 players. Predict if they will get MORE or LESS than their projection.',
    REPEAT_ENTRIES_LIMIT: '1',
  },
  onSubmit: () => console.log('onSubmit'),
};
