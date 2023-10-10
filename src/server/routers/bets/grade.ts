import { t } from '../../trpc';
import * as yup from '~/utils/yup';
import { TRPCError } from '@trpc/server';
import {
  Bet,
  BetLeg,
  BetLegType,
  BetStakeType,
  BetStatus,
  Contest,
  ContestCategory,
  ContestEntry,
  ContestWagerType,
  Market,
  Offer,
  TransactionType,
} from '@prisma/client';
import { prisma } from '~/server/prisma';
import { Market as IMarket } from '~/lib/ev-analytics/IOddsResponse';
import logger from '~/utils/logger';
import { TOKEN } from '~/constants/TOKEN';
import { createTransaction } from '~/server/routers/bets/createTransaction';
import { ActionType } from '~/constants/ActionType';
import _ from 'lodash';
import { mapLeagueLimits } from '~/server/routers/appSettings/list';
import { calculatePayout } from '~/utils/calculatePayout';
import { LeagueLimitType } from '~/schemas/LeagueLimitFormValidationSchema';

export const settleBet = async (
  bet: Bet & {
    legs: (BetLeg & { market: Market & { offer: Offer | null } })[];
    ContestEntries: ContestEntry & {
      contest: Contest;
    };
    ContestCategory: ContestCategory;
  },
  leagueLimits?: LeagueLimitType[],
) => {
  let contestCategory = bet.ContestCategory;
  let betPayout = Number(bet.payout);
  const legPushStatuses = bet.legs.filter(
    (leg) => leg.status === BetStatus.PUSH,
  );

  await prisma.wallets.upsert({
    where: {
      userId_contestsId: {
        userId: bet.userId,
        contestsId: bet.ContestEntries.contestsId,
      },
    },
    create: {
      userId: bet.userId,
      contestsId: bet.ContestEntries.contestsId,
      balance: 0,
      cashBalance: 0,
      bonusCredits: 0,
      amountAvailableToWithdraw: 0,
      unPlayedAmount: 0,
      created_by: 'system',
      updated_by: 'system',
    },
    update: {
      userId: bet.userId,
      contestsId: bet.ContestEntries.contestsId,
    },
  });

  if (bet.status === 'REFUNDED' || bet.status === 'CANCELLED') {
    const actionType =
      Number(bet.bonusCreditStake) > 0
        ? ActionType.CASH_CONTEST_CANCELLED
        : ActionType.WITHDRAWABLE_CASH_CONTEST_CANCELLED;

    try {
      await createTransaction({
        userId: bet.ContestEntries.userId,
        amountProcess: Number(bet.bonusCreditStake) > 0 ? 0 : Number(bet.stake),
        amountBonus: Number(bet.bonusCreditStake),
        transactionType: TransactionType.CREDIT,
        actionType,
        betId: bet.id,
        contestEntryId: bet.ContestEntries.id,
      });
    } catch (e) {
      logger.warn(`Duplicate transaction error.`);
    }
    // No further action for refunded bet
    return;
  }

  // Legs have any pushes
  if (legPushStatuses.length > 0) {
    const legsCount = bet.legs.length;
    const legPushStatusCount = legPushStatuses.length;
    const remainingLegCount = legsCount - legPushStatusCount;

    if (remainingLegCount < 2) {
      // Cancelled bet
      await prisma.$transaction([
        prisma.bet.update({
          where: {
            id: bet.id,
          },
          data: {
            status: BetStatus.CANCELLED,
          },
        }),
      ]);
      const actionType =
        Number(bet.bonusCreditStake) > 0
          ? ActionType.CASH_CONTEST_CANCELLED
          : ActionType.WITHDRAWABLE_CASH_CONTEST_CANCELLED;
      try {
        await createTransaction({
          userId: bet.ContestEntries.userId,
          amountProcess:
            Number(bet.bonusCreditStake) > 0 ? 0 : Number(bet.stake),
          amountBonus: Number(bet.bonusCreditStake),
          transactionType: TransactionType.CREDIT,
          actionType,
          betId: bet.id,
          contestEntryId: bet.ContestEntries.id,
        });
      } catch (e) {
        logger.warn(` Duplicate transaction error.`);
      }

      // No further action for cancelled bet
      return;
    } else {
      // Update bet contest category
      const newContestCategory = await prisma.contestCategory.findFirst({
        where: {
          numberOfPicks: remainingLegCount,
        },
      });

      if (!newContestCategory) {
        throw Error('Unsupported contest category');
      }

      contestCategory = newContestCategory;
      const settledBetLegs = bet.legs.filter(
        (l) => l.status !== BetStatus.PUSH,
      );
      const newBet = {
        stake: Number(bet.stake),
        legs: settledBetLegs.map((leg) => ({
          league: leg.market!.offer!.league!,
        })),
        contestCategory,
      };
      const newPayout = calculatePayout(newBet, leagueLimits);
      betPayout = newPayout.allInPayout;
      await prisma.bet.update({
        where: {
          id: bet.id,
        },
        data: {
          payout: betPayout,
          contestCategoryId: newContestCategory.id,
        },
      });
    }
  }

  if (bet.stakeType === BetStakeType.ALL_IN) {
    const doesBetHaveALostLeg = bet.legs
      .filter((l) => l.status !== BetStatus.PUSH)
      .some((l) => l.status === BetStatus.LOSS);
    if (doesBetHaveALostLeg) {
      // user has lost, update the bet
      await prisma.$transaction([
        prisma.bet.update({
          where: {
            id: bet.id,
          },
          data: {
            status: BetStatus.LOSS,
          },
        }),
      ]);
    }
    const allBetLegsAreWon = bet.legs
      .filter((l) => l.status !== BetStatus.PUSH)
      .every((l) => l.status === BetStatus.WIN);
    if (allBetLegsAreWon) {
      // user has won, pay them out
      await prisma.$transaction([
        prisma.bet.update({
          where: {
            id: bet.id,
          },
          data: {
            status: BetStatus.WIN,
          },
        }),
      ]);

      // Increment user cash amount
      if (bet.ContestEntries?.contest?.wagerType === ContestWagerType.CASH) {
        try {
          await createTransaction({
            userId: bet.ContestEntries.userId,
            amountProcess: Number(betPayout) + Number(bet.cashStake),
            amountBonus: 0,
            transactionType: TransactionType.CREDIT,
            actionType: ActionType.CASH_CONTEST_WIN,
            betId: bet.id,
            contestEntryId: bet.ContestEntries.id,
          });
        } catch (e) {
          logger.warn(` Duplicate transaction error.`);
        }
      }
    }
  }

  if (bet.stakeType === BetStakeType.INSURED) {
    const wonLegs = bet.legs.filter((l) => l.status === BetStatus.WIN);
    const calculatedPayout = calculatePayout(
      {
        stake: Number(bet.stake),
        legs: wonLegs.map((leg) => ({
          league: leg.market!.offer!.league!,
        })),
        contestCategory,
      },
      leagueLimits,
    );

    let insuredPayout = 0;
    switch (wonLegs.length) {
      case contestCategory.numberOfPicks:
        insuredPayout = calculatedPayout.primaryInsuredPayout;
        break;
      case contestCategory.numberOfPicks - 1:
        insuredPayout = calculatedPayout.secondaryInsuredPayout;
        break;
      default:
    }

    if (insuredPayout > 0) {
      // user has won primary insured amount, pay them out
      await prisma.$transaction([
        prisma.bet.update({
          where: {
            id: bet.id,
          },
          data: {
            payout: insuredPayout,
            status: BetStatus.WIN,
          },
        }),
      ]);

      // Increment cash amount
      if (bet.ContestEntries?.contest?.wagerType === ContestWagerType.CASH) {
        try {
          await createTransaction({
            userId: bet.ContestEntries.userId,
            amountProcess: insuredPayout + Number(bet.cashStake),
            amountBonus: 0,
            transactionType: TransactionType.CREDIT,
            actionType: ActionType.CASH_CONTEST_WIN,
            betId: bet.id,
            contestEntryId: bet.ContestEntries.id,
          });
        } catch (e) {
          logger.warn(` Duplicate transaction error.`);
        }
      }
    } else {
      // user has lost, update the bet and wallet
      await prisma.$transaction([
        prisma.bet.update({
          where: {
            id: bet.id,
          },
          data: {
            status: BetStatus.LOSS,
          },
        }),
      ]);
    }
  }
};

