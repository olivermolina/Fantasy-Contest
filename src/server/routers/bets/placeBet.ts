import {
  AppSettingName,
  BetLegType,
  BetStakeType,
  BetStatus,
  BetType,
  ContestCategory,
  ContestEntry,
  ContestWagerType,
  League,
  Market,
  Prisma,
  Status,
  TransactionType,
  UserStatus,
} from '@prisma/client';
import { prisma } from '~/server/prisma';
import { calculateTotalOdds } from '~/utils/calculateTotalBets';
import { User } from '@supabase/supabase-js';
import { createTransaction } from '~/server/routers/bets/createTransaction';
import { ActionType } from '~/constants/ActionType';
import { IDeviceGPS } from '~/lib/tsevo-gidx/GIDX';
import { TRPCError } from '@trpc/server';
import { getUserTotalBalance } from '~/server/routers/user/userTotalBalance';
import { CustomErrorMessages } from '~/constants/CustomErrorMessages';
import { calculateBonusCreditStake } from '~/utils/calculateBonusCreditStake';
import { monitorUser } from '~/server/routers/bets/monitorUser';
import { getUserSettings } from '../appSettings/list';
import { DefaultAppSettings } from '~/constants/AppSettings';
import { getMarketTotalProjection } from '~/utils/getMarketTotalProjection';
import { verifyFreeSquarePickCategories } from '~/utils/verifyFreeSquarePickCategories';
import { isMarketAvailable } from '~/server/routers/contest/getFantasyOffers';
import dayjs from 'dayjs';
import { getEntryFeeLimits } from '~/utils/getEntryFeeLimits';
import { calculateFreeEntryStake } from '~/utils/calculateFreeEntryStake';
import { calculatePayout } from '~/utils/calculatePayout';

export type LegCreateInput = {
  total: number;
  marketId: Market['id'];
  marketSelId: Market['sel_id'];
  type: BetLegType;
  league: League;
  isFreeSquare: boolean;
  freeSquare?: {
    maxStake: number;
  };
};
export type BetInputType = {
  stake: number;
  contestId: ContestEntry['id'];
  type: BetType;
  legs: LegCreateInput[];
  contestCategoryId: ContestCategory['id'];
  stakeType: BetStakeType;
  ipAddress: string;
  deviceGPS: IDeviceGPS;
};

/**
 * Given a bet, will create the bet, a post for the bet, and update a users balance.
 *
 * Rules:
 * - Bets cannot challenge people if applying to a contest.
 * - Bets cannot be made with insufficient funds.
 * - Bets will default to challenging the house.
 * - Bets cannot be made on a game that is 15 minutes or less from being started.
 */
