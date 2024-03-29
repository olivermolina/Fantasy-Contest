import { League } from '@prisma/client';

export const leagueLimitsMock = [
  {
    id: 'NFL',
    league: League.NFL,
    enabled: false,
    minStake: 1,
    maxStake: 10,
    teamSelectionLimit: 0,
    contestCategoryLeagueLimits: [
      {
        contestCategoryId: 'c2b4d6c7-f22c-4347-88bd-cee80ab06169',
        numberOfPicks: 2,
        enabled: false,
        allInPayoutMultiplier: 3,
        primaryInsuredPayoutMultiplier: 2,
        secondaryInsuredPayoutMultiplier: 0.5,
      },
      {
        contestCategoryId: 'd78d68f7-e680-4f1f-b83d-2156f6fa28d8',
        numberOfPicks: 3,
        enabled: false,
        allInPayoutMultiplier: 5,
        primaryInsuredPayoutMultiplier: 2.5,
        secondaryInsuredPayoutMultiplier: 1.25,
      },
      {
        contestCategoryId: '045e43ab-ef16-4ed5-9191-95edad4529a7',
        numberOfPicks: 4,
        enabled: false,
        allInPayoutMultiplier: 10,
        primaryInsuredPayoutMultiplier: 5,
        secondaryInsuredPayoutMultiplier: 1.25,
      },
      {
        contestCategoryId: 'd2c27bdc-8688-4d9b-b982-da866098bb65',
        numberOfPicks: 5,
        enabled: false,
        allInPayoutMultiplier: 15,
        primaryInsuredPayoutMultiplier: 6,
        secondaryInsuredPayoutMultiplier: 2,
      },
    ],
  },
  {
    id: 'MLB',
    league: League.MLB,
    enabled: false,
    minStake: 0,
    maxStake: 1,
    teamSelectionLimit: 0,
    contestCategoryLeagueLimits: [
      {
        contestCategoryId: 'c2b4d6c7-f22c-4347-88bd-cee80ab06169',
        numberOfPicks: 2,
        enabled: false,
        allInPayoutMultiplier: 3,
        primaryInsuredPayoutMultiplier: 2,
        secondaryInsuredPayoutMultiplier: 0.5,
      },
      {
        contestCategoryId: 'd78d68f7-e680-4f1f-b83d-2156f6fa28d8',
        numberOfPicks: 3,
        enabled: false,
        allInPayoutMultiplier: 5,
        primaryInsuredPayoutMultiplier: 2.5,
        secondaryInsuredPayoutMultiplier: 1.25,
      },
      {
        contestCategoryId: '045e43ab-ef16-4ed5-9191-95edad4529a7',
        numberOfPicks: 4,
        enabled: false,
        allInPayoutMultiplier: 10,
        primaryInsuredPayoutMultiplier: 5,
        secondaryInsuredPayoutMultiplier: 1.25,
      },
      {
        contestCategoryId: 'd2c27bdc-8688-4d9b-b982-da866098bb65',
        numberOfPicks: 5,
        enabled: false,
        allInPayoutMultiplier: 15,
        primaryInsuredPayoutMultiplier: 6,
        secondaryInsuredPayoutMultiplier: 2,
      },
    ],
  },
  {
    id: 'NBA',
    league: League.NBA,
    enabled: false,
    minStake: 0,
    maxStake: 1,
    teamSelectionLimit: 0,
    contestCategoryLeagueLimits: [
      {
        contestCategoryId: 'c2b4d6c7-f22c-4347-88bd-cee80ab06169',
        numberOfPicks: 2,
        enabled: true,
        allInPayoutMultiplier: 4,
        primaryInsuredPayoutMultiplier: 2.5,
        secondaryInsuredPayoutMultiplier: 1.5,
      },
      {
        contestCategoryId: 'd78d68f7-e680-4f1f-b83d-2156f6fa28d8',
        numberOfPicks: 3,
        enabled: false,
        allInPayoutMultiplier: 5,
        primaryInsuredPayoutMultiplier: 2.5,
        secondaryInsuredPayoutMultiplier: 1.25,
      },
      {
        contestCategoryId: '045e43ab-ef16-4ed5-9191-95edad4529a7',
        numberOfPicks: 4,
        enabled: false,
        allInPayoutMultiplier: 10,
        primaryInsuredPayoutMultiplier: 5,
        secondaryInsuredPayoutMultiplier: 1.25,
      },
      {
        contestCategoryId: 'd2c27bdc-8688-4d9b-b982-da866098bb65',
        numberOfPicks: 5,
        enabled: false,
        allInPayoutMultiplier: 15,
        primaryInsuredPayoutMultiplier: 6,
        secondaryInsuredPayoutMultiplier: 2,
      },
    ],
  },
];
