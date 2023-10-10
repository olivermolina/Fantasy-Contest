import { prisma } from '~/server/prisma';
import * as yup from '~/utils/yup';
import { Player } from '@prisma/client';
import { adminProcedure } from './middleware/isAdmin';
import { TRPCError } from '@trpc/server';
import { CustomErrorMessages } from '~/constants/CustomErrorMessages';

const deletePlayer = adminProcedure
  .input(yup.mixed<Player>().required())
  .mutation(async ({ input }) => {
    try {
      return await prisma.player.delete({
        where: {
          id: input.id,
        },
      });
    } catch (e) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: CustomErrorMessages.UNABLE_TO_DELETE_PLAYER,
      });
    }
  });

export default deletePlayer;
