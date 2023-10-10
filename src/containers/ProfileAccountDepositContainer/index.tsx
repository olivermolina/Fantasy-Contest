import React, { useMemo, useState } from 'react';
import visa from '~/assets/visa-dark.svg';
import mastercard from '~/assets/mastercard.svg';
import amex from '~/assets/amex.svg';
import discover from '~/assets/discover.svg';
// import paypal from '~/assets/paypal.svg';
import ach from '~/assets/ach.svg';
import { CardTypes } from '~/constants/CardTypes';
import {
  DepositAmount,
  DepositConfirmation,
  DepositMethod,
} from '~/components/Profile/AccountDeposit';
import { PaymentMethodInterface } from '~/components/Profile/AccountDeposit/DepositMethod/DepositMethod';
import {
  BillingAddressInterface,
  GIDXPaymentMethod,
  GidxPaymentMethodInterface,
  UserDetailsInput,
} from '~/lib/tsevo-gidx/GIDX';
import { trpc } from '~/utils/trpc';
import GetVerifiedDialog from '~/components/Profile/GetVerifiedDialog';
import {
  GeolocationPermissionStatus,
  getGeolocationPermissionStatus,
} from '~/utils/getGeolocationPermissionStatus';
import { toast } from 'react-toastify';
import DepositDeclineDialog from '~/components/Profile/AccountDeposit/DepositDeclineDialog';
import { TRPCClientError } from '@trpc/client';
import { useRouter } from 'next/router';
import { UrlPaths } from '~/constants/UrlPaths';
import { useAppDispatch, useAppSelector } from '~/state/hooks';
import {
  AppSettingName,
  PaymentMethodType,
  Session,
  Transaction,
} from '@prisma/client';
import SessionExpiredDialog from '~/components/Profile/AccountDeposit/SessionExpiredDialog';
import BackdropLoading from '~/components/BackdropLoading';
import { ActionType } from '~/constants/ActionType';
import { AccountDepositResponseInterface } from '~/server/routers/user/accountDeposit';
import { setOpenLocationDialog } from '~/state/profile';
import { useDeviceGPS } from '~/hooks/useDeviceGPS';
import { ReloadBonusType } from '~/constants/ReloadBonusType';
import { calculateReloadBonusAmount } from '~/utils/calculateReloadBonusAmount';
import AchProcessingInfoDialog from '~/components/Profile/AccountDeposit/AchProcessingInfoDialog';

export const PAYMENT_METHODS = [
  {
    key: CardTypes.visa,
    image: visa,
    object: 'object-cover',
    type: PaymentMethodType.CC,
  },
  {
    key: CardTypes.mastercard,
    image: mastercard,
    object: 'object-cover',
    type: PaymentMethodType.CC,
  },
  {
    key: CardTypes.amex,
    image: amex,
    object: 'object-cover',
    type: PaymentMethodType.CC,
  },
  {
    key: CardTypes.discover,
    image: discover,
    object: 'object-cover',
    type: PaymentMethodType.CC,
  },
  // {
  //   key: 'paypal',
  //   image: paypal,
  //   object: 'object-cover',
  //   type: PaymentMethodType.Paypal,
  // },
  {
    key: 'ach',
    image: ach,
    object: 'object-fit',
    type: PaymentMethodType.ACH,
  },
];

interface AccountDepositContainerProps {
  clientIp: string;
}

export interface PaymentFormDataInterface {
  fullName: string;
  billingAddress: BillingAddressInterface;
  paymentMethod: GidxPaymentMethodInterface;
}