/**
 *  This function is used to grade bets for a given market
 * @param markets - Markets to grade
 * @returns void
 */
export const innerFn = async (markets: IMarket[]) => {
  try {
    const marketsById = new Map<string, IMarket>(
      markets.map((m) => [m.id + m.sel_id, m]),
    );

    const ugLegs = await prisma.betLeg.findMany({
      where: {
        marketId: {
          in: markets.map((i) => i.id),
        },
        AND: {
          marketSel_id: {
            in: markets.map((i) => i.sel_id),
          },
        },
        Bet: {
          status: BetStatus.PENDING,
        },
      },
      include: {
        Bet: true,
      },
    });
    logger.info(`Grading bets.`, {
      marketsById,
      marketCount: marketsById.size,
      ugLegIds: ugLegs.map((ug) => ug.id),
      ugCount: ugLegs.length,
    });

    const newBetStatus: Record<BetStatus, BetLeg['id'][]> = {
      [BetStatus.WIN]: [],
      [BetStatus.PUSH]: [],
      [BetStatus.LOSS]: [],
      [BetStatus.PENDING]: [],
      [BetStatus.CANCELLED]: [],
      [BetStatus.REFUNDED]: [],
    };
    for (const ugLeg of ugLegs) {
      const bet = ugLeg.Bet;
      if (!bet) {
        throw new Error(`Bet leg ${ugLeg.id} missing bet`);
      }
      const computedId = ugLeg.marketId + ugLeg.marketSel_id;
      const apiMarket = marketsById.get(computedId);

      const prismaMarket = await prisma.market.findFirst({
        where: {
          id: computedId,
        },
      });

      const market = apiMarket || prismaMarket;

      if (!market) {
        logger.warn(`No market associated for leg ${ugLeg.id}.`);
      } else if (market?.total_stat === null && !market?.offline) {
        logger.warn(`Game stats not yet final ${ugLeg.id}.`, { market });
      } else {
        // If bet was won, update status and pay user
        switch (ugLeg.type) {
          case BetLegType.OVER_ODDS:
            if (
              _.isNumber(market.total_stat) &&
              ugLeg.total.toNumber() < market.total_stat
            ) {
              newBetStatus[BetStatus.WIN].push(ugLeg.id);
            } else if (
              // offline means DNP/Inactive
              (market.total_stat === null && market.offline) ||
              ugLeg.total.toNumber() === market.total_stat
            ) {
              newBetStatus[BetStatus.PUSH].push(ugLeg.id);
            } else {
              newBetStatus[BetStatus.LOSS].push(ugLeg.id);
            }
            break;
          case BetLegType.UNDER_ODDS:
            if (
              _.isNumber(market.total_stat) &&
              ugLeg.total.toNumber() > market.total_stat
            ) {
              newBetStatus[BetStatus.WIN].push(ugLeg.id);
            } else if (
              // offline means DNP/Inactive
              (market.total_stat === null && market.offline) ||
              ugLeg.total.toNumber() === market.total_stat
            ) {
              newBetStatus[BetStatus.PUSH].push(ugLeg.id);
            } else {
              newBetStatus[BetStatus.LOSS].push(ugLeg.id);
            }
            break;
          default:
            throw Error('Unsupported entry leg type');
        }
      }
    }
    for (const [status, ids] of Object.entries(newBetStatus)) {
      if (ids.length > 0) {
        await prisma.betLeg.updateMany({
          where: {
            id: {
              in: ids,
            },
          },
          data: {
            status: status as BetStatus,
          },
        });
      }
    }

    const completelyGradedBets = await prisma.bet.findMany({
      where: {
        legs: {
          every: {
            NOT: {
              status: BetStatus.PENDING,
            },
          },
        },
        status: BetStatus.PENDING,
      },
      include: {
        legs: {
          include: {
            market: {
              include: {
                offer: true,
              },
            },
          },
        },
        ContestEntries: {
          include: { contest: true },
        },
        ContestCategory: true,
      },
    });

    const [leagueLimits, contestCategories] = await prisma.$transaction([
      prisma.leagueLimit.findMany({
        include: {
          contestCategoryLeagueLimits: true,
        },
      }),
      prisma.contestCategory.findMany(),
    ]);

    for (const bet of completelyGradedBets) {
      await settleBet(bet, mapLeagueLimits(leagueLimits, contestCategories));
    }
  } catch (error) {
    logger.error('There was an error grading bets.', error);
    throw error;
  }
};

export const grade = t.procedure
  .input(
    yup
      .mixed<{
        markets: IMarket[];
        token: string;
      }>()
      .required(),
  )
  .mutation(async ({ input }) => {
    const { markets, token } = input;
    if (token !== TOKEN) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
      });
    }
    await innerFn(markets);
  });
