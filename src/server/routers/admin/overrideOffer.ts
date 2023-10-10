import { prisma } from '~/server/prisma';
import { adminProcedure } from './middleware/isAdmin';
import { z } from 'zod';

/**
 * This function updates or creates a market override in the database.
 * It requires admin privileges to execute.
 */
const overrideOffer = adminProcedure
  .input(
    z.object({
      id: z.string(), // ID of the market
      selId: z.number(), // Selection ID
      total: z.number(), // Total value
      over: z.number(), // Over value
      under: z.number(), // Under value
      adjustedTotal: z.number().optional(), // Total value
      adjustedOver: z.number().optional(), // Over value
      adjustedUnder: z.number().optional(), // Under value
      active: z.boolean(),
    }),
  )
  .mutation(async ({ input }) => {
    // Extract input values from the provided argument
    const { id, selId, ...marketOverrideFields } = input;

    // Update or create a market override
    return await prisma.market.update({
      where: {
        id_sel_id: {
          id,
          sel_id: selId,
        },
      },
      data: {
        MarketOverride: {
          upsert: {
            update: marketOverrideFields,
            create: marketOverrideFields,
          },
        },
        active: input.active,
      },
    });
  });

export default overrideOffer;
