import { adminProcedure } from './middleware/isAdmin';
import { z } from 'zod';
import { getUserBetLists } from '~/server/routers/admin/getPendingBets';

// @ts-expect-error Big int was not supported fix here https://github.com/prisma/studio/issues/614#issuecomment-795213237
BigInt.prototype.toJSON = function () {
  return this.toString();
};

const usersBetLists = adminProcedure
  .input(
    z.object({
      from: z.date(),
      to: z.date(),
    }),
  )
  .query(async ({ input, ctx }) => {
    const { from, to } = input;
    const where = {
      OR: [
        {
          created_at: {
            gte: from,
            lte: to,
          },
        },
        {
          updated_at: {
            gte: from,
            lte: to,
          },
        },
      ],
    };
    return getUserBetLists(where, ctx);
  });

export default usersBetLists;
