import React, { ChangeEvent, useEffect, useState } from 'react';
import { FormErrorText } from '~/components/Form/FormErrorText';
import useDebounce from '~/hooks/useDebounce';
import { UseFormClearErrors } from 'react-hook-form';
import { SignupInputs } from '~/pages/auth/sign-up';

interface ReferralModalInterface {
  setReferralCode: (referralCode: string) => void;
  checkReferralCode: (referralCode: string) => void;
  errorMessage?: string;
  clearErrors: UseFormClearErrors<SignupInputs>;
  watchReferralCode: string;
}

const ReferralModal = ({
  setReferralCode,
  checkReferralCode,
  errorMessage,
  watchReferralCode,
  clearErrors,
}: ReferralModalInterface) => {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = useState('');

  const handleClose = () => {
    clearErrors('referralCode');
    setOpen(false);
  };

  const handleApply = () => {
    setReferralCode(value);
    handleClose();
  };

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const debouncedValue = useDebounce<string>(value, 200);

  useEffect(() => {
    // Triggers when "debouncedValue" changes
    checkReferralCode(debouncedValue);
  }, [debouncedValue]);

  return (
    <>
      <span
        className={
          'flex justify-center cursor-pointer col-span-1 lg:col-span-2'
        }
        onClick={() => setOpen(true)}
      >
        {watchReferralCode
          ? `Referral code "${watchReferralCode}" applied`
          : 'Got a referral code?'}
      </span>

      {open && (
        <div
          className="relative z-10"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 overflow-y-auto min-w-full">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="flex flex-col">
                    <button
                      className={'absolute right-2 top-2'}
                      onClick={handleClose}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <h2 className="font-bold col-span-1 lg:col-span-2 mb-4 text-center text-4xl">
                        Enter Below
                      </h2>
                      <div className="mt-2">
                        <input
                          placeholder="Enter Referral Code"
                          id="referralCode"
                          required
                          style={{
                            maxHeight: 64,
                          }}
                          className={
                            'rounded-full text-2xl bg-gray-200 font-bold text-gray-500 p-4 w-full'
                          }
                          onChange={handleOnChange}
                        />
                      </div>
                      <FormErrorText>{errorMessage}</FormErrorText>
                    </div>

                    {!errorMessage && value && (
                      <button
                        type="button"
                        className="inline-flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                        onClick={handleApply}
                      >
                        Apply
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ReferralModal;
