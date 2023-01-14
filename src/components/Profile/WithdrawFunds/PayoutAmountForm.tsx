import React, { Dispatch, SetStateAction, useEffect } from 'react';
import classNames from 'classnames';
import { FormErrorText } from '~/components/Form/FormErrorText';
import { Grid, Stack } from '@mui/material';
import { PaymentMethodType } from '@prisma/client';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { PaymentMethodInterface } from '~/components/Profile/AccountDeposit/DepositMethod/DepositMethod';
import * as Yup from 'yup';
import Icons from '~/components/Icons/Icons';
import { showDollarPrefix } from '~/utils/showDollarPrefix';
import { UserTotalBalanceInterface } from '~/server/routers/user/userTotalBalance/getUserTotalBalance';

const PAYOUT_METHODS = [
  {
    key: PaymentMethodType.ACH,
    image: <Icons.Bank className={'h-8'} />,
    type: PaymentMethodType.ACH,
    label: 'Bank Transfer',
  },
  {
    key: PaymentMethodType.Paypal,
    image: <Icons.Paypal className={'h-8'} />,
    type: PaymentMethodType.Paypal,
    label: 'Paypal',
  },
];

export type PayoutAmountInputs = {
  payoutAmount: number;
};

const styles = {
  defaultClasses:
    'block pl-11 pr-2 appearance-none font-bold text-lg w-full h-full rounded-md bg-white focus:outline-gray-200',
  errorClasses: 'border-2 border-red-500 focus:outline-red-500',
  selectedDeposit: 'border-4 border-blue-300',
  defaultDepositButton:
    'transform transition duration-500 hover:scale-110 hover:border-4 hover:border-blue-300  border border-gray-200 rounded-md shadow w-auto py-2 min-h-[75px]',
  bonusDepositButton: 'min-h-[105px]',
};

interface Props {
  payoutAmount: number;
  onSubmit: (data: PayoutAmountInputs) => void;
  setSelectedPayoutMethod: Dispatch<
    SetStateAction<PaymentMethodInterface | undefined>
  >;
  selectedPayoutMethod?: PaymentMethodInterface;
  userTotalBalance?: UserTotalBalanceInterface;
}

