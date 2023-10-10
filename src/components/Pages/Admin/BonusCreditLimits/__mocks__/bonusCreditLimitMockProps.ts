import { BetStakeType } from '@prisma/client';

export const bonusCreditLimitMockProps = {
  onSubmit: () => console.log('submit'),
  data: {
    signupFreeEntry: false,
    bonusCreditFreeEntryEquivalent: 50,
    bonusCreditLimits: [
      {
        contestCategoryId: '1',
        numberOfPicks: 2,
        id: '30387acd-660c-46f0-a9e6-af87c007e6fb',
        enabled: true,
        stakeTypeOptions: [BetStakeType.ALL_IN, BetStakeType.INSURED],
        bonusCreditFreeEntryEquivalent: 25,
      },
      {
        contestCategoryId: '2',
        numberOfPicks: 3,
        id: '316555e5-b447-468a-b57f-381bbf64919a',
        enabled: true,
        stakeTypeOptions: [BetStakeType.ALL_IN, BetStakeType.INSURED],
        bonusCreditFreeEntryEquivalent: 50,
      },
      {
        contestCategoryId: '3',
        numberOfPicks: 4,
        id: 'fc063fcd-1a25-46e2-9361-d947eec1f9a9',
        enabled: true,
        stakeTypeOptions: [BetStakeType.ALL_IN, BetStakeType.INSURED],
        bonusCreditFreeEntryEquivalent: 40,
      },
      {
        contestCategoryId: '4',
        numberOfPicks: 5,
        id: 'a2542740-e90f-4763-8a3a-f7afba68898c',
        enabled: true,
        stakeTypeOptions: [BetStakeType.ALL_IN, BetStakeType.INSURED],
        bonusCreditFreeEntryEquivalent: 20,
      },
    ],
  },
  openAddUsersFreeEntryConfirmDialog: () => console.log('open'),
};
