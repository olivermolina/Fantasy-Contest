import { TRPCError } from '@trpc/server';
import { t } from '~/server/trpc';
import * as yup from '~/utils/yup';
import { prisma } from '~/server/prisma';

const offers = t.procedure
  .input(
    yup.object({
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
