import React from 'react';
import { render } from '@testing-library/react';
import RewardCard from './RewardCard';
import { mockBanner } from './__mocks__/mockBanner';

describe('RewardCard', () => {
  it('should render', () => {
    const props = {
      banner: mockBanner,
      handleClick: jest.fn(),
    };
    const { container } = render(<RewardCard {...props} />);
    expect(container).toMatchSnapshot();
  });
});
