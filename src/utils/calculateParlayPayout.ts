import { convertToDecimalOdds } from './convertToDecimalOdds';
import { ContestCategory } from '@prisma/client';

export function calculateParlayPayout(
  legs: number[],
  stake: number,
  contestCategory?: ContestCategory | null,
): number {
  const decimalFracs = legs.map(convertToDecimalOdds);
  const totalOdds = decimalFracs.reduce((acc, curr) => acc * curr, 0);
  const payoutMultiplier = contestCategory?.allInPayoutMultiplier || totalOdds;
  return Number((stake * payoutMultiplier).toFixed(2));
}
