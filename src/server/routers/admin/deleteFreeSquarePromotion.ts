import * as yup from '~/utils/yup';
import prisma from '~/server/prisma';
import { adminProcedure } from '~/server/routers/admin/middleware/isAdmin';
import { appNodeCache } from '~/lib/node-cache/AppNodeCache';

const deleteFreeSquarePromotion = adminProcedure
  .input(
    yup.object({
      id: yup.string().required(),
    }),
  )
  .mutation(async ({ input }) => {
    appNodeCache.flushAll();
    return await prisma.$transaction([
      prisma.freeSquareContestCategory.deleteMany({
        where: {
          freeSquareId: input.id,
        },
      }),
      prisma.freeSquare.delete({
        where: {
          id: input.id,
        },
      }),
    ]);
  });
export default deleteFreeSquarePromotion;
