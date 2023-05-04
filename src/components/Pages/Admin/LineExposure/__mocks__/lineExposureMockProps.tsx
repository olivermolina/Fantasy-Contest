import { League } from '@prisma/client';

export const lineExposureMockProps = {
  data: [
    {
      id: '1',
      name: 'LeBron James',
      category: 'Points',
      league: League.NBA,
      status: 'Scheduled',
      matchup: 'LAL @ DEN',
      total: 35,
      gamedate: '2023-01-23',
      gametime: '03:00:00 PM',
      underOdds: 100,
      overOdds: -120,
      overExposure: 4,
      underExposure: 2,
      betLegs: [
        {
          id: 'ticket-id',
          betId: 'bet-id',
          entryDate: '2023-01-22',
          payout: 100,
          stake: 10,
          type: 'OVER_ODDS',
          user: {
            id: 'user-1',
            firstName: 'John',
            lastName: 'Doe',
            username: 'jdoe',
          },
          status: 'WIN',
        },
      ],
    },
  ],
  setDateRange: () => console.log('setDateRange'),
  dateRange: null,
  selectedLeague: League.NBA,
  setSelectedLeague: () => console.log('setSelectedLeague'),
};
