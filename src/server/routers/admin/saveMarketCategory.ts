import { adminProcedure } from '~/server/routers/admin/middleware/isAdmin';
import prisma from '~/server/prisma';
import z from 'zod';
import { League } from '@prisma/client';

const saveMarketCategory = adminProcedure
  .input(
    z.object({
      id: z.string(),
      category: z.string(),
      league: z.nativeEnum(League),
      order: z.number().nullable(),
    }),
  )
  .mutation(async ({ input }) => {
    return await prisma.marketCategory.upsert({
      where: { id: input.id },
      create: {
        league: input.league,
        category: input.category.trim(),
        order: input.order,
      },
      update: {
        league: input.league,
        category: input.category.trim(),
        order: input.order,
      },
    });
  });

export default saveMarketCategory;
