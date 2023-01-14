import React, { useMemo, useState } from 'react';
import { PaymentMethodInterface } from '~/components/Profile/AccountDeposit/DepositMethod/DepositMethod';
import {
  PayoutAmountForm,
  PayoutMethodForm,
} from '~/components/Profile/WithdrawFunds';
import { PayoutAmountInputs } from '~/components/Profile/WithdrawFunds/PayoutAmountForm';
import { AchInputs } from '~/components/Profile/AccountDeposit/PaymentMethodForm/ACHForm';
import { UrlPaths } from '~/constants/UrlPaths';
import { useRouter } from 'next/router';
import BackdropLoading from '~/components/BackdropLoading';
import { trpc } from '~/utils/trpc';
import {
  GeolocationPermissionStatus,
  getGeolocationPermissionStatus,
} from '~/utils/getGeolocationPermissionStatus';
import { TRPCClientError } from '@trpc/client';
import { toast } from 'react-toastify';
import { ActionType } from '~/constants/ActionType';
import { PaymentMethodType, Session, Transaction } from '@prisma/client';

import PayoutConfirmation from '~/components/Profile/WithdrawFunds/PayoutConfirmation';
import { useAppDispatch, useAppSelector } from '~/state/hooks';
import { setOpenLocationDialog } from '~/state/profile';
import { useDeviceGPS } from '~/hooks/useDeviceGPS';

interface Props {
  clientIp: string;
}

