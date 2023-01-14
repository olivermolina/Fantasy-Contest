import { useMemo, useState } from 'react';
import { trpc } from '~/utils/trpc';
import { Team } from '@prisma/client';
import { TRPCClientError } from '@trpc/client';
import { toast } from 'react-toastify';
import useDebounce from '~/hooks/useDebounce';
import { createFilterOptions } from '@mui/material/Autocomplete';
import { TeamWithInputValue } from '~/components/Admin/Offer/OfferForm/TeamAutoComplete';

const filter = createFilterOptions<TeamWithInputValue>({
  matchFrom: 'start',
  stringify: (option) => option.name,
  limit: 50,
  trim: true,
});

const useTeams = () => {
  const [filterName, setFilterName] = useState('');

  const debouncedFilterName = useDebounce<string>(filterName, 200);
  const { data, isLoading } = trpc.admin.teams.useQuery({
    take: 1000,
    filterName: debouncedFilterName,
    skip: 0,
  });

  const { mutateAsync, isLoading: mutateIsLoading } =
    trpc.admin.upsertTeam.useMutation();

  const handleAddTeam = async (team: Team) => {
    try {
      const newTeam: Team = await mutateAsync(team);
      setFilterName(newTeam.name);
      toast.success(`${newTeam.name} team successfully added.`);
      return newTeam || team;
    } catch (error) {
      const e = error as TRPCClientError<any>;
      toast.error(e?.message, {
        toastId: 'error',
      });
    }
  };

  const getOptionLabel = (option: TeamWithInputValue) => {
    // e.g value selected with enter, right from the input
    if (typeof option === 'string') {
      return option;
    }
    if (option.inputValue) {
      return option.inputValue;
    }
    return option.name;
  };

  const teams = useMemo(() => {
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
          code: '',
        });
      }

      return filtered;
    }
    return [];
  }, [data, debouncedFilterName]);

  return {
    setFilterName,
    teams: teams,
    isLoading,
    handleAddTeam,
    mutateIsLoading,
  };
};

export default useTeams;
