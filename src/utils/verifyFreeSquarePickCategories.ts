import {
  ContestCategory,
  FreeSquare,
  FreeSquareContestCategory,
} from '@prisma/client';

/**
 * This function will verify if the Market Free Square is enabled based of the bet legs count
 * @param legCount {number} the number of bet legs
 * @param freeSquare {FreeSquare} the market FreeSquare object
 */
export const verifyFreeSquarePickCategories = (
  legCount: number,
  freeSquare?:
    | (FreeSquare & {
        FreeSquareContestCategory:
          | (FreeSquareContestCategory & {
              contestCategory: ContestCategory;
            })[]
          | null;
      })
    | null,
) => {
  // Do nothing if Free Square is not set
  if (!freeSquare) return;

  // Do nothing if contest picks category is not set
  if (
    !freeSquare.FreeSquareContestCategory ||
    freeSquare.FreeSquareContestCategory.length === 0
  ) {
    return;
  }

  const pickCategoryNumbers = freeSquare.FreeSquareContestCategory.map(
    (row) => row.contestCategory.numberOfPicks,
  );

  if (!pickCategoryNumbers.includes(legCount)) {
    throw new Error(
      `Sorry, free square promotion is only available for ${pickCategoryNumbers.join(
        ',',
      )} entries.`,
    );
  }
};
