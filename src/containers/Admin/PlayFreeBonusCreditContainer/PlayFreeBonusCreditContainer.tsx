import React, { useMemo, useState } from 'react';
import { trpc } from '~/utils/trpc';
import { SubmitHandler } from 'react-hook-form';
import { User } from '@prisma/client';
import { toast } from 'react-toastify';
import { TRPCClientError } from '@trpc/client';
import BackdropLoading from '~/components/BackdropLoading';
import { ManagementInputs } from '~/components/Admin/Management/Management';
import FreePlayBonusCredit from '~/components/Pages/Admin/FreePlayBonusCredit/FreePlayBonusCredit';
import FreePlayUserBonusCreditsTable, {
  FreePlayRowModel,
} from '~/components/Pages/Admin/FreePlayBonusCredit/FreePlayUserBonusCreditsTable';

const PlayFreeBonusCreditContainer = () => {
  const { data, isLoading } = trpc.user.users.useQuery();
  const [userId, setUserId] = useState<string | undefined>();

  const mutation = trpc.admin.addCredit.useMutation();

  const cancelCreditMutation = trpc.admin.cancelUserBonusCredits.useMutation();

  const { data: tableData, refetch } = trpc.admin.getUserBonusCredits.useQuery({
    userId: userId || '',
  });

  const onSubmit: SubmitHandler<ManagementInputs> = async (inputs) => {
    try {
      const { creditAmount } = inputs;
      const user = inputs.user as User;
      await mutation.mutateAsync({ creditAmount, userId: user.id });
      toast.success(
        `You successfully added a free credit to ${
          user?.username || user?.email
        }.`,
      );
      refetch();
    } catch (error) {
      const e = error as TRPCClientError<any>;
      toast.error(
        e?.message || `Oops! Something went wrong when adding a free credit.`,
      );
    }
  };

  const onSubmitDeletePlayFreeCredit = async (row: FreePlayRowModel) => {
    try {
      await cancelCreditMutation.mutateAsync({ transactionId: row.id });
      toast.success(`Success!`);
      refetch();
    } catch (error) {
      const e = error as TRPCClientError<any>;
      toast.error(e?.message || `Oops! Something went wrong.`);
    }
  };

  const userBonusCredits = useMemo(
    () => (userId && tableData ? tableData : []) as FreePlayRowModel[],
    [userId, tableData],
  );

  return (
    <>
      <BackdropLoading open={mutation.isLoading} />
      <FreePlayBonusCredit
        users={data || []}
        isLoading={isLoading}
        onSubmit={onSubmit}
        setSelectedUserId={setUserId}
      />
      <FreePlayUserBonusCreditsTable
        data={userBonusCredits}
        onSubmitDeletePlayFreeCredit={onSubmitDeletePlayFreeCredit}
      />
    </>
  );
};

export default PlayFreeBonusCreditContainer;
