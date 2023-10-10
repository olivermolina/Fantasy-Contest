import { prisma } from '~/server/prisma';
import * as yup from '~/utils/yup';
import { Team } from '@prisma/client';
import { adminProcedure } from './middleware/isAdmin';
import { TRPCError } from '@trpc/server';
import { CustomErrorMessages } from '~/constants/CustomErrorMessages';

const deleteTeam = adminProcedure
  .input(yup.mixed<Team>().required())
  .mutation(async ({ input }) => {
    try {
      return await prisma.team.delete({
        where: {
          id: input.id,
        },
      });
    } catch (e) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: CustomErrorMessages.UNABLE_TO_DELETE_TEAM,
      });
    }
  });

export default deleteTeam;
