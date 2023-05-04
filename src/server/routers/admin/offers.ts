import * as yup from '~/utils/yup';
import { prisma } from '~/server/prisma';
import { adminProcedure } from './middleware/isAdmin';

const offers = adminProcedure
  .input(
    yup.object({
      limit: yup.number().required(),
      cursor: yup.string(),
    }),
  )
  .query(async ({ input }) => {
    const limit = input.limit ?? 50;
    const { cursor } = input;

    const totalRowCount = await prisma.offer.count({
      where: {
        manualEntry: true,
      },
    });

    const offers = await prisma.offer.findMany({
      take: limit + 1,
      cursor: cursor ? { gid: cursor } : undefined,
      orderBy: {
        created_at: 'desc',
      },
      where: {
        manualEntry: true,
      },
      include: {
        home: true,
        away: true,
      },
    });

    let nextCursor: typeof cursor | undefined = undefined;
    if (offers.length > limit) {
      const nextItem = offers.pop();
      nextCursor = nextItem?.gid;
    }
    return {
      offers,
      nextCursor,
      meta: {
        totalRowCount,
      },
    };
  });

export default offers;
