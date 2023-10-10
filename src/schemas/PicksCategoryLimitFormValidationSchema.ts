import * as z from 'zod';

export const PicksCategoryLimitFormValidationSchema = z.object({
  picksCategoryLimits: z.array(
    z
      .object({
        id: z.string(),
        numberOfPicks: z.coerce.number(),
        minStakeAmount: z.coerce.number(),
        maxStakeAmount: z.coerce.number(),
        customStakeLimitEnabled: z.boolean(),
        allInPayoutMultiplier: z.coerce.number().min(0),
        primaryInsuredPayoutMultiplier: z.coerce.number().min(0),
        secondaryInsuredPayoutMultiplier: z.coerce.number().min(0),
      })
      .refine((data) => data.maxStakeAmount > data.minStakeAmount, {
        message: 'Maximum limit must be greater than minimum',
        path: ['maxStakeAmount'],
      }),
  ),
});
