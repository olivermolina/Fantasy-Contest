import React from 'react';
import BackdropLoading from '~/components/BackdropLoading';
import {
  LegRowModel,
  PendingBetsManagement,
  RowModel,
} from '~/components/Pages/Admin/PendingBetsManagement/PendingBetsManagement';
import { trpc } from '~/utils/trpc';
import { toast } from 'react-toastify';
import { useQueryClient } from '@tanstack/react-query';
import { BetStatus } from '@prisma/client';

export const PendingBetsManagementContainer = () => {
  const queryClient = useQueryClient();
  const { data, isLoading, refetch } = trpc.admin.getPendingBets.useQuery();
  const queryKey = trpc.admin.getPendingBets.getQueryKey();
  const mutation = trpc.admin.settlePendingBet.useMutation({
    // When mutate is called:
    onMutate: async (params) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)

      await queryClient.cancelQueries({ queryKey: queryKey });
      // Snapshot the previous value
      const previousData = queryClient.getQueryData(queryKey, { exact: false });
      const newData = (previousData as any).filter(
        (pick: any) => pick?.ticket !== params.betId,
      );
      // Optimistically update to the new value
      queryClient.setQueryData(queryKey, newData);

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

  const settlePick = async (currentRow: RowModel, betStatus: BetStatus) => {
    try {
      await mutation.mutateAsync({ betId: currentRow.ticket, betStatus });
      await refetch();
      toast.success('Status updated successfully');
    } catch (e) {
      toast.error('Something went wrong. Please try again later.');
    }
  };

  const updateBetLegMutation = trpc.admin.updateBetLeg.useMutation();
  const updateBetLeg = async (leg: LegRowModel, status: BetStatus) => {
    try {
      await updateBetLegMutation.mutateAsync({ id: leg.id, status });
      await refetch();
      toast.success('Leg status updated successfully');
    } catch (e) {
      toast.error('Error updating bet status');
    }
  };
  return (
    <>
      <BackdropLoading
        open={isLoading || mutation.isLoading || updateBetLegMutation.isLoading}
      />
      <PendingBetsManagement
        data={data || []}
        settlePick={settlePick}
        updateBetLeg={updateBetLeg}
      />
    </>
  );
};
