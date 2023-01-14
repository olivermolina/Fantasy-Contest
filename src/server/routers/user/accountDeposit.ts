import { t } from '~/server/trpc';
import { TRPCError } from '@trpc/server';
import {
  AppSettingName,
  PaymentMethodType,
  Session,
  Transaction,
  TransactionType,
} from '@prisma/client';
import * as yup from '~/utils/yup';
import GIDX, {
  BillingAddressInterface,
  GidxPaymentMethodInterface,
} from '~/lib/tsevo-gidx/GIDX';
import { prisma } from '~/server/prisma';
import dayjs from 'dayjs';
import { ActionType } from '~/constants/ActionType';
import { createTransaction } from '~/server/routers/bets/createTransaction';
import { CustomErrorMessages } from '~/constants/CustomErrorMessages';

export interface AccountDepositResponseInterface {
  transactionId: string | number;
  paymentMethod: string;
  status: string;
  dateTime: string;
  depositAmount: number;
  depositBonus: number;
  code?: string | number;
  errorMessage?: string;
  action?: string;
  paypalClientId?: string;
  orderId?: string;
  url?: string;
}

const accountDeposit = t.procedure
  .input(
    yup.object({
      fullName: yup.string().required(),
      amountProcess: yup.number().required(),
      amountBonus: yup.number().required(),
      billingAddress: yup.mixed<BillingAddressInterface>().required(),
      paymentMethod: yup.mixed<GidxPaymentMethodInterface>().required(),
      session: yup.mixed<Session>().required(),
      transaction: yup.mixed<Transaction>().required(),
    }),
  )
  .mutation(async ({ input, ctx }) => {
    const userId = ctx.session.user?.id;
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!userId || !user) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'User not found',
      });
    }

    try {
      const {
        fullName,
        amountProcess,
        amountBonus,
        billingAddress,
        paymentMethod,
        session,
        transaction,
      } = input;

      const gidx = await new GIDX(user, ActionType.PAY, session);

      // Complete transaction GIDX session
      const data = await gidx.completeSession({
        fullName,
        transaction,
        amountBonus,
        amountProcess,
        billingAddress,
        paymentMethod,
      });

      let paymentMethodTypeDesc;
      switch (paymentMethod.type) {
        case PaymentMethodType.ACH:
          paymentMethodTypeDesc = `${data?.PaymentDetails[0]?.PaymentMethodAccount} ${data?.PaymentDetails[0]?.PaymentMethod?.DisplayName}`;
          break;
        case PaymentMethodType.CC:
          const network = data?.PaymentDetails[0]?.PaymentMethod?.Network || '';
          paymentMethodTypeDesc = `${network} ${data?.PaymentDetails[0]?.PaymentMethod?.CardNumber}`;
          break;
        case PaymentMethodType.Paypal:
          paymentMethodTypeDesc = 'PAYPAL';
          break;
        default:
          paymentMethodTypeDesc = '';
      }

      await prisma.transactionStatus.create({
        data: {
          transactionId: transaction.id,
          statusCode: Number(data?.PaymentDetails[0]?.PaymentStatusCode) || 0,
          statusMessage: data?.PaymentDetails[0]?.PaymentStatusMessage,
          transactionType: TransactionType.CREDIT,
          transactionScore:
            data?.PaymentDetails[0]?.FinancialConfidenceScore || 0,
          transactionMethod: paymentMethodTypeDesc,
          transactionMethodType: paymentMethod.type as PaymentMethodType,
          transactionMethodAccount:
            data?.PaymentDetails[0]?.PaymentMethodAccount || '',
          approvalDateTime:
            data?.PaymentDetails[0]?.PaymentApprovalDateTime || '',
          statusDateTime: data?.PaymentDetails[0]?.PaymentStatusDateTime || '',
        },
      });

      const paymentStatus = data?.PaymentDetails[0]?.PaymentStatusMessage || '';

      const depositResponse: AccountDepositResponseInterface = {
        transactionId: transaction.id,
        paymentMethod: paymentMethodTypeDesc,
        status: paymentStatus,
        code: data?.PaymentDetails[0]?.PaymentStatusCode,
        dateTime: dayjs(
          data?.PaymentDetails[0]?.PaymentApprovalDateTime,
        ).format('MM/DD/YYYY hh:mm A'),
        depositAmount: amountProcess,
        depositBonus: amountBonus,
        paypalClientId: data?.Action?.ClientID,
        orderId: data?.Action?.OrderID,
        url: data?.Action?.URL,
      };

      if (user.isFirstDeposit && paymentStatus === 'Complete') {
        // Disable isFirstDeposit after a successful deposit
        await prisma.user.update({
          where: { id: user.id },
          data: {
            isFirstDeposit: false,
          },
        });

        const referralUser = await prisma.user.findFirst({
          where: {
            username: user.referral,
          },
        });

        if (referralUser) {
          const referralAppSetting = await prisma.appSettings.findFirst({
            where: {
              name: AppSettingName.REFERRAL_CREDIT_AMOUNT,
            },
          });
          await createTransaction({
            userId: referralUser.id,
            amountProcess: 0,
            amountBonus: Number(referralAppSetting?.value) || 25,
            actionType: ActionType.ADD_FREE_CREDIT,
            transactionType: TransactionType.CREDIT,
          });
        }
      }

      if (!user.isFirstDeposit) {
        const reloadBonusAppSetting = await prisma.appSettings.findFirst({
          where: {
            name: AppSettingName.RELOAD_BONUS_AMOUNT,
          },
        });
        if (reloadBonusAppSetting && Number(reloadBonusAppSetting.value) > 0) {
          await createTransaction({
            userId,
            amountProcess: 0,
            amountBonus: Number(reloadBonusAppSetting.value),
            actionType: ActionType.ADD_FREE_CREDIT,
            transactionType: TransactionType.CREDIT,
          });
        }
      }

      return depositResponse;
    } catch (e: any) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: CustomErrorMessages.ACCOUNT_TRANSACTION,
      });
    }
  });

export default accountDeposit;
