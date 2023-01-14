import { t } from '../../trpc';
import * as yup from '~/utils/yup';
import { TRPCError } from '@trpc/server';
import { BetStatus } from '@prisma/client';
import { prisma } from '~/server/prisma';
import { TOKEN } from '~/constants/TOKEN';
import { CustomErrorMessages } from '~/constants/CustomErrorMessages';

export const getManualOffersWithPendingBets = t.procedure
  .input(
    yup
      .mixed<{
        token: string;
      }>()
      .required(),
  )
  .query(async ({ input }) => {
    if (input.token !== TOKEN) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
      });
    }
    try {
      const offers = await prisma.offer.findMany({
        include: {
          markets: {
            include: {
              team: true,
              player: true,
            },
          },
        },
        where: {
          manualEntry: true,
          markets: {
            some: {
              BetLeg: {
                some: {
                  status: BetStatus.PENDING,
                },
              },
              NOT: {
                total_stat: null,
              },
            },
          },
          status: 'Final',
        },
      });

      return offers;
    } catch (error) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: CustomErrorMessages.CONTACT_US,
      });
    }
  });

export default getManualOffersWithPendingBets;
