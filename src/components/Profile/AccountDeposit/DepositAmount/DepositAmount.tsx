import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormErrorText } from '~/components/Form/FormErrorText';
import classNames from 'classnames';

type Inputs = {
  depositAmount: number;
};

const InputValidationSchema = Yup.object().shape({
  depositAmount: Yup.number()
    .typeError('Please provide deposit amount')
    .min(10, 'Minimum deposit is $10'),
});

const styles = {
  defaultClasses:
    'block pl-11 pr-2 appearance-none font-bold text-lg w-full h-full rounded-md bg-white focus:outline-gray-200',
  errorClasses: 'border-2 border-red-500 focus:outline-red-500',
  selectedDeposit: 'border-4 border-blue-300',
  defaultDepositButton:
    'transform transition duration-500 hover:scale-110 hover:border-4 hover:border-blue-300  border border-gray-200 rounded-md shadow w-auto py-2 min-h-[75px]',
  bonusDepositButton: 'min-h-[105px]',
};

interface DepositInputAmountProps {
  setDepositAmount: Dispatch<SetStateAction<number>>;
  handleNext: () => void;
  isFirstDeposit: boolean | undefined;
  depositAmount: number;
  maxMatchDeposit: number;
}

const DepositInputAmount = (props: DepositInputAmountProps) => {
  const {
    setDepositAmount,
    handleNext,
    isFirstDeposit,
    depositAmount,
    maxMatchDeposit,
  } = props;

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    trigger,
    reset,
  } = useForm<Inputs>({
    resolver: yupResolver(InputValidationSchema),
  });

  const [selected, setSelected] = useState<number | null>(null);

  const handleSelect = async (
    amount: number,
    index: SetStateAction<number | null>,
  ) => {
    setDepositAmount?.(amount);
    setSelected(index);
    setValue('depositAmount', amount);
    await trigger('depositAmount');
  };

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setDepositAmount?.(Number(data.depositAmount));
    handleNext?.();
  };

  useEffect(() => {
    if (depositAmount) {
      reset({ depositAmount });
    }
  }, [depositAmount]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col shadow-md rounded-md divide-y gap-2 bg-white w-full">
        <div className="flex flex-col p-6 gap-2">
          <p className="font-bold text-lg">Account Deposit</p>
          <p className="text-sm">
            Select your deposit amount from the amounts shown below. or enter
            your own amount and click the &quot;Deposit&quot;.
          </p>
          <div className="flex flex-col gap-5 w-full mt-5 justify-center">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-5 lg:gap-x-10 xl:gap-x-20 justify-items-stretch">
              {[10, 25, 50, 75, 100, 125].map((amount, index) => (
                <button
                  key={amount}
                  className={classNames(
                    styles.defaultDepositButton,
                    selected === index ? styles.selectedDeposit : '',
                    isFirstDeposit ? styles.bonusDepositButton : '',
                  )}
                  onClick={(e) => {
                    e.preventDefault();
                    handleSelect(amount, index);
                  }}
                >
                  <p className="font-bold text-2xl"> ${amount}</p>
                  {isFirstDeposit && (
                    <div className={'text-sm text-green-700 pt-2'}>
                      <p>
                        +$
                        {amount > maxMatchDeposit ? maxMatchDeposit : amount}
                      </p>
                      <p>INSTANT Bonus</p>
                    </div>
                  )}
                </button>
              ))}
            </div>
            <p className={'text-center  font-bold'}>OR</p>
            <div className="relative border border-gray-200 rounded-md bg-gray-200 ml-50 h-[62px]">
              <div
                className={classNames(
                  'flex absolute inset-y-0 left-0 items-center pointer-events-none bg-inherit p-2 rounded-l-md',
                  errors?.depositAmount
                    ? 'border-2 border-red-500 focus:outline-red-500'
                    : '',
                )}
              >
                <span className="font-bold text-lg">$</span>
              </div>
              <input
                type="number"
                placeholder="Enter custom amount"
                className={classNames(
                  styles.defaultClasses,
                  errors?.depositAmount ? styles.errorClasses : '',
                )}
                defaultValue={''}
                {...register('depositAmount', {
                  onChange: (e) => {
                    setSelected(null);
                    setDepositAmount?.(Number(e.target.value));
                  },
                })}
              />
              <FormErrorText>{errors.depositAmount?.message}</FormErrorText>
            </div>
          </div>
        </div>
        <div className="flex flex-col p-6 gap-2">
          <button
            className="p-4 capitalize text-white rounded font-bold w-auto h-auto bg-blue-600 disabled:opacity-50"
            type="submit"
            disabled={!isValid}
          >
            Deposit
          </button>
          <p className="text-sm">
            Next: Select your deposit Method and save it to your secure wallet
            for future transactions.
          </p>
        </div>
      </div>
    </form>
  );
};

export default DepositInputAmount;
