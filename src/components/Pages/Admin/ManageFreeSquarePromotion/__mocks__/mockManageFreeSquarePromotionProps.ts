import { League } from '@prisma/client';
import { contestCategoriesMock } from './contestCategoriesMock';

export const mockManageFreeSquarePromotionProps = {
  data: [
    {
      id: '63182-83-5227',
      selId: 5227,
      statName: 'Points',
      total: 11.5,
      matchName: 'STAN @ ORE ST',
      playerName: 'Glenn Taylor Jr.',
      marketId: '63182-83-5227',
      league: 'NCAAB',
      matchTime: 'Mar 02, 2023 @ 09:00 PM',
      freeSquare: {
        id: '1',
        discount: 95,
        pickCategories: [
          {
            id: '2 pick',
            numberOfPicks: 2,
          },
          {
            id: '3 pick',
            numberOfPicks: 3,
          },
          {
            id: '4 pick',
            numberOfPicks: 4,
          },
        ],
        maxStake: 25,
        freeEntryEnabled: false,
      },
      freeSquareDiscount: 95,
      discountedTotal: 1,
      picksCategory: '2,3,4',
      maxStake: 25,
      freeEntryEnabled: false,
    },
    {
      id: '63194-86-3541',
      selId: 3541,
      statName: 'Points Rebounds and Assists',
      total: 16.5,
      matchName: 'ARIZ @ USC',
      playerName: 'Kerr Kriisa',
      league: 'NCAAB',
      matchTime: 'Mar 02, 2023 @ 11:00 PM',
      freeSquare: {
        id: '1',
        discount: 98,
        pickCategories: [
          {
            id: '2 pick',
            numberOfPicks: 2,
          },
          {
            id: '3 pick',
            numberOfPicks: 3,
          },
          {
            id: '4 pick',
            numberOfPicks: 4,
          },
        ],
        maxStake: 25,
        freeEntryEnabled: false,
      },
      freeSquareDiscount: 95,
      discountedTotal: 1,
      picksCategory: '2,3,4',
      maxStake: 25,
      freeEntryEnabled: false,
    },
  ],
  setSelectedLeague: () => alert('setSelectedLeague'),
  handleSave: () => console.log('save'),
  contestCategories: contestCategoriesMock,
  selectedLeague: League.NBA,
  handleDelete: () => console.log('delete'),
};
