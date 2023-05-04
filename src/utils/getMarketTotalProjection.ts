import { FreeSquare, Prisma } from '@prisma/client';

export type FreeSquareType = Omit<
  FreeSquare,
  'created_at' | 'updated_at' | 'discount' | 'maxStake' | 'freeEntryEnabled'
> & {
  discount: number | Prisma.Decimal;
};

/**
 * This function will get total projection of a free square line
 *
 * @param total {number} the original total projection of the market
 * @param marketFreeSquare {FreeSquare} the market FreeSquare object
 */
export function getMarketTotalProjection(
  total: number,
  marketFreeSquare?: FreeSquareType | null,
) {
  if (!marketFreeSquare) {
    return total;
  }
  const discount = total * (Number(marketFreeSquare.discount) / 100);
  return total - discount;
}
