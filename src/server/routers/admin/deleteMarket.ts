import { TRPCError } from '@trpc/server';
import { t } from '~/server/trpc';
import { prisma } from '~/server/prisma';
import * as yup from '~/utils/yup';

const deleteMarket = t.procedure
  .input(
    yup.object({
      id: yup.string().required(),
      selId: yup.number().required(),
    }),
  )
  .mutation(async ({ ctx, input }) => {
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

    try {
      return await prisma.market.delete({
        where: {
          id_sel_id: {
            id: input.id,
            sel_id: input.selId,
          },
        },
      });
    } catch (e) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Unable to delete market. Someone already placed an entry.',
      });
    }
  });

export default deleteMarket;
