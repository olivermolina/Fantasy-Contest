import { TRPCError } from '@trpc/server';
import { t } from '~/server/trpc';
import { prisma } from '~/server/prisma';
import * as yup from '~/utils/yup';
import { Team } from '@prisma/client';
import ShortUniqueId from 'short-unique-id';

const upsertTeam = t.procedure
  .input(yup.mixed<Team>().required())
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
