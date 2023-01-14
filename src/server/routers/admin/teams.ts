import { TRPCError } from '@trpc/server';
import { t } from '~/server/trpc';
import { prisma } from '~/server/prisma';
import * as yup from '~/utils/yup';

const teams = t.procedure
  .input(
    yup.object({
      filterName: yup.string(),
      skip: yup.number(),
      take: yup.number(),
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

    const { skip, take } = input;
    return await prisma.team.findMany({
      skip: skip || 0,
      take: take || 1000,
      where: {
        name: {
          contains: input.filterName,
          mode: 'insensitive',
        },
      },
    });
  });

export default teams;
