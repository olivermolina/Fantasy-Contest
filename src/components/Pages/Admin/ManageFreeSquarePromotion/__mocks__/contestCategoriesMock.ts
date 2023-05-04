import { ContestCategory } from '@prisma/client';
import { faker } from '@faker-js/faker';

export const contestCategoriesMock: ContestCategory[] = [
  {
    id: faker.datatype.uuid(),
    numberOfPicks: 2,
    allInPayoutMultiplier: 3,
    primaryInsuredPayoutMultiplier: 2,
    secondaryInsuredPayoutMultiplier: 0.5,
  },
  {
    id: faker.datatype.uuid(),
    numberOfPicks: 3,
    allInPayoutMultiplier: 5,
    primaryInsuredPayoutMultiplier: 2.5,
    secondaryInsuredPayoutMultiplier: 1.25,
  },
  {
    id: faker.datatype.uuid(),
    numberOfPicks: 4,
    allInPayoutMultiplier: 10,
    primaryInsuredPayoutMultiplier: 5,
    secondaryInsuredPayoutMultiplier: 1.25,
  },
];