const PayoutAmountForm = (props: Props) => {
  const minimumPayout = 10;
  const maximumPayout =
    Number(props.userTotalBalance?.withdrawableAmount) > minimumPayout
      ? props.userTotalBalance?.withdrawableAmount || minimumPayout
      : minimumPayout;
  const InputValidationSchema = Yup.object().shape({
    payoutAmount: Yup.number()
      .typeError('Please provide payout amount')
      .min(minimumPayout, `Minimum payout amount is ${minimumPayout}`)
      .max(maximumPayout, `Maximum payout amount is ${maximumPayout}`),
  });
  const { payoutAmount } = props;
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PayoutAmountInputs>({
    resolver: yupResolver(InputValidationSchema),
    shouldUnregister: false,
    reValidateMode: 'onChange',
    defaultValues: { payoutAmount },
  });
  const handleClick = (selected: PaymentMethodInterface) => {
    props.setSelectedPayoutMethod(selected);
  };

  const onSubmit: SubmitHandler<PayoutAmountInputs> = async (data) => {
    props.onSubmit(data);
  };

  useEffect(() => {
    if (payoutAmount) {
      reset({ payoutAmount });
    }
  }, [payoutAmount]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} id={'deposit-method-form'}>
      <div className="flex flex-row gap-6 w-full justify-between items-center">
        <div className={'flex flex-col justify-between w-1/2 md:w-3/4'}>
          <div className="flex flex-col gap-2">
            <p className="text-sm">
              Enter payout amount and select payout method to withdraw.
            </p>
            <div
              className={classNames(
                'relative border border-gray-200 rounded-md bg-gray-200 ml-50 h-[62px]',
                errors?.payoutAmount ? 'mb-4' : '',
              )}
            >
              <div
                className={classNames(
                  'flex absolute inset-y-0 left-0 items-center pointer-events-none bg-inherit p-2 rounded-l-md',
                  errors?.payoutAmount
                    ? 'border-2 border-red-500 focus:outline-red-500'
                    : '',
                )}
              >
                <span className="font-bold text-lg">$</span>
              </div>
              <input
                type="number"
                placeholder="Enter amount"
                className={classNames(
                  styles.defaultClasses,
                  errors?.payoutAmount ? styles.errorClasses : '',
                )}
                defaultValue={''}
                step="0.01"
                {...register('payoutAmount')}
              />
              <FormErrorText>{errors.payoutAmount?.message}</FormErrorText>
            </div>
            <p className="text-sm">
              Amount available to withdraw:{' '}
              <span className="font-bold">
                {showDollarPrefix(
                  props.userTotalBalance?.withdrawableAmount || 0,
                  true,
                )}
              </span>
            </p>
          </div>
        </div>
        <Stack
          className={
            'border-2 min-w-fit h-full items-center justify-center w-1/2 md:w-1/4 border-green-700'
          }
          direction="column"
          justifyContent="center"
          alignItems="center"
        >
          <div className={'flex justify-center border-b w-full'}>
            <span className={'text-md p-1 font-bold'}>TOTAL BALANCE</span>
          </div>
          <div
            className={
              'flex justify-center font-bold w-full border-b-2 border-green-700 text-3xl p-2 bg-blue-500 text-white'
            }
          >
            <span>
              ${Number(props.userTotalBalance?.totalAmount).toFixed(2)}
            </span>
          </div>
          <div
            className={
              'flex flex-row justify-evenly divide-x-2 w-full divide-green-700'
            }
          >
            <div className={'flex flex-col divide-y-2 w-full divide-green-700'}>
              <span className={'text-center p-1 bg-teal-600 text-sm font-bold'}>
                $
                {Number(props.userTotalBalance?.totalCashAmount || 0).toFixed(
                  2,
                )}
              </span>
              <span className={'text-center p-1 text-sm'}>CASH BAL</span>
            </div>
            <div className={'flex flex-col divide-y-2 w-full divide-green-700'}>
              <span
                className={'text-center p-1 bg-yellow-600 text-sm font-bold'}
              >
                ${Number(props.userTotalBalance?.creditAmount || 0).toFixed(2)}
              </span>

              <span className={'text-center p-1 text-sm'}>BONUS BAL</span>
            </div>
          </div>
        </Stack>
      </div>
      <div className={'flex flex-col gap-5 mt-5'}>
        <p className="font-bold text-md">Select Payout Method</p>
        <Grid
          container
          direction="row"
          justifyContent={{ xs: 'space-evenly', md: 'flex-start' }}
          spacing={4}
        >
          {PAYOUT_METHODS.map((payoutMethod) => (
            <Grid
              item
              key={payoutMethod.key}
              onClick={() => handleClick(payoutMethod)}
            >
              <Stack
                justifyContent="center"
                alignItems="center"
                spacing={1}
                className={classNames(
                  `shadow-md rounded-lg cursor-pointer transform transition duration-500 hover:scale-y-100 hover:border-4 hover:border-blue-300 w-[150px] h-[95px] p-2`,
                  {
                    'border-4 border-blue-300':
                      props.selectedPayoutMethod?.key === payoutMethod?.key,
                  },
                )}
              >
                {payoutMethod.image}
                <span>{payoutMethod.label}</span>
              </Stack>
            </Grid>
          ))}
        </Grid>
        {props.selectedPayoutMethod?.key === PaymentMethodType.ACH ? (
          <p className="text-sm">
            Processing time:{' '}
            <span className="font-bold">1-2 Business Days</span>
          </p>
        ) : null}
      </div>
    </form>
  );
};

export default PayoutAmountForm;
