import { ContestCategory } from '@prisma/client';

/**
 * This function will calculate teaser odds. All teasers currently pay -110 meaning to make 100
 * dollars you have to bet 110.
 *
 * @param stake the amount to bet on the teaser
 */
export function calculateTeaserPayout(
  stake: number,
  contestCategory?: ContestCategory | null,
) {
  const payoutMultiplier = contestCategory?.allInPayoutMultiplier || 0.9;
  return Number((stake * payoutMultiplier).toFixed(2));
}
