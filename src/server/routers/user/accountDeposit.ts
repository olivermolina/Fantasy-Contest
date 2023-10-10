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
import { CustomErrorMessages } from '~/constants/CustomErrorMessages';
import referralBonus from '~/server/routers/user/referralBonus';
import { PaymentStatusCode } from '~/constants/PaymentStatusCode';
import { getUserSettings } from '~/server/routers/appSettings/list';
import { DefaultAppSettings } from '~/constants/AppSettings';
import { isAuthenticated } from '~/server/routers/middleware/isAuthenticated';
import createTransaction from '~/server/routers/bets/createTransaction';

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

const accountDeposit = isAuthenticated
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
        message: CustomErrorMessages.USER_NOT_FOUND,
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

      let transactionMethod;
      let statusCode =
        Number(data?.PaymentDetails[0]?.PaymentStatusCode) ||
        PaymentStatusCode.PENDING;
      let statusMessage = data?.PaymentDetails[0]?.PaymentStatusMessage || '';
      switch (paymentMethod.type) {
        case PaymentMethodType.ACH:
          transactionMethod = `${data?.PaymentDetails[0]?.PaymentMethodAccount} ${data?.PaymentDetails[0]?.PaymentMethod?.DisplayName}`;
          const { userAppSettings } = await getUserSettings(user.id);
          const ACH_DEPOSIT_AUTO_APPROVE_COUNT = Number(
            userAppSettings.find(
              (s) => s.name === AppSettingName.ACH_DEPOSIT_AUTO_APPROVE_COUNT,
            )?.value || DefaultAppSettings.ACH_DEPOSIT_AUTO_APPROVE_COUNT,
          );
          const achCompletedTransactionsCount = await prisma.transaction.count({
            where: {
              userId: user.id,
              actionType: {
                in: [ActionType.PAY],
              },
              TransactionStatuses: {
                every: {
                  statusCode: PaymentStatusCode.COMPLETE,
                  transactionMethod,
                },
              },
              NOT: {
                TransactionStatuses: {
                  none: {},
                },
              },
            },
          });
          const autoApprove =
            achCompletedTransactionsCount >= ACH_DEPOSIT_AUTO_APPROVE_COUNT;
          statusCode = autoApprove ? PaymentStatusCode.COMPLETE : statusCode;
          statusMessage = autoApprove ? 'Complete' : statusMessage;
          break;
        case PaymentMethodType.CC:
          const network = data?.PaymentDetails[0]?.PaymentMethod?.Network || '';
          transactionMethod = `${network} ${data?.PaymentDetails[0]?.PaymentMethod?.CardNumber}`;
          break;
        case PaymentMethodType.Paypal:
          transactionMethod = 'PAYPAL';
          break;
        default:
          transactionMethod = '';
      }

      await prisma.transactionStatus.create({
        data: {
          transactionId: transaction.id,
          statusCode,
          statusMessage,
          transactionType: TransactionType.CREDIT,
          transactionScore:
            data?.PaymentDetails[0]?.FinancialConfidenceScore || 0,
          transactionMethod,
          transactionMethodType: paymentMethod.type as PaymentMethodType,
          transactionMethodAccount:
            data?.PaymentDetails[0]?.PaymentMethodAccount || '',
          approvalDateTime:
            data?.PaymentDetails[0]?.PaymentApprovalDateTime || '',
          statusDateTime: data?.PaymentDetails[0]?.PaymentStatusDateTime || '',
        },
      });

      const depositResponse: AccountDepositResponseInterface = {
        transactionId: transaction.id,
        paymentMethod: transactionMethod,
        status: statusMessage,
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

      if (statusMessage === 'Complete') {
        await createTransaction({
          transactionId: transaction.id,
          userId,
          amountProcess,
          amountBonus,
          transactionType: TransactionType.CREDIT,
          actionType: ActionType.PAY,
        });
        await referralBonus(user);
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
