import prisma from '~/server/prisma';
import { adminProcedure } from './middleware/isAdmin';
import { TRPCError } from '@trpc/server';
import * as z from 'zod';
import { CustomErrorMessages } from '~/constants/CustomErrorMessages';

export const deleteOffer = adminProcedure
  .input(
    z.object({
      id: z.string().optional(),
    }),
  )
  .mutation(async ({ input }) => {
    try {
      return await prisma.$transaction(
        async (trx) => {
          try {
            await trx.market.deleteMany({
              where: {
                offer: {
                  gid: input.id,
                },
              },
            });
          } catch (e) {
            throw new TRPCError({
              code: 'INTERNAL_SERVER_ERROR',
              message: CustomErrorMessages.OFFER_DELETE_WITH_ENTRY_ERROR,
            });
          }

          return await trx.offer.delete({
            where: {
              gid: input.id,
            },
          });
        },
        {
          maxWait: 10000, // default: 2000
          timeout: 10000, // default: 5000
        },
      );
    } catch (error) {
      if (error instanceof TRPCError) throw error;

      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: CustomErrorMessages.OFFER_DELETE_ERROR,
      });
    }
  });

export default deleteOffer;
