import { ILookupRepsonse } from '~/lib/ev-analytics/ILookupResponse';

export const getLookupsMock: ILookupRepsonse = {
  games: {
    '57477': {
      id: 57477,
      date: '2022-04-07T14:20:00-04:00',
      matchup: 'MIL @ CHC',
      teams: [
        {
          id: 1,
          name: 'Chicago Cubs',
          abbreviation: 'CHC',
          homeaway: 'HOME',
        },
        {
          id: 2,
          name: 'Milwaukee Brewers',
          abbreviation: 'MIL',
          homeaway: 'AWAY',
        },
      ],
      double_header: false,
      gameorder: 1,
    },
  },
  teams: [
    {
      id: '1',
      name: 'Los Angeles Angels',
      nickname: 'Angels',
      abbreviation: 'LAA',
    },
    {
      id: '2',
      name: 'Team 2',
      nickname: 'Team',
      abbreviation: 'T2',
    },
  ],
  players: [
    {
      id: '3',
      name: 'Albert Pujols',
      position: '1B',
      teamid: '20',
      team: 'St. Louis Cardinals',
      headshot: '',
    },
  ],
};
