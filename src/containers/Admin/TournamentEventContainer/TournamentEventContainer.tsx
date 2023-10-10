import React, { useState } from 'react';
import { trpc } from '~/utils/trpc';
import { TRPCClientError } from '@trpc/client';
import { toast } from 'react-toastify';
import useTeams from '~/hooks/useTeams';
import { useRouter } from 'next/router';
import dayjs from 'dayjs';
import AdminLayoutContainer from '~/containers/AdminLayoutContainer/AdminLayoutContainer';
import TournamentEvents, {
  TournamentEventWithOfferMarkets,
} from '~/components/Pages/Admin/TournamentEvents/TournamentEvents';
import { TournamentEventInput } from '~/schemas/TournamentEventSchema';
import TournamentEventOffers from '~/components/Pages/Admin/TournamentEvents/TournamentEventOffers';
import { Button, Dialog } from '@mui/material';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { TournamentEventOfferInput } from '~/schemas/TournamentEventOffersSchema';
import usePlayers from '~/hooks/usePlayers';
import { League } from '@prisma/client';

const TournamentEventContainer = () => {
  const router = useRouter();
  const from = router.query.from
    ? dayjs(router.query.from as string)
        .startOf('D')
        .toDate()
    : dayjs().subtract(1, 'month').startOf('D').toDate();
  const to = router.query.to
    ? dayjs(router.query.to as string)
        .startOf('D')
        .toDate()
    : dayjs().startOf('D').toDate();

  const [tournamentEvent, selectedTournamentEvent] =
    useState<TournamentEventWithOfferMarkets | null>(null);

  const {
    players,
    isLoading: playerIsLoading,
    setFilterName: setPlayerFilterName,
    mutateIsLoading: playerMutateIsLoading,
    handleAddPlayer,
    handleDeletePlayer,
  } = usePlayers();

  const {
    teams,
    isLoading: teamIsLoading,
    setFilterName: setTeamFilterName,
    mutateIsLoading: teamMutateIsLoading,
    handleAddTeam,
    handleDeleteTeam,
  } = useTeams();

  const { data, refetch, isLoading, isFetching } =
    trpc.admin.tournamentEvents.useQuery({
      from,
      to,
    });

  const {
    mutateAsync: mutateAsyncTournamentEvent,
    isLoading: mutateIsLoading,
  } = trpc.admin.saveTournamentEvent.useMutation();

  const { mutateAsync: mutateAsyncDeleteTournamentEvent } =
    trpc.admin.deleteTournamentEvent.useMutation();

  const { mutateAsync: mutateAsyncDeleteTournamentEventOffer } =
    trpc.admin.deleteTournamentEventOffer.useMutation();

  const {
    mutateAsync: mutateAsyncTournamentEventOffer,
    isLoading: mutateTournamentEventOfferIsLoading,
  } = trpc.admin.saveTournamentEventOffer.useMutation();

  const {
    mutateAsync: mutateAsyncCopyTournamentEventOffer,
    isLoading: copyTournamentEventOfferIsLoading,
  } = trpc.admin.copyTournamentEvent.useMutation();

  const handleDeleteEvent = async (id: string) => {
    try {
      const result = await mutateAsyncDeleteTournamentEvent({ id });
      toast.success('Success!');
      refetch();
      return result;
    } catch (error) {
      const e = error as TRPCClientError<any>;
      toast.error(e?.message);
      return null;
    }
  };

  const handleSaveEvent = async (inputs: TournamentEventInput) => {
    try {
      return await mutateAsyncTournamentEvent({
        ...inputs,
        updated_at: dayjs(inputs.updated_at).toDate(),
      });
    } catch (error) {
      const e = error as TRPCClientError<any>;
      toast.error(e?.message);
      return null;
    }
  };

  const handleSelectTournamentEvent = (
    tournamentEvent: TournamentEventWithOfferMarkets,
  ) => {
    selectedTournamentEvent(tournamentEvent);
  };

  const handleSaveTournamentEventOffer = async (
    inputs: TournamentEventOfferInput,
  ) => {
    try {
      await mutateAsyncTournamentEventOffer(inputs);
      toast.success('Success!');
    } catch (error) {
      const e = error as TRPCClientError<any>;
      toast.error(e?.message);
    }
  };

  const handleDeleteTournamentEventOffer = async (
    id: string,
    league: League,
  ) => {
    try {
      const result = await mutateAsyncDeleteTournamentEventOffer({
        id,
        league,
      });
      toast.success('Success!');
      return result;
    } catch (error) {
      const e = error as TRPCClientError<any>;
      toast.error(e?.message);
      return null;
    }
  };

  const handleClose = () => {
    refetch();
    selectedTournamentEvent(null);
  };

  const handleCopyTournamentEvent = async (id: string) => {
    try {
      await mutateAsyncCopyTournamentEventOffer({ id });
      await refetch();
      toast.success('Tournament event copied!');
    } catch (error) {
      const e = error as TRPCClientError<any>;
      toast.error(e?.message);
      return null;
    }
  };

  return (
    <AdminLayoutContainer>
      <TournamentEvents
        isLoading={
          isLoading ||
          mutateIsLoading ||
          isFetching ||
          copyTournamentEventOfferIsLoading
        }
        data={data || []}
        from={from}
        to={to}
        handleSaveEvent={handleSaveEvent}
        handleDeleteEvent={handleDeleteEvent}
        handleSelectTournamentEvent={handleSelectTournamentEvent}
        handleCopyTournamentEvent={handleCopyTournamentEvent}
      />
      <Dialog fullWidth fullScreen open={tournamentEvent !== null}>
        <DialogTitle>{tournamentEvent?.name}</DialogTitle>
        <DialogContent dividers>
          {tournamentEvent && (
            <TournamentEventOffers
              tournamentEvent={tournamentEvent}
              handleSaveTournamentEventOffer={handleSaveTournamentEventOffer}
              handleDeleteTournamentEventOffer={
                handleDeleteTournamentEventOffer
              }
              isLoading={mutateTournamentEventOfferIsLoading}
              players={players}
              teams={teams}
              setPlayerFilterName={setPlayerFilterName}
              handleAddPlayer={handleAddPlayer}
              handleDeletePlayer={handleDeletePlayer}
              playerIsLoading={playerIsLoading || playerMutateIsLoading}
              setTeamFilterName={setTeamFilterName}
              teamIsLoading={teamIsLoading || teamMutateIsLoading}
              handleAddTeam={handleAddTeam}
              handleDeleteTeam={handleDeleteTeam}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant={'outlined'}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </AdminLayoutContainer>
  );
};

export default TournamentEventContainer;
