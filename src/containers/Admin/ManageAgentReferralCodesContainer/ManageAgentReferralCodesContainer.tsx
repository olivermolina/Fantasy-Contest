import { trpc } from '~/utils/trpc';
import React from 'react';
import { SubmitHandler } from 'react-hook-form';
import { User, UserType } from '@prisma/client';
import { toast } from 'react-toastify';
import { TRPCClientError } from '@trpc/client';
import ManageAgentReferralCodes, {
  ManageUserAgentInputs,
} from '~/components/Pages/Admin/ManageAgentReferralCodes/ManageAgentReferralCodes';

const ManageAgentReferralCodesContainer = () => {
  const { data, isLoading, refetch } = trpc.user.users.useQuery(
    {
      userType: UserType.AGENT,
    },
    {
      trpc: {
        context: {
          skipBatch: true,
        },
      },
    },
  );

  const addMutation = trpc.admin.addReferralCode.useMutation();
  const deleteMutation = trpc.admin.deleteReferralCode.useMutation();
  const onSubmit: SubmitHandler<ManageUserAgentInputs> = async (inputs) => {
    try {
      const user = inputs.user as User;
      await addMutation.mutateAsync({
        referralCode: inputs.referral,
        userId: user.id,
      });
      refetch();
      toast.success('Referral code successfully added!');
    } catch (error) {
      const e = error as TRPCClientError<any>;
      toast.error(e?.message || `Oops! Something went wrong!`);
    }
  };

  const deleteReferralCode = async (userId: string, referralCode: string) => {
    try {
      await deleteMutation.mutateAsync({
        userId,
        referralCode,
      });

      refetch();
      toast.success('Referral code successfully deleted!');
    } catch (error) {
      const e = error as TRPCClientError<any>;
      toast.error(e?.message || `Oops! Something went wrong!`);
    }
  };

  return (
    <ManageAgentReferralCodes
      users={data || []}
      isLoading={isLoading}
      onSubmit={onSubmit}
      deleteReferralCode={deleteReferralCode}
    />
  );
};

export default ManageAgentReferralCodesContainer;
