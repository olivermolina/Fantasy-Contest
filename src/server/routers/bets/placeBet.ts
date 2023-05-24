import * as yup from '~/utils/yup';
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
  TransactionType,
  UserStatus,
} from '@prisma/client';
import { prisma } from '~/server/prisma';
import { calculateTeaserPayout } from '~/utils/caculateTeaserPayout';
import { calculateParlayPayout } from '~/utils/calculateParlayPayout';
import { calculateTotalOdds } from '~/utils/calculateTotalBets';
import { User } from '@supabase/supabase-js';
import { createTransaction } from '~/server/routers/bets/createTransaction';
import { ActionType } from '~/constants/ActionType';
import { IDeviceGPS } from '~/lib/tsevo-gidx/GIDX';
import { TRPCError } from '@trpc/server';
import { getUserTotalBalance } from '~/server/routers/user/userTotalBalance';
import applyDepositDistribution from '~/server/routers/user/applyDepositDistribution';
import { CustomErrorMessages } from '~/constants/CustomErrorMessages';
import { calculateBonusCreditStake } from '~/utils/calculateBonusCreditStake';
import { monitorUser } from '~/server/routers/bets/monitorUser';
import { getUserSettings } from '../appSettings/list';
import { DefaultAppSettings } from '~/constants/AppSettings';
import { getMarketTotalProjection } from '~/utils/getMarketTotalProjection';
import { verifyFreeSquarePickCategories } from '~/utils/verifyFreeSquarePickCategories';

function placeBetSchema(isTeaser: boolean) {
  return yup.object().shape({
    /**
     * This is how much the betting user wants to stake.
     */
    stake: yup
      .number()
      .moreThan(0, 'Parlay stake must be more than 0.')
      .required('Stake is required when creating a parlay.'),
    /**
     * This is the id of the contest.
     */
    contest: yup.number(),
    /**
     * These are all the legs of the bet.
     */
    legs: yup.array().of(
      yup.object().shape({
        offerId: yup.string().required(),
        type: yup
          .mixed()
          .oneOf(
            isTeaser
              ? [
                  BetLegType.OVER_ODDS,
                  BetLegType.UNDER_ODDS,
                  BetLegType.SPREAD_AWAY_ODDS,
                  BetLegType.SPREAD_HOME_ODDS,
                ]
              : [
                  BetLegType.OVER_ODDS,
                  BetLegType.UNDER_ODDS,
                  BetLegType.SPREAD_AWAY_ODDS,
                  BetLegType.SPREAD_HOME_ODDS,
                  BetLegType.MONEYLINE_AWAY_ODDS,
                  BetLegType.MONEYLINE_HOME_ODDS,
                ],
          )
          .required(),
      }),
    ),
  });
}

export type LegCreateInput = {
  total: number;
  marketId: Market['id'];
  marketSelId: Market['sel_id'];
  type: BetLegType;
  league: League;
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
    const { user: prismaUser, userAppSettings: appSettings } =
      await getUserSettings(user.id);
    if (!prismaUser) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'You must be logged in to place entry.',
      });
    }

    if (prismaUser.status === UserStatus.SUSPENDED) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: CustomErrorMessages.SUSPENDED_PLACE_BET,
      });
    }

    const minBetAmount = Number(
      appSettings.find((s) => s.name === AppSettingName.MIN_BET_AMOUNT)
        ?.value || DefaultAppSettings.MIN_BET_AMOUNT,
    );
    const maxBetAmount = Number(
      appSettings.find((s) => s.name === AppSettingName.MAX_BET_AMOUNT)
        ?.value || DefaultAppSettings.MAX_BET_AMOUNT,
    );
    if (bet.stake < minBetAmount || bet.stake > maxBetAmount) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: `Bet amount is not allowed. Please bet more than ${minBetAmount} and less than ${maxBetAmount}. Stake: ${bet.stake}.`,
      });
    }

    await monitorUser(bet, prismaUser);

    const isTeaser = bet.type === BetType.TEASER;
    const validPayload = placeBetSchema(isTeaser).validateSync(bet);

    const contest = await prisma.contest.findFirstOrThrow({
      where: {
        id: bet.contestId,
      },
    });

    let bonusCreditStake = 0;
    if (contest.wagerType === ContestWagerType.CASH) {
      // Get user total available balance
      const { totalAmount, creditAmount } = await getUserTotalBalance(user.id);
      bonusCreditStake = calculateBonusCreditStake(bet.stake, creditAmount);
      if (bet.stake > totalAmount) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: CustomErrorMessages.INSUFFICIENT_FUNDS_ERROR,
        });
      }
    }

    const repeatEntriesLimit = Number(
      appSettings.find((s) => s.name === AppSettingName.REPEAT_ENTRIES_LIMIT)
        ?.value || DefaultAppSettings.REPEAT_ENTRIES,
    );

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
          },
        });

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

        // Get the number of repeat entries the user has made with the same offer
        const repeatEntries = await prisma.bet.count({
          where: {
            userId: prismaUser.id,
            legs: {
              some: {
                marketId: leg.marketId,
              },
            },
          },
        });

        // If the user has already made a bet with the same offer, throw an error
        if (repeatEntries > repeatEntriesLimit) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: `Sorry, you have reached the limit for repeating the same offers in an entry. Please choose different offers to continue.`,
          });
        }

        return {
          type: leg.type,
          odds: getOdds(leg, market),
          marketId: leg.marketId,
          marketSel_id: leg.marketSelId,
          total: getMarketTotalProjection(leg.total, market.FreeSquare),
        };
      }),
    );

    const contestCategory = await prisma.contestCategory.findFirstOrThrow({
      where: {
        id: bet.contestCategoryId,
      },
    });

    const contestEntry = await prisma.contestEntry.findFirstOrThrow({
      where: {
        userId: prismaUser.id,
        contestsId: bet.contestId,
      },
    });

    const payout = isTeaser
      ? calculateTeaserPayout(validPayload.stake, contestCategory)
      : calculateParlayPayout(
          legs.map((leg) => leg.odds) as number[],
          validPayload.stake,
          contestCategory,
        );
    const odds = isTeaser
      ? -110
      : calculateTotalOdds(legs.map((l) => l.odds) as number[], 'american');

    const newBet = await prisma.bet.create({
      data: {
        stake: bet.stake,
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
    await applyDepositDistribution(user.id, bet.stake, newBet.id);

    if (contest.wagerType === ContestWagerType.CASH) {
      await createTransaction({
        userId: user.id,
        amountProcess: bet.stake,
        amountBonus: 0,
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
