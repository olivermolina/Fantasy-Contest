import React from 'react';
import BackdropLoading from '~/components/BackdropLoading';
import {
  PendingBetsManagement,
  RowModel,
} from '~/components/Pages/Admin/PendingBetsManagement/PendingBetsManagement';
import { trpc } from '~/utils/trpc';
import { toast } from 'react-toastify';
import { useQueryClient } from '@tanstack/react-query';

export const PendingBetsManagementContainer = () => {
  const queryClient = useQueryClient();
  const { data, isLoading } = trpc.admin.getPendingBets.useQuery();
  const queryKey = trpc.admin.getPendingBets.getQueryKey();
  const mutation = trpc.admin.deleteAndRefundBet.useMutation({
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
  const deleteBetById = async (currentRow: RowModel) => {
    try {
      await mutation.mutateAsync({ betId: currentRow.ticket });
      toast.success(
        `You successfully deleted the pick with ID ${currentRow.ticket}.`,
      );
    } catch (e) {
      toast.error(
        'Something went wrong when deleting the pick. Please try again later.',
      );
    }
  };
  return (
    <>
      <BackdropLoading open={isLoading || mutation.isLoading} />
      <PendingBetsManagement
        data={data || []}
        onClickDeleteRow={deleteBetById}
      />
    </>
  );
};
