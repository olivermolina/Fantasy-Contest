import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ManageAmountAvailableToWithdrawContainer from './ManageAmountAvailableToWithdrawContainer';

jest.mock('~/utils/trpc', () => ({
  trpc: {
    user: {
      users: {
        useQuery: jest.fn().mockReturnValue({
          isLoading: true,
          data: [
            {
              id: 'user-id',
              username: 'jdoe',
              Wallets: [
                {
                  balance: 100,
                  cashBalance: 100,
                  bonusCredits: 0,
                  amountAvailableToWithdraw: 100,
                },
              ],
            },
          ],
        }),
      },
    },
    admin: {
      saveUserWallet: {
        useMutation: jest.fn().mockReturnValue({
          isLoading: false,
          mutate: jest.fn(),
        }),
      },
    },
  },
}));

describe('ManageAmountAvailableToWithdrawContainer', () => {
  it('should render correctly', () => {
    const { container } = render(<ManageAmountAvailableToWithdrawContainer />);
    expect(container).toMatchSnapshot();
  });
});
