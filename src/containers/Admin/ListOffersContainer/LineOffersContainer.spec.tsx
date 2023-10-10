import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ListOffersContainer from './ListOffersContainer';

jest.mock('~/utils/trpc', () => ({
  trpc: {
    contest: {
      listOffers: {
        useQuery: jest.fn().mockReturnValue({
          isLoading: true,
          data: [],
        }),
      },
    },
    admin: {
      overrideOffer: {
        useMutation: jest.fn().mockReturnValue({
          isLoading: true,
          data: [],
        }),
      },
    },
  },
}));
describe('ListOffersContainer', () => {
  it('it should render correctly', () => {
    const { container } = render(<ListOffersContainer />);
    expect(container).toMatchSnapshot();
  });
});
