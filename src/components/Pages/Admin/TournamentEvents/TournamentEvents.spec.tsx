import React from 'react';
import { render } from '@testing-library/react';
import TournamentEvents from './TournamentEvents';
import { tournamentEventMock } from './__mocks__/tournamentEventMock';

describe('TournamentEvents', () => {
  it('should render', () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const { container } = render(<TournamentEvents {...tournamentEventMock} />);
    expect(container).toMatchSnapshot();
  });
});