const AccountDepositContainer = ({
  clientIp,
}: AccountDepositContainerProps) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [nextLoading, setNextLoading] = React.useState<boolean>(false);
  const [activeStep, setActiveStep] = React.useState<number>(0);
  const [depositAmount, setDepositAmount] = useState<number>(0);
  const [openSessionExpiredDialog, setOpenSessionExpiredDialog] =
    React.useState<boolean>(false);
  const [openDeclineDialog, setOpenDeclineDialog] =
    React.useState<boolean>(false);
  const [achDialogOpen, setAchDialogOpen] = React.useState<boolean>(false);
  const handleAchDialogClose = () => setAchDialogOpen(false);

  const [openVerifyDialog, setOpenVerifyDialog] =
    React.useState<boolean>(false);
  const deviceGPS = useDeviceGPS();

  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<PaymentMethodInterface>();
  const [transaction, setTransaction] =
    useState<AccountDepositResponseInterface>();

  const { userDetails, appSettings } = useAppSelector((state) => state.profile);
  const isFirstDeposit = userDetails?.isFirstDeposit;

  const { mutateAsync: mutateAccountVerify, data: verifiedData } =
    trpc.user.accountVerify.useMutation();

  const { mutateAsync: mutateAccountDeposit, isLoading } =
    trpc.user.accountDeposit.useMutation();

  const {
    mutateAsync: mutateCreateMerchantTransactionData,
    data: createMerchantTransactionData,
    isLoading: createMerchantTransactionDataLoading,
  } = trpc.user.createMerchantTransaction.useMutation();

  const {
    mutateAsync: mutateAccountRegister,
    isLoading: mutateAccountRegisterLoading,
    error: registerError,
  } = trpc.user.accountRegister.useMutation();

  const {
    mutateAsync: mutateAccountSavePaymentMethod,
    isLoading: savedPaymentMethodLoading,
  } = trpc.user.accountSavePaymentMethod.useMutation();

  const maxMatchDeposit = Number(
    appSettings?.find(
      (appSetting) =>
        appSetting.name === AppSettingName.MAX_MATCH_DEPOSIT_AMOUNT,
    )?.value || 0,
  );

  const minDepositAmount = Number(
    appSettings?.find(
      (appSetting) => appSetting.name === AppSettingName.MIN_DEPOSIT_AMOUNT,
    )?.value || 0,
  );

  const reloadBonusAmount = Number(
    appSettings?.find(
      (appSetting) => appSetting.name === AppSettingName.RELOAD_BONUS_AMOUNT,
    )?.value || 0,
  );

  const reloadBonusType =
    appSettings?.find(
      (appSetting) => appSetting.name === AppSettingName.RELOAD_BONUS_TYPE,
    )?.value || ReloadBonusType.FLAT;
  const handleSubmitDeposit = async (data?: PaymentFormDataInterface) => {
    if (!selectedPaymentMethod || !data) return;

    if (
      !createMerchantTransactionData?.session ||
      !createMerchantTransactionData?.transaction
    ) {
      toast.error('Invalid session! Please refresh the page.');
      return;
    }

    try {
      // First deposit match bonus
      const creditAmount =
        depositAmount <= maxMatchDeposit ? depositAmount : maxMatchDeposit;
      // Reload bonus
      const reloadCreditAmount = calculateReloadBonusAmount(
        depositAmount,
        reloadBonusAmount,
        reloadBonusType,
      );

      return await mutateAccountDeposit({
        ...data,
        amountProcess: depositAmount,
        amountBonus: isFirstDeposit ? creditAmount : reloadCreditAmount,
        session: createMerchantTransactionData?.session,
        transaction: createMerchantTransactionData?.transaction,
      });
    } catch (error) {
      const e = error as TRPCClientError<any>;
      toast.error(e?.message);
    }
  };

  const handleSubmitRegisterUser = async (userDetails: UserDetailsInput) => {
    if (!createMerchantTransactionData) return;
    if (!deviceGPS) {
      toast.error('Invalid location!');
      return;
    }
    try {
      await mutateAccountRegister({
        userDetails,
        session: createMerchantTransactionData?.session,
        deviceGPS,
        ipAddress: clientIp,
      });
      setOpenVerifyDialog(false);
      const verifyResult = await handleAccountVerify();
      if (verifyResult) {
        handleNext();
      }
    } catch (error) {
      const e = error as TRPCClientError<any>;
      toast.error(e?.message);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleCreateMerchantTransactionData = async () => {
    if (!deviceGPS) {
      toast.error('Invalid location!');
      return;
    }
    try {
      // First deposit match bonus
      const creditAmount =
        depositAmount <= maxMatchDeposit ? depositAmount : maxMatchDeposit;
      // Reload bonus
      const reloadCreditAmount = calculateReloadBonusAmount(
        depositAmount,
        reloadBonusAmount,
        reloadBonusType,
      );
      const response = await mutateCreateMerchantTransactionData({
        ipAddress: clientIp,
        amountProcess: depositAmount,
        amountBonus: isFirstDeposit ? creditAmount : reloadCreditAmount,
        deviceGPS,
        serviceType: ActionType.PAY,
      });
      return response as { session: Session; transaction: Transaction };
    } catch (error) {
      const e = error as TRPCClientError<any>;
      toast.error(e?.message);
    }
  };

  const handleAccountVerify = async () => {
    const response = await handleCreateMerchantTransactionData();
    if (!response) {
      toast.error('Invalid session! Please refresh the page.');
      return false;
    }
    if (!deviceGPS) {
      toast.error('Invalid location!');
      return;
    }
    try {
      return await mutateAccountVerify({
        session: response?.session,
        deviceGPS,
        ipAddress: clientIp,
      });
    } catch (error) {
      const e = error as TRPCClientError<any>;
      toast.error(e?.message);
      setOpenVerifyDialog(e?.data.code !== 'FORBIDDEN');
    }
  };

  const onPaymentSelect = (
    newSelectedPaymentMethod?: PaymentMethodInterface,
  ) => {
    setSelectedPaymentMethod(newSelectedPaymentMethod);
    if (newSelectedPaymentMethod?.type === PaymentMethodType.ACH) {
      setAchDialogOpen(true);
    }
  };

  const handleCancel = async () => {
    setNextLoading(true);
    await router.push(UrlPaths.Challenge);
    setNextLoading(false);
  };

  const handleNextDepositAmount = async () => {
    setNextLoading(true);
    const permissionStatus = await getGeolocationPermissionStatus();
    if (permissionStatus !== GeolocationPermissionStatus.GRANTED) {
      dispatch(setOpenLocationDialog(true));
      setNextLoading(false);
      return;
    }

    if (depositAmount === 0) {
      setNextLoading(false);
      return;
    }

    const verifyResult = await handleAccountVerify();
    if (!verifyResult) {
      setNextLoading(false);
      return;
    }
    handleNext();
  };

  const handleNextSubmitDeposit = async (data?: PaymentFormDataInterface) => {
    setNextLoading(true);
    if (data) {
      if (transaction) {
        setOpenSessionExpiredDialog(true);
        setNextLoading(false);
        return;
      }

      const newTransaction = await handleSubmitDeposit(data);
      if (!newTransaction) {
        return;
      }

      setTransaction(newTransaction);
      if (newTransaction && newTransaction.status === 'Failed') {
        setOpenDeclineDialog(true);
        setNextLoading(false);
        return;
      }
      handleNext();
    }
    setNextLoading(false);
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setNextLoading(false);
  };

  const handlePaypalNext = async (data: PaymentFormDataInterface) => {
    const transaction = await handleSubmitDeposit(data);
    setTransaction(transaction);
    return transaction;
  };

  const handleDeletePaymentMethod = async (
    paymentMethod: GIDXPaymentMethod,
  ) => {
    const session = createMerchantTransactionData?.session;
    if (!session) {
      toast.error('Invalid session! Please refresh the page.');
      return;
    }
    setSelectedPaymentMethod(undefined);
    try {
      await mutateAccountSavePaymentMethod({
        fullName: verifiedData?.firstname || '',
        billingAddress: {
          address1: verifiedData?.address1,
          address2: verifiedData?.address2,
          city: verifiedData?.city,
          state: verifiedData?.state,
          postalCode: verifiedData?.postalCode,
          countyCode: 'US',
        },
        paymentMethod: {
          type: paymentMethod?.Type as PaymentMethodType,
          ...((paymentMethod?.Type as PaymentMethodType) ===
            PaymentMethodType.CC && {
            creditCard: {
              token: paymentMethod.Token,
              cardNumber: '',
              cardExpirationDate: '',
              cvv: 111,
              cardType: '',
            },
          }),
          ...(selectedPaymentMethod?.type === PaymentMethodType.ACH && {
            ach: {
              token: paymentMethod.Token,
              accountNumber: '',
              routingNumber: '',
            },
          }),
        },
        session,
        save: false,
      });
      await handleCreateMerchantTransactionData();
    } catch (error) {
      const e = error as TRPCClientError<any>;
      toast.error(e?.message);
    }
  };

  const depositAmountOptions = useMemo(
    () =>
      appSettings
        ? appSettings
            .find(
              (appSetting) =>
                appSetting.name === AppSettingName.DEPOSIT_AMOUNT_OPTIONS,
            )
            ?.value.split(',')
            .map((option) => Number(option)) || []
        : [],
    [appSettings],
  );

  const steps = useMemo(
    () => [
      {
        label: 'Input Deposit',
        content: (
          <DepositAmount
            minDepositAmount={minDepositAmount}
            setDepositAmount={setDepositAmount}
            handleNext={handleNextDepositAmount}
            isFirstDeposit={isFirstDeposit}
            depositAmount={depositAmount}
            maxMatchDeposit={maxMatchDeposit}
            depositAmountOptions={depositAmountOptions}
            reloadBonusAmount={reloadBonusAmount}
            reloadBonusType={reloadBonusType}
            showBonusCreditStyles={isFirstDeposit || reloadBonusAmount > 0}
          />
        ),
      },
      {
        label: 'Choose method',
        content: (
          <DepositMethod
            depositAmount={depositAmount}
            handleBack={handleBack}
            handleNext={handleNextSubmitDeposit}
            paymentMethods={PAYMENT_METHODS}
            onPaymentSelect={onPaymentSelect}
            selectedPaymentMethod={selectedPaymentMethod}
            verifiedData={verifiedData}
            handleCancel={handleCancel}
            savedPaymentMethods={
              createMerchantTransactionData?.gidxSession.PaymentMethods
            }
            handlePaypalNext={handlePaypalNext}
            handleDeletePaymentMethod={handleDeletePaymentMethod}
            isLoading={
              savedPaymentMethodLoading || createMerchantTransactionDataLoading
            }
          />
        ),
      },
      {
        label: 'Confirmation',
        content: (
          <DepositConfirmation
            depositAmount={depositAmount}
            transaction={transaction}
          />
        ),
      },
    ],
    [
      activeStep,
      isFirstDeposit,
      depositAmount,
      reloadBonusAmount,
      reloadBonusType,
      selectedPaymentMethod,
      deviceGPS,
      transaction,
      maxMatchDeposit,
      handleNext,
      handleBack,
      savedPaymentMethodLoading,
      createMerchantTransactionDataLoading,
      minDepositAmount,
    ],
  );

  return (
    <div className="flex flex-col w-full h-full gap-4">
      {steps[activeStep]?.content}
      <BackdropLoading
        open={
          isLoading ||
          nextLoading ||
          savedPaymentMethodLoading ||
          createMerchantTransactionDataLoading
        }
      />
      <GetVerifiedDialog
        open={openVerifyDialog}
        handleClose={() => setOpenVerifyDialog(false)}
        onSubmit={handleSubmitRegisterUser}
        isLoading={mutateAccountRegisterLoading}
        hasError={!!registerError}
        verifiedData={userDetails || verifiedData}
      />
      <DepositDeclineDialog
        open={openDeclineDialog}
        setOpen={setOpenDeclineDialog}
        type={selectedPaymentMethod?.type}
        errorCode={transaction?.code}
        errorMessage={transaction?.errorMessage}
      />
      <SessionExpiredDialog
        setOpen={setOpenSessionExpiredDialog}
        open={openSessionExpiredDialog}
      />

      <AchProcessingInfoDialog
        open={achDialogOpen}
        handleClose={handleAchDialogClose}
      />
    </div>
  );
};

export default AccountDepositContainer;
