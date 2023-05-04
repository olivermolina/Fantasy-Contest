import * as yup from '~/utils/yup';
import prisma from '~/server/prisma';
import { adminProcedure } from '~/server/routers/admin/middleware/isAdmin';
import { appNodeCache } from '~/lib/node-cache/AppNodeCache';

const addFreeSquarePromotion = adminProcedure
  .input(
    yup.object({
      id: yup.string().nullable(),
      marketId: yup.string().required(),
      selId: yup.number().required(),
      discount: yup.number().required(),
      maxStake: yup.number().required(),
      freeEntryEnabled: yup.boolean(),
      pickCategories: yup.array().required(),
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
        freeEntryEnabled: input.freeEntryEnabled,
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
        freeEntryEnabled: input.freeEntryEnabled,
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
    appNodeCache.flushAll();

    return input;
  });

export default addFreeSquarePromotion;
