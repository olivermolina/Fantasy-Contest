import { Prisma } from '@prisma/client';
import { contestCategoriesMock } from '~/components/Pages/Admin/ManageFreeSquarePromotion/__mocks__/contestCategoriesMock';

export const freeSquareMocks = {
  id: '1',
  created_at: new Date(),
  updated_at: new Date(),
  discount: new Prisma.Decimal(95),
  FreeSquareContestCategory: [
    {
      id: '1',
      contestCategory: contestCategoriesMock[0]!,
      contestCategoryId: '1',
      freeSquareId: '1',
    },
    {
      id: '2',
      contestCategory: contestCategoriesMock[2]!,
      contestCategoryId: '1',
      freeSquareId: '1',
    },
  ],
  maxStake: new Prisma.Decimal(10),
  freeEntryEnabled: true,
};
