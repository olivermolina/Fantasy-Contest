import { prisma } from '~/server/prisma';
import * as yup from '~/utils/yup';
import { Prisma } from '@prisma/client';
import ShortUniqueId from 'short-unique-id';
import { adminProcedure } from './middleware/isAdmin';
import { appNodeCache } from '~/lib/node-cache/AppNodeCache';

const upsertMarket = adminProcedure
  .input(yup.mixed<Prisma.MarketCreateInput>().required())
  .mutation(async ({ input }) => {
    const uid = new ShortUniqueId({ length: 16 });
    const id = !input.id || input.id === 'new' ? uid() : input.id;
    appNodeCache.flushAll();
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
