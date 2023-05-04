import { prisma } from '~/server/prisma';
import * as yup from '~/utils/yup';
import { Prisma } from '@prisma/client';
import ShortUniqueId from 'short-unique-id';
import { adminProcedure } from './middleware/isAdmin';
import { appNodeCache } from '~/lib/node-cache/AppNodeCache';

const upsertOffer = adminProcedure
  .input(yup.mixed<Prisma.OfferCreateInput>().required())
  .mutation(async ({ input }) => {
    const uid = new ShortUniqueId({ length: 16 });
    const id = !input.gid || input.gid === 'NEW' ? uid() : input.gid;
    appNodeCache.flushAll();
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
