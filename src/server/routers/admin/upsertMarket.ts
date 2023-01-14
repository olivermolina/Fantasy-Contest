import { TRPCError } from '@trpc/server';
import { t } from '~/server/trpc';
import { prisma } from '~/server/prisma';
import * as yup from '~/utils/yup';
import { Prisma } from '@prisma/client';
import ShortUniqueId from 'short-unique-id';

const upsertMarket = t.procedure
  .input(yup.mixed<Prisma.MarketCreateInput>().required())
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
    const id = !input.id || input.id === 'new' ? uid() : input.id;

    return await prisma.market.upsert({
      where: {
        id_sel_id: {
          id,
          sel_id: input.sel_id,
        },
      },
      create: {
        ...input,
        id: id,
      },
      update: {
        ...input,
        id,
      },
      include: {
        team: true,
        player: true,
      },
    });
  });

export default upsertMarket;
