import { TRPCError } from '@trpc/server';
import { t } from '~/server/trpc';
import { prisma } from '~/server/prisma';
import * as yup from '~/utils/yup';
import { Prisma } from '@prisma/client';
import ShortUniqueId from 'short-unique-id';

const upsertOffer = t.procedure
  .input(yup.mixed<Prisma.OfferCreateInput>().required())
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
    const id = !input.gid || input.gid === 'NEW' ? uid() : input.gid;

    return await prisma.offer.upsert({
      where: {
        gid: id,
      },
      create: {
        ...input,
        gid: id,
        manualEntry: true,
      },
      update: input,
      include: {
        away: true,
        home: true,
      },
    });
  });

export default upsertOffer;
