import { Prisma } from '@prisma/client';

export const freeSquareMocks = {
  id: '1',
  created_at: new Date(),
  updated_at: new Date(),
  discount: new Prisma.Decimal(95),
  FreeSquareContestCategory: [
    {
      id: '1',
      contestCategory: {
        id: '1',
        numberOfPicks: 2,
        allInPayoutMultiplier: 1,
        primaryInsuredPayoutMultiplier: 1,
        secondaryInsuredPayoutMultiplier: 1,
      },
      contestCategoryId: '1',
      freeSquareId: '1',
    },
    {
      id: '1',
      contestCategory: {
        id: '1',
        numberOfPicks: 4,
        allInPayoutMultiplier: 1,
        primaryInsuredPayoutMultiplier: 1,
        secondaryInsuredPayoutMultiplier: 1,
      },
      contestCategoryId: '1',
      freeSquareId: '1',
    },
  ],
};
