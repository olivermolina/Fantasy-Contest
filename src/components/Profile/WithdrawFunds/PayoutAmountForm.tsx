import React, { Dispatch, SetStateAction, useEffect } from 'react';
import classNames from 'classnames';
import { FormErrorText } from '~/components/Form/FormErrorText';
import { PaymentMethodType } from '@prisma/client';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { PaymentMethodInterface } from '~/components/Profile/AccountDeposit/DepositMethod/DepositMethod';
import * as Yup from 'yup';
import { ReactComponent } from '~/components/Icons/Icons';
import { showDollarPrefix } from '~/utils/showDollarPrefix';
import { UserTotalBalanceInterface } from '~/server/routers/user/userTotalBalance/getUserTotalBalance';
import paypal from '~/assets/icons/paypal.svg';
import bank from '~/assets/icons/bank.svg';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const PAYOUT_METHODS = [
  {
    key: PaymentMethodType.ACH,
    image: bank,
    type: PaymentMethodType.ACH,
    label: 'Bank Transfer',
  },
  {
    key: PaymentMethodType.Paypal,
    image: paypal,
    type: PaymentMethodType.Paypal,
    label: 'Paypal',
  },
];

export type PayoutAmountInputs = {
  payoutAmount: number;
};

const styles = {
  defaultClasses:
    'block pl-11 pr-2 appearance-none font-bold text-lg w-full h-full rounded-md bg-primary focus:outline-[#2F5F98]',
  errorClasses: 'border-2 border-red-500 focus:outline-red-500',
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
    <>
      <p className="text-xs lg:text-sm">
        Enter payout amount and select payout method to withdraw.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} id={'deposit-method-form'}>
        <div className="flex flex-row gap-6 w-full justify-between items-center">
          <div className={'flex flex-col justify-between w-1/2 md:w-3/4'}>
            <div className="flex flex-col gap-2">
              <div
                className={classNames(
                  'relative border border-[#2F5F98] rounded-md bg-[#2F5F98] ml-50 h-[62px]',
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
              <p className="text-sm text-lightText">
                Amount available to withdraw:{' '}
                <span className="font-bold text-white">
                  {showDollarPrefix(
                    props.userTotalBalance?.withdrawableAmount || 0,
                    true,
                  )}
                </span>
              </p>
            </div>
          </div>
          <div
            className={
              'border-2 min-w-fit h-full items-center justify-center w-1/2 md:w-1/4 border-green-700'
            }
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
              <div
                className={'flex flex-col divide-y-2 w-full divide-green-700'}
              >
                <span
                  className={'text-center p-1 bg-teal-600 text-sm font-bold'}
                >
                  $
                  {Number(props.userTotalBalance?.totalCashAmount || 0).toFixed(
                    2,
                  )}
                </span>
                <span className={'text-center p-1 text-sm'}>CASH BAL</span>
              </div>
              <div
                className={'flex flex-col divide-y-2 w-full divide-green-700'}
              >
                <span
                  className={'text-center p-1 bg-yellow-600 text-sm font-bold'}
                >
                  $
                  {Number(props.userTotalBalance?.creditAmount || 0).toFixed(2)}
                </span>

                <span className={'text-center p-1 text-sm'}>BONUS BAL</span>
              </div>
            </div>
          </div>
        </div>
        <div className={'flex flex-col gap-5 mt-5 h-full'}>
          <p className="font-bold text-md">Select Payout Method</p>
          <div className={'flex flex-wrap gap-2'}>
            {PAYOUT_METHODS.map((payoutMethod) => {
              const Image = payoutMethod.image as ReactComponent;

              return (
                <div
                  key={payoutMethod.key}
                  onClick={() => handleClick(payoutMethod)}
                  className={classNames(
                    `flex items-center justify-center shadow-md rounded-lg cursor-pointer bg-[#1A487F] transform transition duration-500 w-[150px] h-[100px]`,
                    {
                      'bg-[#fff] text-primary':
                        props.selectedPayoutMethod?.key === payoutMethod?.key,
                    },
                  )}
                >
                  <div
                    className={classNames({
                      'hidden top-2 left-2':
                        props.selectedPayoutMethod?.key !== payoutMethod?.key,
                      'absolute block top-2 left-2 ':
                        props.selectedPayoutMethod?.key === payoutMethod?.key,
                    })}
                  >
                    <CheckCircleIcon />
                  </div>

                  <div
                    className={
                      'flex flex-col justify-between items-center font-semibold gap-2 p-2'
                    }
                  >
                    <Image
                      className={classNames('h-8', {
                        'fill-white':
                          props.selectedPayoutMethod?.key !== payoutMethod?.key,
                        'fill-primary':
                          props.selectedPayoutMethod?.key === payoutMethod?.key,
                      })}
                    />
                    <span>{payoutMethod.label}</span>
                  </div>
                </div>
              );
            })}
          </div>
          {props.selectedPayoutMethod?.key === PaymentMethodType.ACH ? (
            <p className="text-sm">
              Processing time:{' '}
              <span className="font-bold">1-2 Business Days</span>
            </p>
          ) : null}
        </div>
      </form>
    </>
  );
};

export default PayoutAmountForm;
