import { TRPCError } from '@trpc/server';
import { t } from '~/server/trpc';
import * as yup from '~/utils/yup';
import { prisma } from '~/server/prisma';
import { Market } from '@prisma/client';

interface MarketResultMeta {
  totalRowCount: number;
}

export interface MarketResult {
  markets: Market[];
  nextCursor: string | undefined;
  meta: MarketResultMeta;
}

const markets = t.procedure
  .output(yup.mixed<MarketResult>())
  .input(
    yup.object({
      offerId: yup.string().required(),
      limit: yup.number().required(),
      cursor: yup.string(),
    }),
  )
  .query(async ({ ctx, input }) => {
    const userId = ctx.session.user?.id;
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!userId || !user) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'User not found',
      });
    }

    if (!input.offerId) {
      return {
        markets: [],
        nextCursor: undefined,
        meta: { totalRowCount: 0 },
      };
    }

    const totalRowCount = await prisma.market.count({
      where: {
        offerId: input.offerId,
      },
    });

    const markets = await prisma.market.findMany({
      include: {
        team: true,
        player: {
          include: {
            Team: true,
          },
        },
      },
      where: {
        offerId: input.offerId,
      },
    });

    const nextCursor = undefined;

    return {
      markets,
      nextCursor,
      meta: {
        totalRowCount,
      },
    };
  });

export default markets;
