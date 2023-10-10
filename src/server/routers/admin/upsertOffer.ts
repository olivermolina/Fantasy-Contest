import { prisma } from '~/server/prisma';
import * as yup from '~/utils/yup';
import { BetStatus, Prisma, Status } from '@prisma/client';
import ShortUniqueId from 'short-unique-id';
import { adminProcedure } from './middleware/isAdmin';
import { appNodeCache } from '~/lib/node-cache/AppNodeCache';
import { innerFn as grade } from '~/server/routers/bets/grade';
import { Market as IMarket } from '~/lib/ev-analytics/IOddsResponse';

/**
 * Re-grade and reset all bet and transactions related to a market.
 * This is used when a market is updated, and we need to re-grade all bets and
 * delete all transactions related to it.
 *
 * @param markets - IMarket object
 */

export const reGradeMarkets = async (markets: IMarket[]) => {
  // Reset all bet and its legs to pending to grade it again
  const marketIds = markets.map((market) => market.id);
  const affectedBets = await prisma.bet.findMany({
    where: {
      legs: {
        some: {
          marketId: {
            in: marketIds,
          },
        },
      },
    },
    include: {
      Transactions: true,
    },
  });

  const transactionIds = affectedBets.flatMap((bet) =>
    bet.Transactions.map((transaction) => transaction.id),
  );

  await prisma.$transaction([
    prisma.betLeg.updateMany({
      where: {
        marketId: {
          in: marketIds,
        },
      },
      data: {
        status: BetStatus.PENDING,
      },
    }),
    prisma.bet.updateMany({
      where: {
        id: {
          in: affectedBets.map((bet) => bet.id),
        },
      },
      data: {
        status: BetStatus.PENDING,
      },
    }),
    prisma.transactionStatus.deleteMany({
      where: {
        transactionId: {
          in: transactionIds,
        },
      },
    }),
  ]);

  await prisma.transaction.deleteMany({
    where: {
      id: {
        in: transactionIds,
      },
    },
  });

  await grade(markets);

  return markets;
};

const upsertOffer = adminProcedure
  .input(yup.mixed<Prisma.OfferCreateInput>().required())
  .mutation(async ({ input }) => {
    const uid = new ShortUniqueId({ length: 16 });
    const id = !input.gid || input.gid === 'NEW' ? uid() : input.gid;
    appNodeCache.flushAll();
    const offer = await prisma.offer.upsert({
      where: {
        gid: id,
      },
      create: {
        ...input,
        gid: id,
        manualEntry: true,
      },
      update: input,
      include: {
        away: true,
        home: true,
        markets: true,
      },
    });

    await prisma.market.updateMany({
      where: {
        offerId: offer.gid,
      },
      data: {
        offline: offer.status === Status.PostponedCanceled,
      },
    });

    // Grade the markets
    if (
      offer.status === Status.Final ||
      offer.status === Status.PostponedCanceled
    ) {
      const markets = offer.markets.map(
        (market) =>
          ({
            id: market.id,
            sel_id: market.sel_id,
            total_stat: market.total_stat,
            total: market.total,
            offline: market.offline,
          } as IMarket),
      );

      reGradeMarkets(markets);
    }

    return offer;
  });

export default upsertOffer;
