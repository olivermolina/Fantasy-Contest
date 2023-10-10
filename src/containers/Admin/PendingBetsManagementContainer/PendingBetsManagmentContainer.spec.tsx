import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { PendingBetsManagementContainer } from './PendingBetsManagementContainer';
import { trpc } from '~/utils/trpc';

jest.mock('~/utils/trpc', () => ({
  trpc: {
    admin: {
      getPendingBets: {
        getQueryKey: jest.fn(),
        useQuery: jest.fn().mockReturnValue({
          isLoading: true,
          data: [
            {
              ticket: 'TICKET-001',
              placed: '2022-01-01T00:00:00.000Z',
              userPhone: 'USER-001',
              username: 'BET-001',
              description: 'CONTEST-001',
              riskWin: '100',
            },
          ],
        }),
      },
      settlePendingBet: {
        useMutation: jest.fn().mockReturnValue({
          isLoading: false,
          mutate: jest.fn(),
        }),
      },
      updateBetLeg: {
        useMutation: jest.fn().mockReturnValue({
          isLoading: false,
          mutate: jest.fn(),
        }),
      },
    },
  },
}));
jest.mock('@tanstack/react-query', () => ({
  useQueryClient: jest.fn(),
}));

describe('PendingBetsManagementContainer', () => {
  it('should show a loading screen when the query is loading', () => {
    (trpc.admin.getPendingBets.useQuery as jest.Mock).mockReturnValue({
      isLoading: true,
      data: [],
    });

    const { container } = render(<PendingBetsManagementContainer />);
    expect(container).toMatchSnapshot();
  });
});
