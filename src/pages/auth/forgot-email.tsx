import classNames from 'classnames';
import Link from 'next/link';
import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import LandingLayout from '~/components/LandingLayout';
import { trpc } from '~/utils/trpc';
import ChangeRouteLoadingContainer from '~/containers/ChangeRouteLoadingContainer/ChangeRouteLoadingContainer';
import BackdropLoading from '~/components/BackdropLoading';
import { TRPCClientError } from '@trpc/client';
import { FormErrorText } from '~/components/Form/FormErrorText';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';

export type ForgotEmailInputs = {
  username: string;
  DOB: string;
};

const Update = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotEmailInputs>();
  const mutation = trpc.user.forgotEmail.useMutation();
  const onSubmit: SubmitHandler<ForgotEmailInputs> = async (data) => {
    try {
      await mutation.mutateAsync({
        ...data,
      });
    } catch (error) {
      const e = error as TRPCClientError<any>;
      toast.error(
        e.shape?.message ||
          'There was an error registering. Please try again later.',
      );
    }
  };

  const defaultClasses =
    'rounded-full text-2xl bg-gray-200 font-bold text-gray-500 p-4 w-full';

  return (
    <LandingLayout>
      <ChangeRouteLoadingContainer />
      <BackdropLoading open={mutation.isLoading} />
      <div className="flex p-4 justify-center items-center">
        {mutation.data ? (
          <div className="max-w-4xl flex flex-col p-4 lg:p-8 w-full rounded-2xl justify-center items-center bg-white text-black overflow-y-auto gap-2 lg:gap-4">
            <div className={'rounded-full bg-blue-100 p-2 w-fit'}>
              <EmailOutlinedIcon sx={{ fontSize: 75 }} />
            </div>
            <div className={'flex flex-col justify-center items-center gap-4 '}>
              <div className="flex flex-col justify-center gap-4 text-xl">
                <p className="text-left">
                  Your email address is:{' '}
                  <span className={'font-semibold'}>{mutation.data.email}</span>
                </p>
                <p className="mb-2 text-md">
                  Need help?{' '}
                  <span className="text-blue-700">
                    <Link href="/contact-us">Contact support. </Link>
                  </span>
                </p>

                <span className="text-blue-700 text-md">
                  <Link href="/auth/login">Back to log in</Link>
                </span>
              </div>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="max-w-4xl grid grid-cols-1 gap-4 p-8 w-full rounded-2xl bg-white text-black overflow-y-auto"
          >
            <h2 className="font-bold mb-4 text-center text-4xl">
              Recover My Email
            </h2>

            <h2 className=" mb-4 text-center text-2xl">
              Enter username and birthday to recover email address.
            </h2>
            <input
              type="username"
              placeholder="Username"
              style={{
                maxHeight: 64,
              }}
              className={classNames(defaultClasses)}
              {...register('username', { required: 'Username is required.' })}
            />
            <span>
              <input
                placeholder="Date of birth"
                type="date"
                id="DOB"
                required
                style={{
                  maxHeight: 64,
                }}
                className={classNames(defaultClasses)}
                {...register('DOB')}
              />
              <span className="text-sm ml-4">Date of Birth</span>
            </span>
            <FormErrorText>{errors.DOB?.message}</FormErrorText>
            <button
              style={{
                maxHeight: 64,
              }}
              className="p-4 capitalize text-white rounded-full font-bold text-2xl bg-blue-600"
              type="submit"
            >
              Submit
            </button>
          </form>
        )}
      </div>
    </LandingLayout>
  );
};

export default Update;
