import { trpc } from '~/utils/trpc';
import React, { useMemo } from 'react';
import { SubmitHandler } from 'react-hook-form';
import { toast } from 'react-toastify';
import { TRPCClientError } from '@trpc/client';
import BackdropLoading from '~/components/BackdropLoading';
import SendSMS, {
  SELECT_ALL,
  SendSMSInput,
  SMSUser,
} from '~/components/Pages/Admin/SendSMS/SendSMS';

const SendSMSContainer = () => {
  const mutation = trpc.admin.createSms.useMutation();

  const { data, isLoading } = trpc.user.users.useQuery();

  const onSubmit: SubmitHandler<SendSMSInput> = async (inputs) => {
    try {
      const sendToAll = inputs.userIds.includes(SELECT_ALL.id);
      await mutation.mutateAsync({
        ...inputs,
        userIds: sendToAll
          ? (data?.map((user) => user.id) as [string, ...string[]]) || []
          : inputs.userIds,
      });
      toast.success(`SMS sent successfully`);
    } catch (error) {
      const e = error as TRPCClientError<any>;
      toast.error(
        e?.message || `Oops! Something went wrong. Please try again later.`,
      );
    }
  };

  const usersWithPhone = useMemo(() => {
    return (data?.filter((user) => user.phone) as SMSUser[]) || [];
  }, [data]);

  return (
    <>
      <BackdropLoading open={mutation.isLoading || isLoading} />
      <SendSMS onSubmit={onSubmit} users={usersWithPhone} />
    </>
  );
};

export default SendSMSContainer;
