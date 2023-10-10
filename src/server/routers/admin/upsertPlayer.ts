import { prisma } from '~/server/prisma';
import * as yup from '~/utils/yup';
import { Player } from '@prisma/client';
import ShortUniqueId from 'short-unique-id';
import { adminProcedure } from './middleware/isAdmin';
import { appNodeCache } from '~/lib/node-cache/AppNodeCache';
import { NEW_USER_ID } from '~/constants/NewUserId';

const upsertPlayer = adminProcedure
  .input(yup.mixed<Player>().required())
  .mutation(async ({ input }) => {
    const uid = new ShortUniqueId({ length: 16 });
    const id = !input.id || input.id === NEW_USER_ID ? uid() : input.id;
    appNodeCache.flushAll();

    return await prisma.player.upsert({
      where: {
        id,
      },
      create: {
        ...input,
        id: id,
      },
      update: input,
      include: {
        Team: true,
      },
    });
  });

export default upsertPlayer;
