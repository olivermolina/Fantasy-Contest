import { useMemo, useState } from 'react';
import { trpc } from '~/utils/trpc';
import { Player } from '@prisma/client';
import { TRPCClientError } from '@trpc/client';
import { toast } from 'react-toastify';
import useDebounce from '~/hooks/useDebounce';
import { createFilterOptions } from '@mui/material/Autocomplete';
import { PlayerWithInputValue } from '~/components/Admin/Market/PlayerAutoComplete';

const filter = createFilterOptions<PlayerWithInputValue>({
  matchFrom: 'start',
  stringify: (option) => option.name,
  limit: 50,
  trim: true,
});

const usePlayers = () => {
  const [filterName, setFilterName] = useState('');

  const debouncedFilterName = useDebounce<string>(filterName, 200);
  const { data, isLoading, refetch } = trpc.admin.players.useQuery({
    take: 1000,
    filterName: debouncedFilterName,
    skip: 0,
  });

  const { mutateAsync, isLoading: mutateIsLoading } =
    trpc.admin.upsertPlayer.useMutation();

  const { mutateAsync: deleteMutateAsync, isLoading: deleteMutateIsLoading } =
    trpc.admin.deletePlayer.useMutation();

  const handleAddPlayer = async (player: Player) => {
    try {
      const newPlayer: Player = await mutateAsync(player);
      setFilterName(newPlayer.name);
      await refetch();
      toast.success(`${newPlayer.name} player successfully saved.`, {
        toastId: newPlayer.id,
      });
      return newPlayer || player;
    } catch (error) {
      const e = error as TRPCClientError<any>;
      toast.error(e?.message);
    }
  };

  const handleDeletePlayer = async (player: Player) => {
    try {
      const deletedPlayer: Player = await deleteMutateAsync(player);
      setFilterName(deletedPlayer.name);
      toast.success(`${deletedPlayer.name} player successfully deleted.`);
      return deletedPlayer || player;
    } catch (error) {
      const e = error as TRPCClientError<any>;
      toast.error(e?.message, {
        toastId: 'error',
      });
    }
  };

  const getOptionLabel = (option: PlayerWithInputValue) => {
    // e.g value selected with enter, right from the input
    if (typeof option === 'string') {
      return option;
    }
    if (option.inputValue) {
      return option.inputValue;
    }
    return option.name;
  };

  const players = useMemo(() => {
    if (data) {
      const params = { inputValue: debouncedFilterName, getOptionLabel };
      const filtered = filter(data, params);

      const inputValueExist = filtered.find(
        (filter) =>
          filter.name.toLowerCase().trim() ===
          debouncedFilterName.toLowerCase().trim(),
      );

      if (params.inputValue !== '' && !inputValueExist) {
        filtered.push({
          id: 'NEW',
          inputValue: params.inputValue,
          name: `Add "${params.inputValue}"`,
          position: '',
          team: '',
          teamid: '',
          headshot: '',
        });
      }
      return filtered;
    }
    return [];
  }, [data, debouncedFilterName]);

  return {
    setFilterName,
    players,
    isLoading,
    handleAddPlayer,
    mutateIsLoading: mutateIsLoading || deleteMutateIsLoading,
    handleDeletePlayer,
  };
};

export default usePlayers;
