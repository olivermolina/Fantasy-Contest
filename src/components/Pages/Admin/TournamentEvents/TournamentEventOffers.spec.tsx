import React from 'react';
import { render } from '@testing-library/react';
import TournamentEventOffers from './TournamentEventOffers';
import { tournamentEventOfferMock } from './__mocks__/tournamentEventOfferMock';

describe('TournamentEventOffers', () => {
  it('should render', () => {
    const { container } = render(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      <TournamentEventOffers {...tournamentEventOfferMock} />,
    );
    expect(container).toMatchSnapshot();
  });
});
