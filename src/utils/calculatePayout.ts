import { LeagueLimitType } from '~/schemas/LeagueLimitFormValidationSchema';
import { ContestCategory, League } from '@prisma/client';

export interface InsuredPayout {
  numberOfPicks: number;
  allInPayout: number;
  primaryInsuredPayout: number;
  secondaryInsuredPayout: number;
  allInPayoutMultiplier: number;
  primaryInsuredPayoutMultiplier: number;
  secondaryInsuredPayoutMultiplier: number;
}

export function calculatePayout(
  bet: {
    stake: number;
    legs: {
      league: League;
    }[];
    contestCategory: ContestCategory;
  },
  leagueLimits?: LeagueLimitType[],
): InsuredPayout {
  const { contestCategory, stake } = bet;
  const legs = 'legs' in bet ? bet.legs : [bet];
  const leagues = legs.map((leg: any) => leg.league);
  const minContestCategoryLeagueMultiplier = leagueLimits?.reduce(
    (
      acc: {
        allInPayoutMultiplier: number;
        primaryInsuredPayoutMultiplier: number;
        secondaryInsuredPayoutMultiplier: number;
      } | null,
      leagueLimit,
    ) => {
      if (leagues.includes(leagueLimit.league)) {
        const contestCategoryLeagueLimit =
          leagueLimit.contestCategoryLeagueLimits.find(
            (contestCategoryLeagueLimit) =>
              contestCategoryLeagueLimit.contestCategoryId ===
              contestCategory.id,
          );

        if (contestCategoryLeagueLimit && contestCategoryLeagueLimit.enabled) {
          return acc
            ? {
                allInPayoutMultiplier: Math.min(
                  acc.allInPayoutMultiplier,
                  contestCategoryLeagueLimit.allInPayoutMultiplier,
                ),
                primaryInsuredPayoutMultiplier: Math.min(
                  acc.primaryInsuredPayoutMultiplier,
                  contestCategoryLeagueLimit.primaryInsuredPayoutMultiplier,
                ),
                secondaryInsuredPayoutMultiplier: Math.min(
                  acc.secondaryInsuredPayoutMultiplier,
                  contestCategoryLeagueLimit.secondaryInsuredPayoutMultiplier,
                ),
              }
            : {
                allInPayoutMultiplier:
                  contestCategoryLeagueLimit.allInPayoutMultiplier,
                primaryInsuredPayoutMultiplier:
                  contestCategoryLeagueLimit.primaryInsuredPayoutMultiplier,
                secondaryInsuredPayoutMultiplier:
                  contestCategoryLeagueLimit.secondaryInsuredPayoutMultiplier,
              };
        }
      }
      return acc;
    },
    null,
  );

  if (minContestCategoryLeagueMultiplier) {
    return {
      numberOfPicks: contestCategory.numberOfPicks,
      allInPayout:
        minContestCategoryLeagueMultiplier.allInPayoutMultiplier * stake,
      primaryInsuredPayout:
        minContestCategoryLeagueMultiplier.primaryInsuredPayoutMultiplier *
        stake,
      secondaryInsuredPayout:
        minContestCategoryLeagueMultiplier.secondaryInsuredPayoutMultiplier *
        stake,
      allInPayoutMultiplier:
        minContestCategoryLeagueMultiplier.allInPayoutMultiplier,
      primaryInsuredPayoutMultiplier:
        minContestCategoryLeagueMultiplier.primaryInsuredPayoutMultiplier,
      secondaryInsuredPayoutMultiplier:
        minContestCategoryLeagueMultiplier.secondaryInsuredPayoutMultiplier,
    };
  }

  return {
    numberOfPicks: contestCategory.numberOfPicks,
    allInPayout: contestCategory.allInPayoutMultiplier * stake,
    primaryInsuredPayout:
      contestCategory.primaryInsuredPayoutMultiplier * stake,
    secondaryInsuredPayout:
      contestCategory.secondaryInsuredPayoutMultiplier * stake,
    allInPayoutMultiplier: contestCategory.allInPayoutMultiplier,
    primaryInsuredPayoutMultiplier:
      contestCategory.primaryInsuredPayoutMultiplier,
    secondaryInsuredPayoutMultiplier:
      contestCategory.secondaryInsuredPayoutMultiplier,
  };
}
