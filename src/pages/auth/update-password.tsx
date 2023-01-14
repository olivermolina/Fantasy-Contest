import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import LandingLayout from '~/components/LandingLayout';
import { trpc } from '~/utils/trpc';
import ChangeRouteLoadingContainer from '~/containers/ChangeRouteLoadingContainer/ChangeRouteLoadingContainer';
import BackdropLoading from '~/components/BackdropLoading';
import { TRPCClientError } from '@trpc/client';
import { FormErrorText } from '~/components/Form/FormErrorText';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/router';
import { green } from '@mui/material/colors';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';

const UpdatePasswordSchema = Yup.object().shape({
  password: Yup.string()
    .required('New Password is required')
    .notOneOf(
      [Yup.ref('oldPassword')],
      'New password should not be same as old password',
    ),
  confirmPassword: Yup.string()
    .required('Confirm Password is required')
    .oneOf(
      [Yup.ref('password')],
      'Password and Confirm Password must be match.',
    ),
});

export type UpdatePasswordInputs = {
  password: string;
  confirmPassword: string;
};

interface Tokens {
  refreshToken: string;
  accessToken: string;
}

const Update = () => {
  const [tokens, setTokens] = useState<Tokens | null>(null);
  const { asPath } = useRouter();
  const { data, error, isLoading, mutateAsync } =
    trpc.user.passwordResetTokenVerify.useMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdatePasswordInputs>({
    resolver: yupResolver(UpdatePasswordSchema),
  });
  const mutation = trpc.user.passwordUpdate.useMutation();
  const onSubmit: SubmitHandler<UpdatePasswordInputs> = async (data) => {
    try {
      await mutation.mutateAsync({
        ...data,
        refreshToken: tokens?.refreshToken || '',
      });
    } catch (error) {
      const e = error as TRPCClientError<any>;
      toast.error(e.shape?.message);
    }
  };

  const defaultClasses =
    'rounded-full text-2xl bg-gray-200 font-bold text-gray-500 p-4 w-full';
  const divClass =
    'max-w-4xl grid grid-cols-1 gap-4 p-8 w-full rounded-2xl bg-white text-black overflow-y-auto';

  useEffect(() => {
    const hash = (asPath as string).split('#')[1]; // error=unauthorized_client&error_code=401error_description=Something+went+wrong
    const parsedHash = new URLSearchParams(hash);
    const accessToken = parsedHash.get('access_token');
    const refreshToken = parsedHash.get('refresh_token');
    if (accessToken && refreshToken) {
      setTokens({ accessToken, refreshToken });
      mutateAsync({ accessTokenJwt: accessToken });
    }
  }, [asPath]);

  return (
    <LandingLayout>
      <ChangeRouteLoadingContainer />
      <BackdropLoading open={mutation.isLoading} />
      <div className="flex p-4 justify-center items-center">
        {!isLoading && (error || !data) ? (
          <div className={divClass}>
            <h2 className="font-bold mb-4 text-center text-4xl">
              Password Reset
            </h2>
            <p className="mb-4 text-center text-2xl">
              Sorry, your password reset link has expired or invalid.
            </p>
          </div>
        ) : null}
        {isLoading ? (
          <div className={divClass}>
            <h2 className="font-bold mb-4 text-center text-4xl">
              Verifying...
            </h2>
          </div>
        ) : null}
        {data && !mutation.data ? (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="max-w-4xl grid grid-cols-1 gap-4 p-8 w-full rounded-2xl bg-white text-black overflow-y-auto"
          >
            <h2 className="font-bold mb-4 text-center text-4xl">
              Choose a new password
            </h2>

            <input
              type="password"
              placeholder="Password"
              style={{
                maxHeight: 64,
              }}
              className={classNames(defaultClasses)}
              {...register('password')}
            />
            <FormErrorText>{errors.password?.message}</FormErrorText>
            <input
              type="password"
              placeholder="Confirm Password"
              style={{
                maxHeight: 64,
              }}
              className={classNames(defaultClasses)}
              {...register('confirmPassword')}
            />
            <FormErrorText>{errors.confirmPassword?.message}</FormErrorText>
            <button
              style={{
                maxHeight: 64,
              }}
              className="p-4 capitalize text-white rounded-full font-bold text-2xl bg-blue-600"
              type="submit"
            >
              Change Password
            </button>
          </form>
        ) : null}

        {!isLoading && mutation.data ? (
          <div className={divClass}>
            <div className="flex justify-center">
              <CheckCircleOutlinedIcon
                sx={{ color: green[500], fontSize: 100 }}
              />
            </div>

            <h2 className="font-bold mb-4 text-center text-4xl">
              Password Updated!
            </h2>

            <p className="mb-4 text-center text-2xl">
              Your password has been changed successfully. Use your new password
              to log in.
            </p>
          </div>
        ) : null}
      </div>
    </LandingLayout>
  );
};

export default Update;
