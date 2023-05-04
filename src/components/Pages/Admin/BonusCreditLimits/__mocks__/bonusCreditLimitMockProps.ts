import { contestCategoriesMock } from '~/components/Pages/Admin/ManageFreeSquarePromotion/__mocks__/contestCategoriesMock';

export const bonusCreditLimitMockProps = {
  onSubmit: () => console.log('submit'),
  contestCategories: contestCategoriesMock,
  data: {
    numberOfPlayers: ['2', '3', '4'],
    bonusCreditFreeEntryEquivalent: 25,
    stakeType: ['INSURED', 'ALL_IN'],
  },
};
