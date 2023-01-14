import React from 'react';
import { Box } from '@mui/material';
import { trpc } from '~/utils/trpc';
import Markets from '~/components/Admin/Market';
import useTeams from '~/hooks/useTeams';
import { OfferWithTeams } from '~/components/Admin/Offer/OfferForm/OfferForm';
import usePlayers from '~/hooks/usePlayers';
import { Market, Prisma } from '@prisma/client';
import { TRPCClientError } from '@trpc/client';
import { toast } from 'react-toastify';
import BackdropLoading from '~/components/BackdropLoading';
import { useQueryClient } from '@tanstack/react-query';
import { MarketResult } from '~/server/routers/admin/markets';

interface Props {
  offer?: OfferWithTeams;
}

const AdminMarketContainer = (props: Props) => {
  const queryClient = useQueryClient();
  const marketInput = {
    offerId: props.offer?.gid || '',
    limit: 100,
    cursor: undefined,
  };

  const {
    isLoading,
    data,
    isFetching,
    fetchNextPage,
    refetch: refetchMarket,
  } = trpc.admin.markets.useInfiniteQuery(marketInput, {
    getNextPageParam: (lastPage) => lastPage?.nextCursor,
    keepPreviousData: true,
    refetchOnWindowFocus: false,
  });

  const { mutateAsync: mutateAsyncMarket, isLoading: mutateMarketIsLoading } =
    trpc.admin.upsertMarket.useMutation({
      // When mutate is called:
      onMutate: async (newMarket) => {
        // Cancel any outgoing refetches
        // (so they don't overwrite our optimistic update)
        await queryClient.cancelQueries({ queryKey: queryKey });

        // Snapshot the previous value
        const previousData = queryClient.getQueryData(queryKey);

        // // Optimistically update to the new value
        queryClient.setQueryData(queryKey, (old: any) => ({
          pageParams: old.pageParams,
          pages: old.pages.map((page: MarketResult) => ({
            ...page,
            markets:
              newMarket.id === 'new'
                ? [...page?.markets, newMarket]
                : page?.markets?.map((market) =>
                    market.id === newMarket.id ? newMarket : market,
                  ),
          })),
        }));

        // // Return a context object with the snapshotted value
        return { previousData };
      },
      // If the mutation fails,
      // use the context returned from onMutate to roll back
      onError: (err, newTodo, context) => {
        queryClient.setQueryData(queryKey, context?.previousData);
      },
      // Always refetch after error or success:
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey });
      },
    });

  const queryKey = trpc.admin.markets.getQueryKey(marketInput, 'infinite');

  const { mutateAsync: mutateAsyncDeleteMarket } =
    trpc.admin.deleteMarket.useMutation({
      // When mutate is called:
      onMutate: async (variables) => {
        // Cancel any outgoing refetches
        // (so they don't overwrite our optimistic update)
        await queryClient.cancelQueries({ queryKey: queryKey });

        // Snapshot the previous value
        const previousData = queryClient.getQueryData(queryKey);

        // Optimistically update to the new value
        queryClient.setQueryData(queryKey, (old: any) => ({
          pageParams: old.pageParams,
          pages: old.pages.map((page: MarketResult) => ({
            ...page,
            markets:
              page?.markets?.filter(
                (market) =>
                  market.id !== variables.id &&
                  market.sel_id !== variables.selId,
              ) || [],
          })),
        }));

        // Return a context object with the snapshotted value
        return { previousData };
      },
      // If the mutation fails,
      // use the context returned from onMutate to roll back
      onError: (err, newTodo, context) => {
        queryClient.setQueryData(queryKey, context?.previousData);
      },
      // Always refetch after error or success:
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey });
      },
    });

  const {
    players,
    isLoading: playerIsLoading,
    setFilterName: setPlayerFilterName,
    mutateIsLoading: playerMutateIsLoading,
    handleAddPlayer,
  } = usePlayers();

  const {
    teams,
    isLoading: teamIsLoading,
    setFilterName: setTeamFilterName,
    mutateIsLoading: teamMutateIsLoading,
    handleAddTeam,
  } = useTeams();

  //we must flatten the array of arrays from the useInfiniteQuery hook
  const flatData = React.useMemo(
    () => data?.pages?.flatMap((page) => page?.markets || []) ?? [],
    [data],
  );

  const totalDBRowCount = data?.pages?.[0]?.meta?.totalRowCount ?? 0;
  const totalFetched = flatData.length;

  const handleSave = async (market: Prisma.MarketCreateInput) => {
    try {
      const newMarket = await mutateAsyncMarket(market);
      // only refetch the first page
      refetchMarket({ refetchPage: (page, index) => index === 0 });

      const action =
        newMarket.id === 'new' || !newMarket.id ? 'added' : 'updated';
      toast.success(`${newMarket.name} market successfully ${action}.`, {
        toastId: newMarket.id,
      });
      return newMarket;
    } catch (error) {
      const e = error as TRPCClientError<any>;
      toast.error(e?.message);
    }
  };

  const handleDelete = async (market: Market) => {
    try {
      await mutateAsyncDeleteMarket({
        id: market.id,
        selId: market.sel_id,
      });
      // only refetch the first page
      refetchMarket({ refetchPage: (page, index) => index === 0 });
      toast.success(`Market '${market.name}' successfully deleted.`);
    } catch (error) {
      const e = error as TRPCClientError<any>;
      toast.error(e?.message);
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <BackdropLoading open={mutateMarketIsLoading} />
      <Markets
        offer={props.offer}
        flatData={flatData}
        isLoading={isLoading || mutateMarketIsLoading}
        totalDBRowCount={totalDBRowCount}
        totalFetched={totalFetched}
        isFetching={isFetching}
        fetchNextPage={fetchNextPage}
        players={players}
        playerIsLoading={playerIsLoading || playerMutateIsLoading}
        setPlayerFilterName={setPlayerFilterName}
        teams={teams}
        handleAddTeam={handleAddTeam}
        teamIsLoading={teamIsLoading || teamMutateIsLoading}
        setTeamFilterName={setTeamFilterName}
        handleAddPlayer={handleAddPlayer}
        handleSave={handleSave}
        handleDelete={handleDelete}
      />
    </Box>
  );
};

export default AdminMarketContainer;
