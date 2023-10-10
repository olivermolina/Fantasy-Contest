import * as z from 'zod';
import { League } from '@prisma/client';

export const LeagueLimitFormValidationSchema = z
  .object({
    id: z.string(),
    enabled: z.boolean(),
    league: z.nativeEnum(League),
    minStake: z.coerce.number().min(0),
    maxStake: z.coerce.number(),
    teamSelectionLimit: z.coerce.number().min(0),
    contestCategoryLeagueLimits: z.array(
      z.object({
        contestCategoryId: z.string(),
        numberOfPicks: z.number(),
        enabled: z.boolean(),
        allInPayoutMultiplier: z.coerce.number().min(0),
        primaryInsuredPayoutMultiplier: z.coerce.number().min(0),
        secondaryInsuredPayoutMultiplier: z.coerce.number().min(0),
      }),
    ),
  })
  .refine((data) => data.maxStake > data.minStake, {
    message: 'Maximum limit must be greater than minimum',
    path: ['maxStake'],
  });

export type LeagueLimitType = z.infer<typeof LeagueLimitFormValidationSchema>;
