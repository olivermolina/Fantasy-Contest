import * as z from 'zod';
import { BetStakeType } from '@prisma/client';

export const BonusCreditLimitValidationSchema = z.object({
  signupFreeEntry: z.boolean(),
  bonusCreditFreeEntryEquivalent: z.coerce.number(),
  bonusCreditLimits: z.array(
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
  ),
});

/**
 * Defines the form fields
 */
export type BonusCreditLimitInputs = z.infer<
  typeof BonusCreditLimitValidationSchema
>;
