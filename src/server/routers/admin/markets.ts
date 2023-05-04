import * as yup from '~/utils/yup';
import { prisma } from '~/server/prisma';
import { Market } from '@prisma/client';
import { adminProcedure } from './middleware/isAdmin';

interface MarketResultMeta {
  totalRowCount: number;
}

export interface MarketResult {
  markets: Market[];
  nextCursor: string | undefined;
  meta: MarketResultMeta;
}

const markets = adminProcedure
  .output(yup.mixed<MarketResult>())
  .input(
    yup.object({
      offerId: yup.string().required(),
      limit: yup.number().required(),
      cursor: yup.string(),
    }),
  )
  .query(async ({ input }) => {
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
