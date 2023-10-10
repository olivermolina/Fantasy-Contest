import React from 'react';
import { render, screen } from '@testing-library/react';
import OfferForm from './OfferForm';
import { League, Status, Team } from '@prisma/client';
import dayjs from 'dayjs';

describe('OfferForm', () => {
  it('should show correct game time format', () => {
    const props = {
      handleClose: () => alert('test'),
      handleSave: async () => alert('test'),
      isLoading: false,
      mutationError: '',
      handleAddTeam: async (team: Team) => team,
      offer: {
        gid: 'test-offer',
        league: League.NBA,
        gamedate: '2023-01-23',
        gametime: '11:00 PM',
        status: Status.Scheduled,
        home: null,
        away: null,
        epoch: dayjs().unix(),
        matchup: `away @ home`,
        manualEntry: true,
        inplay: false,
        start_utc: null,
        end_utc: null,
        created_at: new Date(),
        updated_at: new Date(),
        homeTeamId: 'homeId',
        awayTeamId: 'awayId',
        tournamentEventId: null,
      },
      homeTeamIsLoading: false,
      awayTeamIsLoading: false,
      homeTeams: [],
      awayTeams: [],
      homeTeamSetFilterName: jest.fn(),
      awayTeamSetFilterName: jest.fn(),
      handleDeleteTeam: jest.fn(),
    };
    render(<OfferForm {...props} />);

    expect(screen.getByTestId('gametime')).toHaveValue('11:00 PM');
  });
});
