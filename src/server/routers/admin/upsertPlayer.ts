import { TRPCError } from '@trpc/server';
import { t } from '~/server/trpc';
import { prisma } from '~/server/prisma';
import * as yup from '~/utils/yup';
import { Player } from '@prisma/client';
import ShortUniqueId from 'short-unique-id';

const upsertPlayer = t.procedure
  .input(yup.mixed<Player>().required())
  .mutation(async ({ ctx, input }) => {
    const userId = ctx.session.user?.id;
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!userId || !user) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'User not found',
      });
    }
    const uid = new ShortUniqueId({ length: 16 });
    const id = !input.id || input.id === 'NEW' ? uid() : input.id;

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
