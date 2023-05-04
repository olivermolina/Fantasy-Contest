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
              email: 'jdoe@example.com',
              referral: 'jdoe',
            },
          ],
        }),
      },
      userTotalBalance: {
        useQuery: jest.fn().mockReturnValue({
          isLoading: false,
          data: {
            totalAmount: 100,
            totalCashAmount: 10,
            creditAmount: 1,
            unPlayedAmount: 0,
            withdrawableAmount: 0,
          },
        }),
      },
      addRemoveWithdrawable: {
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
