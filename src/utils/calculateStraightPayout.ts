import { ContestCategory } from '@prisma/client';

export const calculateStraightPayout = (bet: {
  odds: number;
  stake: number;
  contestCategory?: ContestCategory;
}) => {
  if (bet?.contestCategory) {
    return Number(
      bet.stake * bet?.contestCategory.allInPayoutMultiplier,
    ).toFixed(2);
  }

  return bet.odds > 0
    ? Number(bet.stake * (Math.abs(bet.odds) / 100)).toFixed(2)
    : Number(bet.stake / (Math.abs(bet.odds) / 100)).toFixed(2);
};
