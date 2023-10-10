import { LeagueLimitType } from '~/schemas/LeagueLimitFormValidationSchema';
import { ContestCategory, League } from '@prisma/client';
import { calculatePayout } from '~/utils/calculatePayout';

describe('calculatePayout', () => {
  const mockBet = {
    stake: 100,
    legs: [{ league: League.NFL }, { league: League.MLB }],
    contestCategory: {
      id: 'categoryId',
      numberOfPicks: 2,
      allInPayoutMultiplier: 1.5,
      primaryInsuredPayoutMultiplier: 2,
      secondaryInsuredPayoutMultiplier: 1.2,
    } as ContestCategory,
  };

  const mockLeagueLimits: LeagueLimitType[] = [
    {
      id: 'limitId1',
      enabled: true,
      league: League.NFL,
      minStake: 0,
      maxStake: 1000,
      teamSelectionLimit: 10,
      contestCategoryLeagueLimits: [
        {
          contestCategoryId: 'categoryId',
          numberOfPicks: 2,
          enabled: true,
          allInPayoutMultiplier: 1.2,
          primaryInsuredPayoutMultiplier: 1.5,
          secondaryInsuredPayoutMultiplier: 0.5,
        },
      ],
    },
    {
      id: 'limitId2',
      enabled: true,
      league: League.MLB,
      minStake: 0,
      maxStake: 500,
      teamSelectionLimit: 8,
      contestCategoryLeagueLimits: [
        {
          contestCategoryId: 'categoryId',
          numberOfPicks: 2,
          enabled: true,
          allInPayoutMultiplier: 1.4,
          primaryInsuredPayoutMultiplier: 1.8,
          secondaryInsuredPayoutMultiplier: 1.1,
        },
      ],
    },
    {
      id: 'limitId3',
      enabled: true,
      league: League.NBA,
      minStake: 0,
      maxStake: 1500,
      teamSelectionLimit: 12,
      contestCategoryLeagueLimits: [
        {
          contestCategoryId: 'categoryId',
          numberOfPicks: 2,
          enabled: false,
          allInPayoutMultiplier: 1.3,
          primaryInsuredPayoutMultiplier: 1.6,
          secondaryInsuredPayoutMultiplier: 1.3,
        },
      ],
    },
  ];

  it('calculates payout with league limits', () => {
    const payout = calculatePayout(mockBet, mockLeagueLimits);

    expect(payout.numberOfPicks).toBe(2);
    expect(payout.allInPayout).toBe(120);
    expect(payout.primaryInsuredPayout).toBe(150);
    expect(payout.secondaryInsuredPayout).toBe(50);
  });

  it('calculates payout using the default multiplier if league multiplier is disabled', () => {
    const payout = calculatePayout({
      ...mockBet,
      legs: [{ league: League.NBA }, { league: League.NBA }],
    });

    expect(payout.numberOfPicks).toBe(2);
    expect(payout.allInPayout).toBe(150);
    expect(payout.primaryInsuredPayout).toBe(200);
    expect(payout.secondaryInsuredPayout).toBe(120);
  });

  it('calculates payout without league limits', () => {
    const payout = calculatePayout(mockBet);

    expect(payout.numberOfPicks).toBe(2);
    expect(payout.allInPayout).toBe(150);
    expect(payout.primaryInsuredPayout).toBe(200);
    expect(payout.secondaryInsuredPayout).toBe(120);
  });
});
