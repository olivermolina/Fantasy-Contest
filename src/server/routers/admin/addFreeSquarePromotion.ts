import prisma from '~/server/prisma';
import { adminProcedure } from '~/server/routers/admin/middleware/isAdmin';
import z from 'zod';
import { League } from '@prisma/client';
import { innerFn as updateLeagueMarketCount } from '~/server/routers/contest/updateLeaguesMarketCount';
import { innerFn as updateListOffer } from '~/server/routers/contest/updateListOffers';

const addFreeSquarePromotion = adminProcedure
  .input(
    z.object({
      id: z.string().nullable().optional(),
      marketId: z.string(),
      selId: z.number(),
      discount: z.number(),
      maxStake: z.number(),
      freeEntryEnabled: z.boolean().optional(),
      pickCategories: z.string().array().nonempty({
        message: 'At least one pickCategory is required',
      }),
      league: z.nativeEnum(League),
    }),
  )
  .mutation(async ({ input }) => {
    const freeSquare = await prisma.freeSquare.upsert({
      where: {
        id: input.id || '',
      },
      create: {
        discount: input.discount,
        maxStake: input.maxStake,
        freeEntryEnabled: input.freeEntryEnabled ?? false,
        market: {
          connect: {
            id_sel_id: {
              id: input.marketId,
              sel_id: input.selId,
            },
          },
        },
      },
      update: {
        discount: input.discount,
        maxStake: input.maxStake,
        freeEntryEnabled: input.freeEntryEnabled ?? false,
        market: {
          connect: {
            id_sel_id: {
              id: input.marketId,
              sel_id: input.selId,
            },
          },
        },
      },
    });

    // Remove unchecked # of picks category
    await prisma.freeSquareContestCategory.deleteMany({
      where: {
        freeSquareId: freeSquare.id,
        NOT: {
          contestCategoryId: {
            in: input.pickCategories,
          },
        },
      },
    });

    await Promise.all(
      input.pickCategories.map(
        async (pickCategory) =>
          await prisma.freeSquareContestCategory.upsert({
            create: {
              freeSquareId: freeSquare.id,
              contestCategoryId: pickCategory,
            },
            update: {
              freeSquareId: freeSquare.id,
              contestCategoryId: pickCategory,
            },
            where: {
              freeSquareId_contestCategoryId: {
                freeSquareId: freeSquare.id,
                contestCategoryId: pickCategory,
              },
            },
          }),
      ),
    );

    await Promise.all([
      updateLeagueMarketCount(input.league),
      updateListOffer(input.league),
    ]);

    return input;
  });

export default addFreeSquarePromotion;
