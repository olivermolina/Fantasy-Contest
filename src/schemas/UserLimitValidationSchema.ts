import * as z from 'zod';
import { BetStakeType } from '@prisma/client';

export const UserLimitValidationSchema = z
  .object({
    userId: z.string(),
    username: z.string().optional(),
    min: z.coerce.number().min(1),
    max: z.coerce.number(),
    repeatEntries: z.coerce.number(),
    maxDailyTotalBetAmount: z.coerce.number(),
    notes: z.string().optional(),
    bonusCreditLimits: z
      .array(
        z.object({
          contestCategoryId: z.string(),
          numberOfPicks: z.coerce.number(),
          id: z.string(),
          enabled: z.boolean(),
          bonusCreditFreeEntryEquivalent: z.coerce
            .number()
            .min(0, 'Bonus Credit Free Entry is required'),
          stakeTypeOptions: z.array(z.nativeEnum(BetStakeType)),
        }),
      )
      .optional(),
  })
  .refine((data) => data.max > data.min, {
    message: 'Maximum limit must be greater than minimum',
    path: ['max'],
  })
  .transform((o) => ({
    userId: o.userId,
    username: o.username,
    min: o.min,
    max: o.max,
    repeatEntries: o.repeatEntries,
    maxDailyTotalBetAmount: o.maxDailyTotalBetAmount,
    notes: o.notes,
    bonusCreditLimits: o.bonusCreditLimits,
  }));

/**
 * Defines the form fields
 */
export type UserLimitInputs = z.infer<typeof UserLimitValidationSchema>;
