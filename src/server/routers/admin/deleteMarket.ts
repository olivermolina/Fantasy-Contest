import { TRPCError } from '@trpc/server';
import { prisma } from '~/server/prisma';
import * as yup from '~/utils/yup';
import { adminProcedure } from './middleware/isAdmin';
import { appNodeCache } from '~/lib/node-cache/AppNodeCache';
import { CustomErrorMessages } from '~/constants/CustomErrorMessages';

const deleteMarket = adminProcedure
  .input(
    yup.object({
      id: yup.string().required(),
      selId: yup.number().required(),
    }),
  )
  .mutation(async ({ input }) => {
    try {
      appNodeCache.flushAll();
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
        message: CustomErrorMessages.DELETE_MARKET_ERROR,
      });
    }
  });

export default deleteMarket;