const ProfileWithdrawFundsContainer = (props: Props) => {
  const { clientIp } = props;
  const router = useRouter();
  const dispatch = useAppDispatch();
  const deviceGPS = useDeviceGPS();
  const userDetails = useAppSelector((state) => state.profile.userDetails);
  const [selectedPayoutMethod, setSelectedPayoutMethod] = useState<
    PaymentMethodInterface | undefined
  >();

  const [nextLoading, setNextLoading] = React.useState<boolean>(false);
  const [payoutAmount, setPayoutAmount] = useState(0);
  const [activeStep, setActiveStep] = React.useState<number>(0);
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<PaymentMethodInterface>();

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setNextLoading(false);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const onPaymentSelect = (
    newSelectedPaymentMethod: PaymentMethodInterface,
  ) => {
    setSelectedPaymentMethod(newSelectedPaymentMethod);
  };

  const {
    mutateAsync: mutateCreateMerchantTransactionData,
    data: createMerchantTransactionData,
    isLoading: createMerchantTransactionDataLoading,
  } = trpc.user.createMerchantTransaction.useMutation();

  const { mutateAsync: mutateAccountVerify, data: verifiedData } =
    trpc.user.accountVerify.useMutation();

  const {
    mutateAsync: mutateAccountSavePaymentMethod,
    isLoading: savedPaymentMethodLoading,
  } = trpc.user.accountSavePaymentMethod.useMutation();

  const {
    mutateAsync: mutateAccountPayout,
    data: accountPayoutData,
    isLoading: accountPayoutLoading,
  } = trpc.user.accountPayout.useMutation();

  const { data: userTotalBalance, refetch } =
    trpc.user.userTotalBalance.useQuery();

  const handleSavePaymentMethod = async (data: AchInputs, save: boolean) => {
    if (!createMerchantTransactionData) return;

    try {
      await mutateAccountSavePaymentMethod({
        fullName: data.fullName,
        billingAddress: {
          address1: data?.address1 || verifiedData?.address1,
          address2: data?.address2 || verifiedData?.address2,
          city: data?.city || verifiedData?.city,
          state: data?.state || verifiedData?.state,
          postalCode: data?.postalCode || verifiedData?.postalCode,
          countyCode: 'US',
        },
        paymentMethod: {
          type: PaymentMethodType.ACH,
          ach: {
            accountNumber: data.accountNumber.toString().replaceAll(/\s/g, ''),
            routingNumber: data.routingNumber.toString().replaceAll(/\s/g, ''),
          },
        },
        session: createMerchantTransactionData.session,
        save,
      });

      await onMutateCreateMerchantTransactionData(payoutAmount);
    } catch (error) {
      const e = error as TRPCClientError<any>;
      toast.error(e?.message);
      return;
    }
  };

  const onMutateCreateMerchantTransactionData = async (
    payoutAmount: number,
  ) => {
    if (!deviceGPS) {
      toast.error('Invalid location!');
      return { session: null };
    }

    const response = await mutateCreateMerchantTransactionData({
      ipAddress: clientIp,
      amountProcess: payoutAmount,
      amountBonus: 0,
      deviceGPS,
      serviceType: ActionType.PAYOUT,
    });

    await refetch();

    return response as { session: Session; transaction: Transaction };
  };

  const handleSubmitPayoutAmount = async (data: PayoutAmountInputs) => {
    setNextLoading(true);
    setPayoutAmount(data.payoutAmount);

    const permissionStatus = await getGeolocationPermissionStatus();
    if (permissionStatus !== GeolocationPermissionStatus.GRANTED) {
      dispatch(setOpenLocationDialog(true));
      setNextLoading(false);
      return;
    }

    if (data.payoutAmount > Number(userTotalBalance?.withdrawableAmount)) {
      toast.error(
        `Whoops.. looks like you haven’t played with "$${data.payoutAmount}" amount yet. 
        Please place "$${data.payoutAmount}" amount on a contest entry to be able to withdraw. 
        Otherwise email support@lockspread.com and your refund request will be reviewed`,
      );
      setNextLoading(false);
      return;
    }

    if (!deviceGPS) {
      toast.error('Invalid location!');
      return;
    }

    const { session } = await onMutateCreateMerchantTransactionData(
      data.payoutAmount,
    );

    if (!session) {
      toast.error('Invalid session!');
      return;
    }

    try {
      await mutateAccountVerify({
        session,
        deviceGPS,
        ipAddress: clientIp,
      });

      setSelectedPaymentMethod(undefined);
      handleNext();
    } catch (error) {
      const e = error as TRPCClientError<any>;
      toast.error(e?.message);
    }
    setNextLoading(false);
  };

  const handleCancel = async () => {
    setNextLoading(true);
    await router.push(UrlPaths.Challenge);
  };

  const steps = useMemo(
    () => [
      {
        key: 'payout-amount-form',
        content: (
          <PayoutAmountForm
            selectedPayoutMethod={selectedPayoutMethod}
            setSelectedPayoutMethod={setSelectedPayoutMethod}
            onSubmit={handleSubmitPayoutAmount}
            payoutAmount={payoutAmount}
            userTotalBalance={userTotalBalance}
          />
        ),
      },
      {
        key: 'payout-method-form',
        content: (
          <PayoutMethodForm
            selectedPayoutMethod={selectedPayoutMethod}
            payoutAmount={payoutAmount}
            handleBack={handleBack}
            handleCancel={handleCancel}
            verifiedData={verifiedData}
            savedPaymentMethods={
              createMerchantTransactionData?.gidxSession.PaymentMethods
            }
            selectedPaymentMethod={selectedPaymentMethod}
            onPaymentSelect={onPaymentSelect}
            handleSavePaymentMethod={handleSavePaymentMethod}
            isLoading={
              savedPaymentMethodLoading || createMerchantTransactionDataLoading
            }
            user={userDetails}
          />
        ),
      },
      {
        key: 'payout-confirmation',
        content: (
          <PayoutConfirmation
            payoutAmount={payoutAmount}
            transaction={accountPayoutData}
          />
        ),
      },
    ],
    [
      selectedPayoutMethod,
      payoutAmount,
      verifiedData,
      createMerchantTransactionData,
      selectedPaymentMethod,
      accountPayoutData,
      savedPaymentMethodLoading,
      createMerchantTransactionDataLoading,
      userTotalBalance,
    ],
  );

  const maxSteps = steps.length;

  const handleSubmitPayoutMethod = async () => {
    if (activeStep === 0) return;

    if (activeStep === maxSteps - 1) {
      await router.push(UrlPaths.Challenge);
      return;
    }

    if (
      selectedPayoutMethod?.type === PaymentMethodType.ACH &&
      !selectedPaymentMethod
    )
      return;

    if (!createMerchantTransactionData) return;

    try {
      const billingAddress =
        selectedPaymentMethod?.savedPaymentMethod?.BillingAddress;
      const result = await mutateAccountPayout({
        fullName:
          selectedPaymentMethod?.savedPaymentMethod?.NameOnAccount ||
          `${verifiedData?.firstname} ${verifiedData?.lastname}`,
        payoutAmount,
        paymentMethod: {
          type: selectedPayoutMethod?.type,
          ...(selectedPayoutMethod?.type === PaymentMethodType.ACH && {
            ach: {
              token: selectedPaymentMethod?.savedPaymentMethod?.Token,
              routingNumber:
                selectedPaymentMethod?.savedPaymentMethod?.RoutingNumber,
              accountNumber:
                selectedPaymentMethod?.savedPaymentMethod?.AccountNumber,
            },
          }),
          ...(selectedPayoutMethod?.type === PaymentMethodType.Paypal && {
            paypal: {
              email: userDetails?.email,
              // email: 'sb-es1qt22006179@personal.example.com',
            },
          }),
        },
        billingAddress: {
          address1: billingAddress?.AddressLine1 || verifiedData?.address1,
          address2: billingAddress?.AddressLine2 || verifiedData?.address2,
          city: billingAddress?.City || verifiedData?.city,
          state: billingAddress?.StateCode || verifiedData?.state,
          postalCode: billingAddress?.PostalCode || verifiedData?.postalCode,
          countyCode: 'US',
        },
        session: createMerchantTransactionData?.session,
        transaction: createMerchantTransactionData?.transaction,
      });
      if (result.status === 'Failed') {
        toast.error('Withdrawal Request Failed');
      } else {
        toast.success('Withdrawal Request Submitted');
      }
      handleNext();
      await refetch();
    } catch (error) {
      const e = error as TRPCClientError<any>;
      toast.error(e?.message);
    }
  };

  return (
    <div className="flex flex-col w-full h-full gap-4 lg:p-4">
      <BackdropLoading
        open={
          nextLoading ||
          savedPaymentMethodLoading ||
          accountPayoutLoading ||
          createMerchantTransactionDataLoading
        }
      />
      <div className="flex flex-col shadow-md rounded-md divide-y gap-2 bg-white w-full">
        <div className="flex flex-col p-6 gap-4">
          <p className="font-bold text-xl">Withdraw Funds</p>
          {steps[activeStep]?.content}
        </div>
        {activeStep < 2 && (
          <div className="flex flex-col p-6 gap-2">
            <button
              className="p-4 capitalize text-white rounded font-bold w-auto h-auto bg-blue-600 disabled:opacity-50"
              type="submit"
              form="deposit-method-form"
              disabled={
                (activeStep === 0 && !selectedPayoutMethod) ||
                (activeStep === 1 &&
                  !selectedPaymentMethod &&
                  selectedPayoutMethod?.type === PaymentMethodType.ACH)
              }
              onClick={handleSubmitPayoutMethod}
            >
              {activeStep === 0 ? 'Next' : null}
              {activeStep === 1 ? 'Withdraw' : null}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileWithdrawFundsContainer;
