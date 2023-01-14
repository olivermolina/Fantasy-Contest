import classNames from 'classnames';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { toast } from 'react-toastify';
import LandingLayout from '~/components/LandingLayout';
import { UrlPaths } from '~/constants/UrlPaths';
import { supabase } from '~/utils/supabaseClient';
import { trpc } from '~/utils/trpc';
import ReferralModal from '~/components/ReferralModal';
import ChangeRouteLoadingContainer from '~/containers/ChangeRouteLoadingContainer/ChangeRouteLoadingContainer';
import BackdropLoading from '~/components/BackdropLoading';
import { TRPCClientError } from '@trpc/client';

export type SignupInputs = {
  email: string;
  phone: string;
  username: string;
  state: string;
  DOB: Date;
  password: string;
  confirmPassword: string;
  referralCode: string;
};

const Auth = () => {
  const router = useRouter();
  const { referral } = router.query;
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    clearErrors,
    setError,
    watch,
  } = useForm<SignupInputs>();
  const mutation = trpc.user.signUp.useMutation();
  const referralMutation = trpc.user.checkReferral.useMutation();
  const onSubmit: SubmitHandler<SignupInputs> = async (data) => {
    try {
      await mutation.mutateAsync({
        ...data,
      });
      router.push(UrlPaths.Challenge);
    } catch (error) {
      const e = error as TRPCClientError<any>;
      toast.error(
        e.shape?.message ||
          'There was an error registering. Please try again later.',
      );
    }
  };

  const setReferralCode = (referralCode: string) => {
    setValue('referralCode', referralCode);
  };
  const checkReferralCode = async (referralCode: string) => {
    if (!referralCode) {
      clearErrors('referralCode');
      return;
    }

    try {
      const result = await referralMutation.mutateAsync({
        referralCode,
      });
      if (result) {
        setReferralCode(referralCode);
        clearErrors('referralCode');
      }
    } catch (error) {
      setError('referralCode', {
        type: 'custom',
        message:
          "We couldn't find that Referral Code. Are you sure about that?",
      });
    }
  };
  const watchReferralCode = watch('referralCode', '');

  const defaultClasses =
    'rounded-full text-2xl bg-gray-200 font-bold text-gray-500 p-4 w-full';

  useEffect(() => {
    if (referral) {
      checkReferralCode(referral?.toString());
    }
  }, [referral]);

  return (
    <LandingLayout>
      <ChangeRouteLoadingContainer />
      <BackdropLoading open={mutation.isLoading} />
      <div className="flex p-4 justify-center items-center">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-4 p-8 w-full rounded-2xl bg-white text-black overflow-y-auto"
        >
          <h2 className="font-bold col-span-1 lg:col-span-2 mb-4 text-center text-4xl">
            Please fill all the details
          </h2>
          <input
            placeholder="Email"
            type="email"
            id="email"
            required
            style={{
              maxHeight: 64,
            }}
            className={classNames(defaultClasses, 'col-span-1 lg:col-span-2')}
            {...register('email')}
          />
          <input
            placeholder="Username"
            type="username"
            id="username"
            required
            style={{
              maxHeight: 64,
            }}
            className={classNames(defaultClasses)}
            {...register('username')}
          />
          <input
            placeholder="State of Residence"
            type="state"
            id="state"
            required
            style={{
              maxHeight: 64,
            }}
            className={classNames(defaultClasses)}
            {...register('state')}
          />
          <input
            placeholder="Phone: 1 (234) 555-9810"
            type="tel"
            id="phone"
            required
            style={{
              maxHeight: 64,
            }}
            className={classNames(defaultClasses)}
            {...register('phone')}
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
          <input
            placeholder="Password"
            type="password"
            id="password"
            required
            style={{
              maxHeight: 64,
            }}
            className={classNames(defaultClasses)}
            {...register('password')}
          />

          <input
            placeholder="Confirm Password"
            type="password"
            id="confirmPassword"
            required
            style={{
              maxHeight: 64,
            }}
            className={classNames(defaultClasses)}
            {...register('confirmPassword')}
          />

          <ReferralModal
            watchReferralCode={watchReferralCode}
            clearErrors={clearErrors}
            setReferralCode={setReferralCode}
            checkReferralCode={checkReferralCode}
            errorMessage={errors?.referralCode?.message}
          />

          <button
            type="submit"
            style={{
              maxHeight: 64,
            }}
            className="p-4 text-white rounded-full font-bold text-2xl bg-blue-600"
          >
            Sign Up
          </button>
          <div className="flex gap-4 items-center">
            <div>
              <input
                className="rounded-full scale-150"
                id="verify"
                name="verify"
                required
                type="checkbox"
              />
            </div>
            <div className="text-sm">
              By registering, I certify that I am over 18 years of age and I
              have read and accepted the{' '}
              <span className="underline font-bold">
                <Link href="/terms">Terms and Conditions</Link>
              </span>{' '}
              and{' '}
              <span className="underline font-bold">
                <Link href="/privacy">Privacy policy</Link>
              </span>
              .
            </div>
          </div>
        </form>
      </div>
    </LandingLayout>
  );
};

export default Auth;

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
