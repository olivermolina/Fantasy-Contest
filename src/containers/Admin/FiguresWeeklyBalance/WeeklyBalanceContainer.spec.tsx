import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { trpc } from '~/utils/trpc';
import WeeklyBalanceContainer from '~/containers/Admin/FiguresWeeklyBalance/WeeklyBalanceContainer';

jest.mock('~/utils/trpc', () => ({
  trpc: {
    admin: {
      weeklyBalances: {
        useQuery: jest.fn().mockReturnValue({
          isLoading: true,
          data: {
            dateRange: {
              from: new Date('2023-01-30'),
              to: new Date('2023-02-05'),
            },
            weeklyBalances: [],
          },
        }),
      },
    },
  },
}));

describe('WeeklyBalanceContainer', () => {
  it('should render correctly', () => {
    (trpc.admin.weeklyBalances.useQuery as jest.Mock).mockReturnValue({
      isLoading: true,
      data: [],
    });

    const { container } = render(<WeeklyBalanceContainer />);
    expect(container).toMatchSnapshot();
  });
});
