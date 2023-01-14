import React from 'react';
import ContactUs from '~/components/ContactUs';
import { trpc } from '~/utils/trpc';
import { ContactUsInput } from '~/server/routers/user/contactUs';
import { TRPCClientError } from '@trpc/client';
import { toast } from 'react-toastify';

const ContactUsContainer = () => {
  const { isLoading, mutateAsync } = trpc.user.contactUs.useMutation();

  const onSubmit = async (data: ContactUsInput) => {
    try {
      await mutateAsync(data);
    } catch (error) {
      const e = error as TRPCClientError<any>;
      toast.error(e?.message);
    }
  };
  return <ContactUs isLoading={isLoading} onSubmit={onSubmit} />;
};

export default ContactUsContainer;
