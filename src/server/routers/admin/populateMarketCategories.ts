import prisma from '~/server/prisma';
import { League, MarketType } from '@prisma/client';
import { t } from '~/server/trpc';
import z from 'zod';
import logger from '~/utils/logger';

const populateMarketCategories = t.procedure
  .input(
    z.object({
      league: z.nativeEnum(League),
    }),
  )
  .query(async ({ input }) => {
    const markets = await prisma.market.findMany({
      distinct: ['category'],
      include: {
        offer: true,
      },
      where: {
        type: MarketType.PP,
        offer: {
          league: input.league,
        },
      },
    });

    logger.info(
      `Ingesting for market category: ${input.league} count: ${markets.length}`,
    );

    const marketCategory = await prisma.marketCategory.findMany({
      where: {
        league: input.league,
      },
    });

    const existingCategories = marketCategory.map((e) => e.category);

    const newMarketCategories = markets.filter(
      (e) => !existingCategories.includes(e.category),
    );

    try {
      await prisma.$transaction(
        newMarketCategories.map((newMarketCategory) =>
          prisma.marketCategory.create({
            data: {
              category: newMarketCategory.category.trim(),
              league: newMarketCategory.offer!.league,
            },
          }),
        ),
      );
    } catch (e: any) {
      logger.error(e.message);
    }

    return 'Success!';
  });

export default populateMarketCategories;
