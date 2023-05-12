import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import PlayFreeBonusCreditContainer from './PlayFreeBonusCreditContainer';

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
            totalBalance: 0,
          },
        }),
      },
    },
    admin: {
      addCredit: {
        useMutation: jest.fn().mockReturnValue({
          isLoading: false,
          mutate: jest.fn(),
        }),
      },
      cancelUserBonusCredits: {
        useMutation: jest.fn().mockReturnValue({
          isLoading: false,
          mutate: jest.fn(),
        }),
      },
      getUserBonusCredits: {
        useQuery: jest.fn().mockReturnValue({
          isLoading: false,
          data: [],
        }),
      },
    },
  },
}));

describe('PlayFreeBonusCreditContainer', () => {
  it('should render correctly', () => {
    const { container } = render(<PlayFreeBonusCreditContainer />);
    expect(container).toMatchSnapshot();
  });
});
