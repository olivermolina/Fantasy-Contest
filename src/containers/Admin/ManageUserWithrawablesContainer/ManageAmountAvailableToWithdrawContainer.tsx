import React, { useState } from 'react';
import { SubmitHandler } from 'react-hook-form';
import { TransactionType, User } from '@prisma/client';
import { toast } from 'react-toastify';
import { TRPCClientError } from '@trpc/client';
import BackdropLoading from '~/components/BackdropLoading';
import { ManagementInputs } from '~/components/Admin/Management/Management';
import ManageAmountAvailableToWithdraw from '~/components/Pages/Admin/ManageAmountAvailableToWithdraw/ManageAmountAvailableToWithdraw';
import { trpc } from '~/utils/trpc';

export default function ManageAmountAvailableToWithdrawContainer() {
  const { data, isLoading: userIsLoading } = trpc.user.users.useQuery();

  const [selectedUserId, setSelectedUserId] = useState<string | undefined>(
    undefined,
  );
  const { isLoading: mutationIsLoading, mutateAsync } =
    trpc.user.addRemoveWithdrawable.useMutation();
  const {
    data: userTotalBalance,
    refetch,
    isLoading,
  } = trpc.user.userTotalBalance.useQuery({ userId: selectedUserId });

  const onSubmit: SubmitHandler<ManagementInputs> = async (inputs) => {
    try {
      const { amount, transactionType } = inputs;
      if (
        transactionType === TransactionType.DEBIT &&
        amount > Number(userTotalBalance?.withdrawableAmount)
      ) {
        toast.error(
          `Oops! You can't remove balance more than the current amount available to withdraw.`,
        );
        return;
      }

      const user = inputs.user as User;
      await mutateAsync({ amount, userId: user.id, transactionType });
      const action =
        transactionType === TransactionType.CREDIT ? 'added' : 'removed';
      await refetch();
      toast.success(
        `You successfully ${action} balance from the amount available to withdraw to ${
          user?.username || user?.email
        }.`,
      );
    } catch (error) {
      const e = error as TRPCClientError<any>;
      toast.error(e?.message || `Oops! Something went wrong.`);
    }
  };

  return (
    <>
      <BackdropLoading open={mutationIsLoading} />

      <ManageAmountAvailableToWithdraw
        users={data || []}
        onSubmit={onSubmit}
        isLoading={userIsLoading || isLoading}
        setSelectedUserId={setSelectedUserId}
        userTotalBalance={userTotalBalance}
      />
    </>
  );
}
