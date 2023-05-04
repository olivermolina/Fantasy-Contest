import classNames from 'classnames';
import { GetServerSideProps } from 'next';
import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import LandingLayout from '~/components/LandingLayout';
import { UrlPaths } from '~/constants/UrlPaths';
import { supabase } from '~/utils/supabaseClient';
import { trpc } from '~/utils/trpc';
import { useRouter } from 'next/router';
import { TRPCClientError } from '@trpc/client';
import BackdropLoading from '~/components/BackdropLoading';
import ChangeRouteLoadingContainer from '~/containers/ChangeRouteLoadingContainer/ChangeRouteLoadingContainer';
import Link from 'next/link';

type Inputs = {
  email: string;
  password: string;
};

const defaultClasses =
  'rounded-full text-2xl bg-gray-200 font-bold text-gray-500 p-4 w-full';

const Create = () => {
  const router = useRouter();
  const mutation = trpc.user.login.useMutation();
  const { register, handleSubmit } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      await mutation.mutateAsync(data);
      router.push(UrlPaths.Challenge);
    } catch (error) {
      const e = error as TRPCClientError<any>;
      toast.error(e.message);
    }
  };
  return (
    <LandingLayout>
      <ChangeRouteLoadingContainer />
      <BackdropLoading open={mutation.isLoading} />
      <div className="flex p-4 justify-center items-center">
        <div className="max-w-4xl flex flex-col justify-between items-center gap-4 p-8 w-full rounded-2xl bg-white text-black">
          <h2 className="font-bold mb-4 text-center text-4xl">
            Please fill all the details
          </h2>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-8 w-full"
          >
            <input
              type="email"
              placeholder="email"
              className={classNames(defaultClasses)}
              {...register('email', { required: true })}
            />
            <input
              type="password"
              placeholder="password"
              className={classNames(defaultClasses)}
              {...register('password', {})}
            />

            <button
              className="p-4 capitalize text-white rounded-full font-bold text-2xl bg-primary w-full"
              type="submit"
            >
              submit
            </button>
          </form>
          <p className={'text-secondary'}>
            <Link href="/auth/forgot-password">Forgot Password? </Link>
          </p>
        </div>
      </div>
    </LandingLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const user = await supabase.auth.api.getUserByCookie(ctx.req, ctx.res);
  if (user.user) {
    return {
      redirect: {
        permanent: false,
        destination: UrlPaths.Challenge,
      },
    };
  }
  return {
    props: {},
  };
};

export default Create;
