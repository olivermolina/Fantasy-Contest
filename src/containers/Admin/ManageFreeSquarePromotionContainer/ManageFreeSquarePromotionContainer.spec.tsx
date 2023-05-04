import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { ManageFreeSquarePromotionContainer } from './ManageFreeSquarePromotionContainer';
import { trpc } from '~/utils/trpc';

jest.mock('~/utils/trpc', () => ({
  trpc: {
    contest: {
      listOffers: {
        useQuery: jest.fn().mockReturnValue({
          isLoading: true,
          data: [],
        }),
      },
      contestCategoryList: {
        useQuery: jest.fn().mockReturnValue({
          isLoading: true,
          data: [],
        }),
      },
    },
    admin: {
      addFreeSquarePromotion: {
        useMutation: jest.fn().mockReturnValue({
          isLoading: true,
          data: [],
        }),
      },
      deleteFreeSquarePromotion: {
        useMutation: jest.fn().mockReturnValue({
          isLoading: true,
          data: [],
        }),
      },
    },
  },
}));
describe('ManageFreeSquarePromotionContainer', () => {
  it('should show a loading screen when the query is loading', () => {
    (trpc.contest.listOffers.useQuery as jest.Mock).mockReturnValue({
      isLoading: true,
      data: [],
    });

    (trpc.contest.contestCategoryList.useQuery as jest.Mock).mockReturnValue({
      isLoading: true,
      data: [],
    });

    const { container } = render(<ManageFreeSquarePromotionContainer />);
    expect(container).toMatchSnapshot();
  });
});
