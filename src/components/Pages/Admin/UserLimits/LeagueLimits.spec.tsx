import { render } from '@testing-library/react';
import LeagueLimits from './LeagueLimits';
import { leagueLimitsMock } from './__mocks__/leagueLimitMock';

describe('LeagueLimits', () => {
  it('should render correctly', () => {
    const { container } = render(
      <LeagueLimits onSubmit={jest.fn()} leagueLimits={leagueLimitsMock} />,
    );
    expect(container).toMatchSnapshot();
  });
});
