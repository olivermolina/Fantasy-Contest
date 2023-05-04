import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { LineExposureContainer } from './LineExposureContainer';
import { trpc } from '~/utils/trpc';

jest.mock('~/utils/trpc', () => ({
  trpc: {
    admin: {
      getLineExposures: {
        useQuery: jest.fn().mockReturnValue({
          isLoading: true,
          data: [],
        }),
      },
    },
  },
}));
describe('LineExposureContainer', () => {
  it('should show a loading screen when the query is loading', () => {
    (trpc.admin.getLineExposures.useQuery as jest.Mock).mockReturnValue({
      isLoading: true,
      data: [],
    });

    //To avoid dayjs dynamic result in snapshots
    jest.useFakeTimers().setSystemTime(new Date('2023-01-01'));

    const { container } = render(<LineExposureContainer />);
    expect(container).toMatchSnapshot();
  });
});
