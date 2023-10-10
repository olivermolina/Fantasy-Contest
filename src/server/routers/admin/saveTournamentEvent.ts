import prisma from '~/server/prisma';
import { adminProcedure } from './middleware/isAdmin';
import { TRPCError } from '@trpc/server';
import { TournamentEventSchema } from '~/schemas/TournamentEventSchema';
import { CustomErrorMessages } from '~/constants/CustomErrorMessages';

export const saveTournamentEvent = adminProcedure
  .input(TournamentEventSchema)
  .mutation(async ({ input }) => {
    try {
      return await prisma.$transaction([
        prisma.tournamentEvent.upsert({
          where: {
            id: input.id,
          },
          create: input,
          update: input,
        }),
        prisma.offer.updateMany({
          where: {
            tournamentEventId: input.id,
          },
          data: {
            league: input.league,
          },
        }),
      ]);
    } catch (error) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: CustomErrorMessages.TOURNAMENT_SAVE_ERROR,
      });
    }
  });
