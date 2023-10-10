import { ContestCategory, Prisma } from '@prisma/client';
import { faker } from '@faker-js/faker';

export const contestCategoriesMock: ContestCategory[] = [
  {
    id: faker.datatype.uuid(),
    numberOfPicks: 2,
    allInPayoutMultiplier: 3,
    primaryInsuredPayoutMultiplier: 2,
    secondaryInsuredPayoutMultiplier: 0.5,
    customStakeLimitEnabled: false,
    maxStakeAmount: new Prisma.Decimal(0),
    minStakeAmount: new Prisma.Decimal(0),
    bonusCreditLimitId: null,
  },
  {
    id: faker.datatype.uuid(),
    numberOfPicks: 3,
    allInPayoutMultiplier: 5,
    primaryInsuredPayoutMultiplier: 2.5,
    secondaryInsuredPayoutMultiplier: 1.25,
    customStakeLimitEnabled: false,
    maxStakeAmount: new Prisma.Decimal(0),
    minStakeAmount: new Prisma.Decimal(0),
    bonusCreditLimitId: null,
  },
  {
    id: faker.datatype.uuid(),
    numberOfPicks: 4,
    allInPayoutMultiplier: 10,
    primaryInsuredPayoutMultiplier: 5,
    secondaryInsuredPayoutMultiplier: 1.25,
    customStakeLimitEnabled: false,
    maxStakeAmount: new Prisma.Decimal(0),
    minStakeAmount: new Prisma.Decimal(0),
    bonusCreditLimitId: null,
  },
];
