import { prisma } from '~/server/prisma';
import { adminProcedure } from './middleware/isAdmin';
import { z } from 'zod';
import { BetStatus } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { CustomErrorMessages } from '~/constants/CustomErrorMessages';

const updateBetLeg = adminProcedure
  .input(
    z.object({
      id: z.string(),
      status: z.nativeEnum(BetStatus),
    }),
  )
  .mutation(async ({ input }) => {
    const { id, status } = input;

    return await prisma.$transaction(
      async (trx) => {
        try {
          await trx.betLeg.findUniqueOrThrow({
            where: {
              id,
            },
          });
        } catch (e) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: CustomErrorMessages.BET_LEG_NOT_FOUND,
          });
        }

        return await trx.betLeg.update({
          where: {
            id,
          },
          data: {
            status,
          },
        });
      },
      {
        maxWait: 10000, // default: 2000
        timeout: 10000, // default: 5000
      },
    );
  });

export default updateBetLeg;