export async function placeBet(bet: BetInputType, user: User): Promise<void> {
  try {
    const {
      user: prismaUser,
      allAppSettings,
      userAppSettings,
      leagueLimits,
      bonusCreditLimits,
    } = await getUserSettings(user.id);
    if (!prismaUser) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: CustomErrorMessages.LOGIN_REQUIRED,
      });
    }

    if (prismaUser.status === UserStatus.SUSPENDED) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: CustomErrorMessages.SUSPENDED_PLACE_BET,
      });
    }

    const minBetAmount = Number(
      userAppSettings.find((s) => s.name === AppSettingName.MIN_BET_AMOUNT)
        ?.value || DefaultAppSettings.MIN_BET_AMOUNT,
    );
    const maxBetAmount = Number(
      userAppSettings.find((s) => s.name === AppSettingName.MAX_BET_AMOUNT)
        ?.value || DefaultAppSettings.MAX_BET_AMOUNT,
    );

    const maxDailyTotalBetAmount = Number(
      userAppSettings.find(
        (s) => s.name === AppSettingName.MAX_DAILY_TOTAL_BET_AMOUNT,
      )?.value || DefaultAppSettings.MAX_DAILY_TOTAL_BET_AMOUNT,
    );

    const contest = await prisma.contest.findFirstOrThrow({
      where: {
        id: bet.contestId,
      },
    });

    // Get user total available balance
    const { totalAmount, creditAmount } = await getUserTotalBalance(user.id);
    let bonusCreditStake = 0;
    let betStake = bet.stake;
    if (contest.wagerType === ContestWagerType.CASH) {
      bonusCreditStake = calculateBonusCreditStake(betStake, creditAmount);
      // If the user has bonus credit, we need to make sure that the bet stake is not more than the credit amount available
      betStake =
        bonusCreditStake > 0 && betStake > bonusCreditStake
          ? bonusCreditStake
          : betStake;
      if (betStake > totalAmount) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: CustomErrorMessages.INSUFFICIENT_FUNDS_ERROR,
        });
      }
    }
    const contestCategory = await prisma.contestCategory.findFirstOrThrow({
      where: {
        id: bet.contestCategoryId,
      },
    });

    const entryBonusCreditLimit = bonusCreditLimits.find(
      (bonusCreditLimit) => bonusCreditLimit.numberOfPicks === bet.legs.length,
    );

    if (bonusCreditStake > 0 && !entryBonusCreditLimit?.enabled) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: CustomErrorMessages.FREE_ENTRY_NOT_ALLOWED,
      });
    }

    const bonusCreditFreeEntryEquivalent =
      entryBonusCreditLimit?.bonusCreditFreeEntryEquivalent ||
      DefaultAppSettings.BONUS_CREDIT_FREE_ENTRY_EQUIVALENT;

    const freeEntryStake = calculateFreeEntryStake(
      creditAmount || 0,
      Number(bonusCreditFreeEntryEquivalent),
    );

    const entryFee = getEntryFeeLimits({
      bets: [
        {
          legs: bet.legs.map((leg) => ({
            freeSquare: leg.freeSquare
              ? {
                  maxStake: leg.freeSquare?.maxStake,
                }
              : undefined,
            league: leg.league,
          })),
        },
      ],
      freeEntryStake,
      contestCategory,
      allAppSettings,
      userAppSettings,
      leagueLimits,
      defaultMinMax: {
        min: minBetAmount,
        max: maxBetAmount,
      },
    });

    if (betStake < entryFee.min || betStake > entryFee.max) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: `${CustomErrorMessages.BET_STAKE_NOT_ALLOWED}. Please stake more than ${entryFee.min} and less than ${entryFee.max}. Stake: ${betStake}.`,
      });
    }

    // Check if the user has reached the daily limit of total bet amount allowed
    if (maxDailyTotalBetAmount > 0) {
      const betsDailyTotalAmount = await prisma.bet.aggregate({
        where: {
          userId: prismaUser.id,
          created_at: {
            gte: dayjs
              .tz(new Date().setHours(0, 0, 0, 0), 'America/New_York')
              .toDate(),
            lte: dayjs
              .tz(new Date().setHours(23, 59, 59, 999), 'America/New_York')
              .toDate(),
          },
        },
        _sum: {
          stake: true,
        },
      });

      const totalBetAmountConsidered =
        betStake + Number(betsDailyTotalAmount?._sum?.stake);

      if (totalBetAmountConsidered > maxDailyTotalBetAmount) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `${CustomErrorMessages.BET_ENTRY_AMOUNT_ALLOWED}. You have reached the daily limit of $${maxDailyTotalBetAmount}.`,
        });
      }
    }

    await monitorUser(bet, prismaUser);

    const isTeaser = bet.type === BetType.TEASER;

    const repeatEntriesLimit = Number(
      userAppSettings.find(
        (s) => s.name === AppSettingName.REPEAT_ENTRIES_LIMIT,
      )?.value || DefaultAppSettings.REPEAT_ENTRIES,
    );

    // Get the number of repeat entries the user has made with the same offers
    const repeatBets = await prisma.bet.findMany({
      where: {
        userId: prismaUser.id,
        legs: {
          every: {
            marketId: {
              in: bet.legs.map((l) => l.marketId),
            },
          },
        },
      },
      include: {
        legs: true,
      },
    });

    // if the user has reached the limit for repeating entry with the same picks, throw an error
    if (
      repeatBets.length > repeatEntriesLimit &&
      repeatBets.some((b) => b.legs.length === bet.legs.length)
    ) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: CustomErrorMessages.BET_REPEAT_ENTRY_LIMIT,
      });
    }

    const legs: Prisma.BetLegCreateManyBetInput[] = await Promise.all(
      bet.legs.map(async (leg): Promise<Prisma.BetLegCreateManyBetInput> => {
        const market = await prisma.market.findFirstOrThrow({
          where: {
            id: leg.marketId,
            sel_id: leg.marketSelId,
          },
          include: {
            FreeSquare: {
              include: {
                FreeSquareContestCategory: {
                  include: {
                    contestCategory: true,
                  },
                },
              },
            },
            offer: true,
          },
        });

        // If the market is not available, throw an error
        if (
          market.offer?.status !== Status.Scheduled ||
          !isMarketAvailable(market)
        ) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: CustomErrorMessages.BET_PICK_NOT_AVAILABLE,
          });
        }

        if (leg.isFreeSquare && market.FreeSquare) {
          const repeatEntryFreeSquare = await prisma.bet.count({
            where: {
              userId: prismaUser.id,
              legs: {
                some: {
                  marketId: leg.marketId,
                  total: getMarketTotalProjection(leg.total, market.FreeSquare),
                },
              },
            },
          });
          // If the user has already made a bet with the free square offer, throw an error
          if (repeatEntryFreeSquare > 0) {
            throw new TRPCError({
              code: 'FORBIDDEN',
              message: CustomErrorMessages.BET_PICK_FREE_SQUARE_LIMIT,
            });
          }
        }

        // if the market is a free square, make sure the user is allowed to select it in a free entry
        if (
          leg.isFreeSquare &&
          market.FreeSquare &&
          !market.FreeSquare.freeEntryEnabled &&
          creditAmount > 0
        ) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: CustomErrorMessages.BET_FREE_SQUARE_FREE_ENTRY_ERROR,
          });
        }

        // Check if the free square pick is allowed for the contest category
        if (leg.isFreeSquare) {
          try {
            // Will throw an error if the leg length is not enabled in the free square,
            verifyFreeSquarePickCategories(bet.legs.length, market.FreeSquare);
          } catch (e) {
            const error = e as Error;
            throw new TRPCError({
              code: 'FORBIDDEN',
              message: error.message,
            });
          }
        }

        return {
          type: leg.type,
          odds: getOdds(leg, market),
          marketId: leg.marketId,
          marketSel_id: leg.marketSelId,
          total: getMarketTotalProjection(
            leg.total,
            leg.isFreeSquare ? market.FreeSquare : null,
          ),
        };
      }),
    );

    const contestEntry = await prisma.contestEntry.findFirstOrThrow({
      where: {
        userId: prismaUser.id,
        contestsId: bet.contestId,
      },
    });

    const calculatedPayout = calculatePayout(
      {
        stake: Number(bet.stake),
        legs: bet.legs,
        contestCategory,
      },
      leagueLimits,
    );
    const payout = calculatedPayout.allInPayout;
    const odds = isTeaser
      ? -110
      : calculateTotalOdds(legs.map((l) => l.odds) as number[], 'american');

    await prisma.bet.create({
      data: {
        stake: betStake,
        cashStake: 0,
        bonusCreditStake,
        status: BetStatus.PENDING,
        owner: {
          connect: {
            id: prismaUser.id,
          },
        },
        payout: payout,
        type: bet.type,
        legs: {
          createMany: {
            data: legs,
          },
        },
        odds: odds,
        ContestEntries: {
          connect: {
            id: contestEntry.id,
          },
        },
        ContestCategory: {
          connect: {
            id: contestCategory.id,
          },
        },
        stakeType: bet.stakeType,
      },
    });

    if (contest.wagerType === ContestWagerType.CASH) {
      await createTransaction({
        userId: user.id,
        amountProcess: betStake,
        amountBonus: bonusCreditStake,
        contestEntryId: contestEntry.id,
        transactionType: TransactionType.DEBIT,
        actionType: ActionType.PLACE_BET,
      });
    }
  } catch (e) {
    if (e instanceof TRPCError) throw e;
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: CustomErrorMessages.SUBMIT_ENTRY_ERROR,
    });
  }
}

function getOdds(leg: LegCreateInput, market: Market): number {
  switch (leg.type) {
    case 'OVER_ODDS':
      if (!market.over) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message:
            'Missing [market.over] market for leg ' + JSON.stringify(leg),
        });
      }
      return market.over;
    case 'UNDER_ODDS':
      if (!market.under) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message:
            'Missing [market.under] market for leg ' + JSON.stringify(leg),
        });
      }
      return market.under;
    case 'SPREAD_AWAY_ODDS':
    case 'SPREAD_HOME_ODDS':
      if (!market.spread) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message:
            'Missing [market.under] market for leg ' + JSON.stringify(leg),
        });
      }
      return market.spread;
    case 'MONEYLINE_AWAY_ODDS':
    case 'MONEYLINE_HOME_ODDS':
      if (!market.moneyline) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message:
            'Missing [market.moneyline] market for leg ' + JSON.stringify(leg),
        });
      }
      return market.moneyline;
    default:
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: `Unknown odds type for leg: ${JSON.stringify(leg)}`,
      });
  }
}
