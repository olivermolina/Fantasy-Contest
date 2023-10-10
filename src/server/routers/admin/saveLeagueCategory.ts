import { adminProcedure } from '~/server/routers/admin/middleware/isAdmin';
import prisma from '~/server/prisma';
import z from 'zod';
import { League } from '@prisma/client';

const saveLeagueCategory = adminProcedure
  .input(
    z.object({ league: z.nativeEnum(League), order: z.number().nullable() }),
  )
  .mutation(async ({ input }) => {
    return await prisma.leagueCategory.update({
      where: { league: input.league },
      data: {
        order: input.order,
      },
    });
  });

export default saveLeagueCategory;
