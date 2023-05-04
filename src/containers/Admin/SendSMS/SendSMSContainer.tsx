import { trpc } from '~/utils/trpc';
import React from 'react';
import { SubmitHandler } from 'react-hook-form';
import { toast } from 'react-toastify';
import { TRPCClientError } from '@trpc/client';
import BackdropLoading from '~/components/BackdropLoading';
import SendSMS, {
  SendSMSInput,
} from '~/components/Pages/Admin/SendSMS/SendSMS';

const SendSMSContainer = () => {
  const mutation = trpc.admin.sendSms.useMutation();

  const onSubmit: SubmitHandler<SendSMSInput> = async (inputs) => {
    try {
      await mutation.mutateAsync(inputs);
      toast.success(`SMS sent successfully`);
    } catch (error) {
      const e = error as TRPCClientError<any>;
      toast.error(
        e?.message || `Oops! Something went wrong. Please try again later.`,
      );
    }
  };

  return (
    <>
      <BackdropLoading open={mutation.isLoading} />
      <SendSMS onSubmit={onSubmit} />
    </>
  );
};

export default SendSMSContainer;
