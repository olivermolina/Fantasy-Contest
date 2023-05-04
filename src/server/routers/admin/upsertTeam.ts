import { prisma } from '~/server/prisma';
import * as yup from '~/utils/yup';
import { Team } from '@prisma/client';
import ShortUniqueId from 'short-unique-id';
import { adminProcedure } from './middleware/isAdmin';
import { appNodeCache } from '~/lib/node-cache/AppNodeCache';

const upsertTeam = adminProcedure
  .input(yup.mixed<Team>().required())
  .mutation(async ({ input }) => {
    const uid = new ShortUniqueId({ length: 16 });
    const id = !input.id || input.id === 'NEW' ? uid() : input.id;
    appNodeCache.flushAll();

    return await prisma.team.upsert({
      where: {
        id,
      },
      create: {
        ...input,
        id: id,
      },
      update: input,
    });
  });

export default upsertTeam;
