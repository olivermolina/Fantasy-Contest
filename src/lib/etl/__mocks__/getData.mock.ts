import { IOddsResponse } from '~/lib/ev-analytics/IOddsResponse';

/**
 * Contains the Game Line mocks ONLY
 */
export const getDataResponse: IOddsResponse = {
  events: [
    {
      gid: 5127,
      gamedate: '2022-10-02',
      gametime: '09:30:00',
      epoch: 1664717400,
      start_utc: '2022-10-02 13:35:01',
      end_utc: '2022-10-02 16:37:01',
      inplay: false,
      status: 'Final',
      matchup: 'MIN @ NO',
      home: {
        id: 1,
        name: 'New Orleans Saints',
        code: 'NO',
      },
      away: {
        id: 2,
        name: 'Minnesota Vikings',
        code: 'MIN',
      },
      markets: [
        {
          id: '5127-9',
          sel_id: 1,
          type: 'GM',
          category: 'Game Line',
          name: 'New Orleans Saints',
          team: 'NO',
          offline: true,
          spread: 4,
          spread_odd: -110,
          total: 42,
          over: -110,
          under: -110,
          moneyline: 175,
          spread_bet: null,
          spread_cash: null,
          over_bet: null,
          under_bet: null,
          over_cash: null,
          under_cash: null,
          moneyline_bet: null,
          moneyline_cash: null,
          spread_result: 1,
          spread_stat: null,
          over_result: 1,
          under_result: 0,
          total_stat: null,
          moneyline_result: 0,
          moneyline_stat: null,
        },
        {
          id: '5127-9',
          sel_id: 2,
          type: 'GM',
          category: 'Game Line',
          name: 'Minnesota Vikings',
          team: 'MIN',
          offline: true,
          spread: -4,
          spread_odd: -110,
          total: 42,
          over: -110,
          under: -110,
          moneyline: -210,
          spread_bet: null,
          spread_cash: null,
          over_bet: null,
          under_bet: null,
          over_cash: null,
          under_cash: null,
          moneyline_bet: null,
          moneyline_cash: null,
          spread_result: 0,
          spread_stat: null,
          over_result: 1,
          under_result: 0,
          total_stat: null,
          moneyline_result: 1,
          moneyline_stat: null,
        },
      ],
    },
  ],
};
