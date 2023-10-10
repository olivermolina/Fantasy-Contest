import React from 'react';
import { render } from '@testing-library/react';
import ChallengeHeader from './ChallengeHeader';

describe('ChallengeHeader', () => {
  it('should render correctly', () => {
    const { container } = render(
      <ChallengeHeader
        challengePromoMessage={
          'Pick 2-4 players. Predict if they will get MORE or LESS than their projection.'
        }
        isLoading={false}
        handleOpenContactUs={jest.fn()}
      />,
    );
    expect(container).toMatchSnapshot();
  });
});
