import { t } from '~/server/trpc';
import { TRPCError } from '@trpc/server';
import { prisma } from '~/server/prisma';
import * as yup from '~/utils/yup';
import { BetStatus } from '@prisma/client';
import { CustomErrorMessages } from '~/constants/CustomErrorMessages';

const pendingBetLegs = t.procedure
  .input(
    yup.object({
      token: yup.string().required(),
    }),
  )
  .query(async ({ input }) => {
    if (!input.token) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
      });
    }
    try {
      return await prisma.betLeg.findMany({
        include: {
          market: {
            include: {
              offer: true,
            },
          },
        },
        where: {
          Bet: {
            status: BetStatus.PENDING,
          },
        },
      });
    } catch (e) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: CustomErrorMessages.CONTACT_US,
      });
    }
  });

export default pendingBetLegs;
